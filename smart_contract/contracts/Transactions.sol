// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

contract Transactions {
    uint256 transactionCounter;
    event Transfer(address from, address receiver, uint amount, string message, uint256 timestamp, string keyword);

    struct TransferStruct{
        address sender;
        address receiver;
        uint amount;
        string message;
        uint256 timestamp;
        string keyword;
    }

    TransferStruct[] transactions;

    function addToBloackchain() public {

    }

    function getAllTransactions() public view returns (TransferStruct[] memory) {

    }

    function getTransactionCount() public view returns (uint256) {
        
    }


}