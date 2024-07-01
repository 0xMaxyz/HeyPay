// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {HeyPay, ClaimData} from "../src/HeyPay.sol";
import {Base64} from "../src/HeyPay.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../src/jwt/JwtTokenLib.sol";
import "../src/jwt/JwtValidator.sol";
import "../src/jwt/RsaVerifyOptimized.sol";

contract Token is ERC20 {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {}

    function mint() public {
        _mint(msg.sender, 1000000000);
    }
}
event DepositDone(ClaimData indexed cd);
event TokenTransferred();
contract HeyPayTest is Test {
    HeyPay public heypay;
    Token public token1;
    Token public token2;
    Token public token3;
    address sender1;
    address sender2;
    address receiver;

    // hoax(alice, 100 ether);

    function setUp() public {
        heypay = new HeyPay();
        token1 = new Token("TEST1", "T1");
        token2 = new Token("TEST2", "T2");
        token3 = new Token("TEST3", "T3");

        sender1 = makeAddr("sender1");
        sender2 = makeAddr("sender2");
        receiver = makeAddr("receiver");

        deal(address(token1), sender1, 10 ether);
        deal(address(token2), sender1, 10 ether);
        deal(address(token3), sender1, 10 ether);
        deal(address(token1), sender2, 10 ether);
        deal(address(token2), sender2, 10 ether);
        deal(address(token3), sender2, 10 ether);
    }

    function test_DepositEmitsDepositDone() public {
        // approve contract
        vm.startPrank(sender1);
        token1.approve(address(heypay), 1000);
        ClaimData memory cd = ClaimData({
            token_address: address(token1),
            amount: 1000,
            sender_address: sender1,
            memo: "Hello"
        });
        vm.expectEmit(address(heypay));
        emit DepositDone(cd);
        heypay.Deposit(
            keccak256(abi.encode("samsamei1992@gmail.com")),
            bytes("Hello"),
            address(token1),
            1000
        );
        vm.stopPrank();
        console.log(receiver);
    }

    function test_Claim() public {
        vm.startPrank(sender1);
        token1.approve(address(heypay), 1000);
        ClaimData memory cd = ClaimData({
            token_address: address(token1),
            amount: 1000,
            sender_address: sender1,
            memo: "Hello"
        });
        heypay.Deposit(
            keccak256(abi.encode("samsamei1992@gmail.com")),
            bytes("Hello"),
            address(token1),
            1000
        );
        vm.stopPrank();
        // claim the tokens
        bytes memory header = abi.encode("eyJhbGciOiJSUzI1NiIsImtpZCI6IjJhZjkwZTg3YmUxNDBjMjAwMzg4OThhNmVmYTExMjgzZGFiNjAzMWQiLCJ0eXAiOiJKV1QifQ=");
        bytes memory payload = abi.encode("eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIyMjYwNzc5MDE4NzMtOTZjZWsxMjhsOTBjbHJpMGk1NWMwaWk4OGJqYmNzZ2UuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIyMjYwNzc5MDE4NzMtOTZjZWsxMjhsOTBjbHJpMGk1NWMwaWk4OGJqYmNzZ2UuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTE0OTQ1MTM4MjEwODM2Mjg4NzIiLCJlbWFpbCI6InNhbXNhbWVpMTk5MkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibm9uY2UiOiIweEI2RDQ4MDViZjY5NDNjNTg3NUMwQzdiNjdFRGEyNGIyYkRBQ0JGNmUiLCJuYmYiOjE3MTk3ODY4OTYsIm5hbWUiOiJTYW0gVGFoZXIiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jSlQzMjFSa29WZTk0THNacFlVLWV3OTlqN2Rnd0VhakptT2ktTHZMVkFzQzBvaGZ3PXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6IlNhbSIsImZhbWlseV9uYW1lIjoiVGFoZXIiLCJpYXQiOjE3MTk3ODcxOTYsImV4cCI6MTcxOTc5MDc5NiwianRpIjoiNzEyODIxYjE2MTAxYjcxZWUyNWNkOWNkMGMxYzhiYTg3ZDNjZjk2OSJ9");
        bytes memory signature = abi.encode("T3pfqKMUg1OQ3lvTrEsCFGM4uUlM_fs_0JKOgVR-NYs7W_x-JtQfQmBxVsLzc_kLx1yBsZXWSqM_zADv1jzT86YuaSRKl7jLrOgNTJlwpWb1vkSTtLIdlGZEb4Cp0OIClBeRFRMzWvriiV2mRYxOCr2MkBFfjS2Vney-xQhawqu09M-7sF4LIhOClYXZT2J2xuVA5SvFrdd2OqesFCifZpsweUY-2StSh-wU7kNfRkCOB9nwlN184i0iPD9h6hQfFXr2QTzLu9PW_gUs1wfKJfbFmL8iX3lxL-LJ1azG-MKU5np0Ny7w8ZqCJm5lqGTy4f_06otjnniVTodBMtkHFQ==");
        bytes32 digest = sha256(abi.encode("eyJhbGciOiJSUzI1NiIsImtpZCI6IjJhZjkwZTg3YmUxNDBjMjAwMzg4OThhNmVmYTExMjgzZGFiNjAzMWQiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIyMjYwNzc5MDE4NzMtOTZjZWsxMjhsOTBjbHJpMGk1NWMwaWk4OGJqYmNzZ2UuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIyMjYwNzc5MDE4NzMtOTZjZWsxMjhsOTBjbHJpMGk1NWMwaWk4OGJqYmNzZ2UuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTE0OTQ1MTM4MjEwODM2Mjg4NzIiLCJlbWFpbCI6InNhbXNhbWVpMTk5MkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibm9uY2UiOiIweEI2RDQ4MDViZjY5NDNjNTg3NUMwQzdiNjdFRGEyNGIyYkRBQ0JGNmUiLCJuYmYiOjE3MTk3ODY4OTYsIm5hbWUiOiJTYW0gVGFoZXIiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jSlQzMjFSa29WZTk0THNacFlVLWV3OTlqN2Rnd0VhakptT2ktTHZMVkFzQzBvaGZ3PXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6IlNhbSIsImZhbWlseV9uYW1lIjoiVGFoZXIiLCJpYXQiOjE3MTk3ODcxOTYsImV4cCI6MTcxOTc5MDc5NiwianRpIjoiNzEyODIxYjE2MTAxYjcxZWUyNWNkOWNkMGMxYzhiYTg3ZDNjZjk2OSJ9"));
        //  vm.expectEmit(address(heypay));
        //  emit TokenTransferred();
        // heypay.Claim(header, payload,signature,digest);

        // Deserialize the header
        bytes memory decoded_header = Base64.decode(header);
        JwtTokenLib.Claims memory des_header = JwtValidator.getToken(
            decoded_header
        );

        // Check the kid
        
        bytes memory modulus = heypay._getModulus(des_header.kid);
        console.logBytes(modulus);
        // Validate jwt token
        bool isValid = RsaVerifyOptimized.pkcs1Sha256(
            digest,
            signature,
            hex"00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010001",
            modulus
        );
        console.log(isValid);
    }
}

