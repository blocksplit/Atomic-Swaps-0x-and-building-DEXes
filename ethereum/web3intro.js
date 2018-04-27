const fs = require('fs');
const solc = require('solc');
const Web3 = require('web3');
const BigNumber = require('bignumber.js');

const web3 = new Web3("http://localhost:8545");
const account = web3.eth.accounts.privateKeyToAccount('0x3f9ab54e14f476cb6e518e5700185adb99a3ea0aa77c3471fae3ded7498d6d4c');
console.log(account);

// Compile the source code
const input = fs.readFileSync('EIP20.sol');
const output = solc.compile(input.toString(), 1);
const bytecode = output.contracts[':EIP20'].bytecode;
const abi = JSON.parse(output.contracts[':EIP20'].interface);

// Contract object
const contract = new web3.eth.Contract(abi);
// Deploy contract instance
contract.deploy({
    data: '0x' + bytecode,
    arguments: [BigNumber(10).pow(24), 'BlockSplitToken', 18, 'BST']
})
    .send({
        from: '0x86d72Ec4B92210CefDEb8F1C508EfED08186B172',
        gas: 3000000,
        gasPrice: '3000000000'
    }, function (error, transactionHash) { })
    .on('error', function (error) {
        //console.log(error);
    })
    .on('transactionHash', function (transactionHash) {
        //console.log(transactionHash);
    })
    .on('receipt', function (receipt) {
        //console.log(receipt.contractAddress) // contains the new contract address
    })
    .on('confirmation', function (confirmationNumber, receipt) {
        //console.log(receipt);
    })
    .then(function (newContractInstance) {
        //console.log(newContractInstance.options.address) // instance with the new contract address
        var newContract = newContractInstance;
        newContract.methods.balanceOf("0x86d72Ec4B92210CefDEb8F1C508EfED08186B172")
            .call({ from: "0x86d72Ec4B92210CefDEb8F1C508EfED08186B172" })
            .then(function (receipt) {
                console.log("BALANCE: ", receipt);
            });
        
        newContract.methods.transfer("0x01F8c95E4Ed0aa927642F563e6A6ce6d66Ae9932",1111111111)
            .send({ from: "0x86d72Ec4B92210CefDEb8F1C508EfED08186B172" })
            .then(function (receipt) {
                console.log("TRANSFER: ", receipt);
            });
        
    });

