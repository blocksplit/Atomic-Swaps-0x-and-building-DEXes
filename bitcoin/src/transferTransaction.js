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

// tx with available utxo
const inputTx = {
    txHash: "e645c5bbac262e051e78ec48e70f06ab4c346ff8fb36648f354a102c86f4a488",
    vout:0,
    txHex:"02000000017f2fec7a385198060ee23b1ad779d3cea8fd5d193cfe494efbef871d07c3acfc010000006b483045022100b46fc1cb12e6a47900104a50a8a4c4f6e9f9e030fd3d32e3a95677d76d6d071502205bf5ca0de72bc93ce32c4b5bad205c69d753418a7d80244f7fecd86add1b81f60121027be8898d198f35391a7b2197fcc9a8ae760fe491ed864e00935f138bfd8a783afeffffff02fe96be0b000000001976a914d3144ebd1132b551a825eb5ddebf031f8eb7b9f988ac8cd60e871e0000001976a9144ec7025527cced267397ea878429ceea5a57500b88ac0ac11300"
}

const txBuilder = new TransactionBuilder(networks.testnet)

const inTx = Transaction.fromHex(inputTx.txHex)

txBuilder.addInput(inputTx.txHash, inputTx.vout)


const fee = 1000000

txBuilder.addOutput(wallet.keyPairs[3].address, inTx.outs[inputTx.vout].value-fee)

const key = ECPair.fromWIF(wallet.keyPairs[2].privKey, networks.testnet)
txBuilder.sign(0, key)

const spendTxHex = txBuilder.build().toHex()

console.log("transferTx/spendTx/lockTx/ ", spendTxHex)

