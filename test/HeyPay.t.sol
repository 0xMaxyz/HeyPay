// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {HeyPay} from "../src/HeyPay.sol";
import {Base64} from "../src/HeyPay.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {}

    function mint() public {
        _mint(msg.sender, 1000000000);
    }
}

contract HeyPayTest is Test {
    HeyPay public heypay;
    Token public token1;
    Token public token2;
    Token public token3;

    // hoax(alice, 100 ether);

    function setUp() public {
        heypay = new HeyPay();
        token1 = new Token("TEST1", "T1");
        token2 = new Token("TEST2", "T2");
        token3 = new Token("TEST3", "T3");
    }

    function test_DecodeModulus() public {}
}
