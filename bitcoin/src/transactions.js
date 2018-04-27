const bitcoin = require("bitcoinjs-lib" )
const ECPair = bitcoin.ECPair
const networks = bitcoin.networks
const TransactionBuilder = bitcoin.TransactionBuilder
const Transaction = bitcoin.Transaction
const bscript = bitcoin.script
const opcodes = bitcoin.opcodes
const fs = require("fs")


const walletStr = fs.readFileSync("./wallet.json")
const wallet = JSON.parse(walletStr)

const DEFAULT_SEQUENCE = 0xffffffff

// tx with available utxo
const inputTxData = {
    txHash: "8d5f0678e28ba528786b0c9126d9ebde77455499d590f0c51bd057d8da2bb939",
    vout:0,
    txHex:"0100000000010117011a62e061d0d10d5efa8ec358ff4be2fbee04a79fb0e1f991bd41bb7816fe010000001716001471349062ddfc6aa195b596f89643f343b4c234aaffffffff0240d2df03000000001976a914c0c94cffae809df08f34199b22790d5e7b28c66d88ac04dc924f1300000017a91467d4e2f8d159714111ccd5d606698ce495cedcd9870247304402206f16d12990853fc46efd1d38d6857d804b99bc31fdc80c9c6256686b9a49cdfd022035d84b2d39512bc36d2245e8160ee33b0abc2b08015bdc8d68b07d3b43647b8301210218c88a6530996c1b28905e17e928bdad36c98cf2f063cd5f8e5e8f7b1c5d9dca00000000"
}

//create lock script(scriptPubKey)
const lockScript = []

lockScript.push(opcodes.OP_3)
lockScript.push(opcodes.OP_EQUAL)

const scriptPubKey = bscript.compile(lockScript)

//create unlock script(scriptSig)
const unlockScript = []

unlockScript.push(opcodes.OP_8);
unlockScript.push(opcodes.OP_5);
unlockScript.push(opcodes.OP_SUB);

const scriptSig = bscript.compile(unlockScript)


//create lockTx
const inTx = Transaction.fromHex(inputTxData.txHex)

const lockTxBuilder= new TransactionBuilder(networks.testnet)


lockTxBuilder.addInput(inputTxData.txHash, inputTxData.vout)

const lockFee = 1000000

lockTxBuilder.addOutput(scriptPubKey, inTx.outs[inputTxData.vout].value-lockFee)

const key = ECPair.fromWIF(wallet.keyPairs[0].privKey, networks.testnet)
lockTxBuilder.sign(0, key)

const lockTxHex = lockTxBuilder.build().toHex()

console.log("lockTxHex ", lockTxHex);


//create unlockTx
const lockTxData = {
    txHash: "24aea4d57cd0158c0dabeca9c45df1d560c18d4d0220164a12c6f8796c2af1e4",
    vout: 0,
    txHex: "010000000139b92bdad857d01bc5f090d599544577deebd926910c6b7828a58be278065f8d000000006a47304402207f1d72840f08a6309d3634badd44b15214937cab707b5abb45ac7d144cb3de0e02205d9e8f2baefbd1613992df3f9f1b21d464528ac8ccac90b5575f9af1cc13fd72012103e8856cc754e6339e38069ca0b0cfcbaa2b610b5ae10104ce50632865d0e36f7effffffff010090d0030000000002538700000000"
}

const lockTx = Transaction.fromHex(lockTxData.txHex)

const unlockTxBuilder= new TransactionBuilder(networks.testnet)


const unlockFee = 100000

unlockTxBuilder.addOutput(wallet.keyPairs[1].address , lockTx.outs[lockTxData.vout].value-unlockFee)

const unlockTx = unlockTxBuilder.buildIncomplete()

unlockTx.addInput(lockTx.getHash(), lockTxData.vout, DEFAULT_SEQUENCE, scriptSig)

const unlockTxHex = unlockTx.toHex()

console.log("unlockTxHex ", unlockTxHex)

