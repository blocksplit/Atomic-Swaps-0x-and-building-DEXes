const bitcoin = require("bitcoinjs-lib" )
const networks = bitcoin.networks
const HDNode = bitcoin.HDNode
const ECPair = bitcoin.ECPair
const bip39 = require("bip39")
const fs = require("fs")

//generate privKey
const keyPair = ECPair.makeRandom({network:networks.testnet})

const wif = keyPair.toWIF()

console.log("private key in wif format ", wif)


//generate address

const base58address = keyPair.getAddress()

console.log("address base 58 check encoded", base58address)


//generate mnemonic

const mnemonic = bip39.generateMnemonic()

console.log("12 word mnemonic ", mnemonic)

//derive needed keys, address's

const seedHex = bip39.mnemonicToSeedHex(mnemonic)

const root = HDNode.fromSeedHex(seedHex, networks.testnet)

const keyPairs = []
const numOfAccounts = 4

for(let i =0; i<=numOfAccounts; i++){

    const keyPair = root.derivePath(`m/0'/0/${i}`).keyPair
    const privKey = keyPair.toWIF()
    const address= keyPair.getAddress()

    keyPairs.push({privKey, address})
}

const wallet = {mnemonic, keyPairs}



if (!fs.existsSync("./wallet.json")) {

    fs.writeFileSync("wallet.json", JSON.stringify(wallet))
}


