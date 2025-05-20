// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MessageContract {
    string public message;

    event MessageUpdated(string newMessage, address indexed sender);

    constructor(string memory initialMessage) {
        message = initialMessage;
        emit MessageUpdated(initialMessage, msg.sender);
    }

    function getMessage() external view returns (string memory) {
        return message;
    }

    function setMessage(string memory newMessage) external {
        message = newMessage;
        emit MessageUpdated(newMessage, msg.sender);
    }
}
