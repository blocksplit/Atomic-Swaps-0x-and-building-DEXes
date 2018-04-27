const bitcoin = require("bitcoinjs-lib" )
const networks = bitcoin.networks
const HDNode = bitcoin.HDNode
const bip39 = require("bip39")
const fs = require("fs")
const TransactionBuilder = bitcoin.TransactionBuilder
const Transaction = bitcoin.Transaction
const bscript = bitcoin.script
const opcodes = bitcoin.opcodes

const txBuilder = new TransactionBuilder(networks.testnet)
// const address =

const DEFAULT_SEQUENCE = 0xffffffff

const wif = bitcoin.ECPair.makeRandom().toWIF()

const ECpair = bitcoin.ECPair.makeRandom()

const testAddress = ECpair.getAddress()

// const testMemnonic = bip39.generateMnemonic()

const testMemnonic = "million wedding trim rotate hospital tennis creek current suffer balcony actress duty"

const message = `wif: ${wif}
address: ${testAddress}
mnemonic: ${testMemnonic}`

// https://chain.so/api/v2/tx/BTCTEST/52e741c7382ca3e79b88f1f664177f7d948ea0b4e27aa2540c5a963397bc63a4


console.log("hi")
console.log(wif)
console.log(testAddress)
console.log(message)


// TODO: generate a derived key

const seedHex = bip39.mnemonicToSeedHex(testMemnonic)

console.log(seedHex)

const root = HDNode.fromSeedHex(seedHex, networks.testnet)

const key = root.derivePath("m/0'/0/0").keyPair
const key1 = root.derivePath("m/0'/0/1").keyPair

// HDNode.deriveKey()

console.log(key.getAddress())
console.log(key1.getAddress())

const key1Address = "mqp5of841kcNX4d5rSke42rzpteMEVy28X"

// TODO: generate a hardened derived key

// TODO: generate mnemonic, derive a key, derive a address, write it to file

// fs.writeFileSync("topSecret", message)

// txBuilder.addOutput()

// ------------------------------
// TODO: generate a transaction where you transfer funds from one address to another
const inputTx = {
    txHash: "52e741c7382ca3e79b88f1f664177f7d948ea0b4e27aa2540c5a963397bc63a4",
    vout: 0,
    txHex: "01000000000101ab905740c9f9989916ee49b8a58edfd13b1835dffdcc041e3e8ab55cd46001a601000000171600143d8359584de144f5c32a0eeb6893722ea9fa8414ffffffff0240d2df03000000001976a9141a0ccf7a34b5e74bd33e560ee105b4e4f11b99eb88ac247456b61300000017a9142ac6fe9ffd92f90d3fe129666204f9d3de9f9aad870247304402203a51766bf430cb7f9bca9a39c87b8fbe1fd7b504a96dec08492589ea252b2adb022043d0f88099c9bbe2d0129094f9fc2b6aa4646cce42bc532d05b3a2500245eff4012103abbf10c3902e8a7269161caa3756103e7fe06468f0484ac8b288cf6a7858c78900000000"
}

const inputTx1 = {
    txHash: "6c4e0d2de75913f12d8214f2f72a64cefc2d1708686ba962665765adac0c625b",
    vout: 0,
    txHex: "010000000001025aa7f90bcb2eccc2f7736cfcb9b700d91487606815e56ea0d2f85ae33d9abc310100000017160014021cabe7a7b32d90b170052b6ad83ac88644049fffffffffdf128601dacaaf8f228a67810d7ba73799355ffbdb6a66a1f00b7c095ef5af3401000000171600148c036149c0d72752861b95c4dce646cbbfe796edffffffff0240d2df03000000001976a9141a0ccf7a34b5e74bd33e560ee105b4e4f11b99eb88acc84c30901300000017a91427b2dbe856f3d3149e9aa003857db086c9410e5f8702473044022017d57eb7704fe0a9a49c0a5f96cc2a1a846c0fd48f4f602943b0117e63358f7802200df8829253fed350c49758ff1a8a46fbb8a0450fcae825c90c448dd88a3c0718012103b34d4e1442e841187ec4a6c6f6a913db8c62e8de7d045558e868c0243181b29a02473044022067bd8c42ed24a9c6ce4624a550a2d0eb80abb0fbcebb7ff129bbdb05745f49bc02204a1630d68c2680ecdbe133acb83295b1776f5bf5edf572b2955d9ab0f16c8b3b012103048d1018f4cb3bcb530794e2ca473970d3f23ceb63368bfd51e3d42291ef36bc00000000"
}

const iTx = Transaction.fromHex(inputTx.txHex)
// console.log(txBuilder);
txBuilder.addInput(inputTx.txHash, inputTx.vout)
// console.log(txBuilder);


const fee = 1000000

txBuilder.addOutput(key1Address, iTx.outs[inputTx.vout].value-fee)


txBuilder.sign(0, key)

const spendTx = txBuilder.build().toHex()

console.log("spendTx ", spendTx)


//-------------------------------------------------------
const lockScript = []
const unlockScript = []

lockScript.push(opcodes.OP_8);
lockScript.push(opcodes.OP_5);
lockScript.push(opcodes.OP_SUB);

//TODO: reverse this

const scriptPubKey = bscript.compile(lockScript)

unlockScript.push(opcodes.OP_3)
unlockScript.push(opcodes.OP_EQUAL)

const scriptSig = bscript.compile(unlockScript)

//--------------------------------

const iTx1 = Transaction.fromHex(inputTx1.txHex)

const lockTxBuilder= new TransactionBuilder(networks.testnet)


lockTxBuilder.addInput(inputTx1.txHash, inputTx1.vout)

console.log("before sign")

lockTxBuilder.addOutput(scriptPubKey, iTx1.outs[inputTx1.vout].value-fee)

lockTxBuilder.sign(0, key)

const lockTxHex = lockTxBuilder.build().toHex()

console.log("lockTx ", lockTxHex)

// -----------------


const lockTxData = {
    txHash: "c69b9af27666bf964c9e01618eebcddeebe829508c112541d03a132c9db1331d",
    vout: 0,
    txHex: "01000000015b620cacad65576662a96b6808172dfcce642af7f214822df11359e72d0d4e6c000000006b4830450221008a932b194289c680fbba34a1116066aca9274b0ca9413a6ef6603452d82d6a250220681a4c65616b6aa587d3d956c8e6fa85d15b6a0fd03a7b639ca9025b102598a6012103f9dcb643b6044ca54b28676a913b22110ea7a6c227e63967d3d73ace4a424740ffffffff010090d003000000000358559400000000"
}

const lockTx = Transaction.fromHex(lockTxData.txHex)

const unlockTxBuilder= new TransactionBuilder(networks.testnet)


console.log("before sign")

const unlockFee = 100000

unlockTxBuilder.addOutput(key1Address, lockTx.outs[inputTx1.vout].value-unlockFee)

// unlockTxBuilder.addInput(lockTxData.txHash, lockTxData.vout, DEFAULT_SEQUENCE, scriptSig)


const unlockTx = unlockTxBuilder.buildIncomplete()

unlockTx.addInput(lockTx.getHash(), lockTxData.vout, DEFAULT_SEQUENCE, scriptSig)

const unlockTxHex = unlockTx.toHex()

console.log("unlockTxHex ", unlockTxHex)



// const lockTX = txBuilder


// TODO:BONUS: generate a transaction where you lock the funds on a condition of =4

// TODO: generate a P2SH tx

// TODO: BONUS: generate atomic swap lockTx

// TODO: BONUS: generate atomic swap unlockTx