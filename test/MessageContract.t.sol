// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console2} from "forge-std/Test.sol";
import {MessageContract} from "../contracts/MessageContract.sol";

contract MessageContractTest is Test {
    MessageContract public messageContract;
    string constant INITIAL_MESSAGE = "Hello World";
    address public user = makeAddr("user");

    function setUp() public {
        vm.startPrank(user);
        messageContract = new MessageContract(INITIAL_MESSAGE);
        vm.stopPrank();
    }

    function test_Constructor() public view {
        assertEq(messageContract.getMessage(), INITIAL_MESSAGE);
    }

    function test_SetMessage() public {
        string memory newMessage = "New Message";

        // Expect the event to be emitted
        vm.expectEmit(true, true, true, true);
        // The event signature and parameters
        emit MessageUpdated(newMessage, user);

        vm.prank(user);
        messageContract.setMessage(newMessage);

        assertEq(messageContract.getMessage(), newMessage);
    }

    function test_GetMessage() public view {
        assertEq(messageContract.getMessage(), INITIAL_MESSAGE);
    }

    function test_SetMessageByDifferentUser() public {
        address otherUser = makeAddr("otherUser");
        string memory newMessage = "Message from other user";

        // Expect the event to be emitted
        vm.expectEmit(true, true, true, true);
        // The event signature and parameters
        emit MessageUpdated(newMessage, otherUser);

        vm.prank(otherUser);
        messageContract.setMessage(newMessage);

        assertEq(messageContract.getMessage(), newMessage);
    }

    // Define the event here to match the contract's event
    event MessageUpdated(string newMessage, address indexed sender);
}
