// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./jwt/RsaVerifyOptimized.sol";
import "./jwt/Base64.sol";
import "./jwt/JwtValidator.sol";
import "./jwt/JwtTokenLib.sol";
error ZerAmount();
error NotEnoughBalance(uint256 balance, uint256 amount);
error NotEnoughAllowance(uint256 allowance, uint256 amount);
error InvalidKey();
error InvalidAuthToken();
error InvalidAudience();
error InvalidOperation();
error InvalidKeyId(uint256 id);
error NoClaims();

event DepositDone(ClaimData indexed cd);
event TokenTransferred();

struct ClaimData {
    address token_address;
    uint256 amount;
    address sender_address;
    bytes memo;
}

contract HeyPay is Ownable {
    constructor() Ownable(msg.sender){ }
    mapping(bytes32 => ClaimData[]) public claims;
    mapping(bytes32 => uint256) claimsIndex;
    // jwrk keys: https://www.googleapis.com/oauth2/v3/certs
    bytes32 key1 =
        0x496138b14fc36ee7a55ca439577efea5465a2a92a8de4c3678c708ae2fe9a416; // keccak256 of "3d580f0af7ace698a0cee7f230bca594dc6dbb55"
    bytes32 key2 =
        0x350bc373c267c4ec2809cfb90aab4ab71dae8a082be34ad9139028355e95246d; // keccak256 of "2af90e87be140c20038898a6efa11283dab6031d"

    bytes modulus1 =
        hex"726867515a543374394d674e4276395f3471453538434c436244664561526439486750645f5a6d6a67315449596a48683155674d50566556656b7955324a6975555a50626e6c4562763857557378794e4e514a66415476664d625861556372655053645733327a49614d4f6554626e3056585a3374717835497969503049664a742d6b54394d696c47416b654a6e386d653778355f754e474f7069504357516178467854696b565574474f3541624768325054554c7a4b6a566a5a577751725042316671456536417236496d2d3352635a2d7a4f64334e3254686751457a4c4c526534524536625376425155757858396f5f416b59305343565a5a423256686a5159424e334555466d4b7344343672726e65426e363456647579336a5774425958413161764452436c305938795145424f727467696b457a5f686f67344f34454b50356d41565366384979666c5f524d6478724f41513d";
    bytes modulus2 =
        hex"34624154364336456558384473706a653346724158772d6e6e684e6b30346531526d4e61346b6a633043486636506b37727941526c77412d3659696c79504142715166594878363073386f536e787655567072466651322d513861415a4f3762504b53786e6f476c634b45524c326f4c4e41344d73766338394e395935796354685a55706c665f5143313965366a7959584e364e7a2d556e4a53434c72745159387456686856527336316a3441324e5f702d656e41692d723730345169312d762d444b56346556526b436c4b5669706c6f6f384e796a556154394c34766242737350436a79696d4a7a73576e4565316645443563344c6e48654172597a415f46456e334a4a6f747144497a397432566e765a4e544d68697a48455834566e4f526c45574d456652386e34434548517837506351554f6d66717977303867576558516c312d75546a74494761452d7352497639755f76513d3d";
    bytes constant exponent =
        hex"00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010001";
    bytes32 aud =
        0xa1ac514459b3145d341d39cf16611635a8d5d5fc99c9eaa4f84a08c0d8f49b5a; // keccak256 of 226077901873-96cek128l90clri0i55c0ii88bjbcsge.apps.googleusercontent.com

    /// @param email keccack256 of receiver's email address
    /// @param memo a note to send to the receiver
    /// @param tokenAddress the address of the token to send to the receiver
    /// @param amount amount of tokens to send to receiver, the contract should be approved before for the tokenAddress before
    function Deposit(
        bytes32 email,
        bytes memory memo,
        address tokenAddress,
        uint256 amount
    ) external {
        // check amount
        if (amount == 0) {
            revert ZerAmount();
        }
        IERC20 token = IERC20(tokenAddress);
        // check balance
        uint256 balance = token.balanceOf(msg.sender);

        if (balance < amount) {
            revert NotEnoughBalance(balance, amount);
        }
        uint256 allowance = token.allowance(msg.sender, address(this));
        if (allowance < amount) {
            revert NotEnoughAllowance(allowance, amount);
        }
        // transfer amount
        token.transferFrom(msg.sender, address(this), amount);

        ClaimData memory cd = ClaimData({
            token_address: tokenAddress,
            amount: amount,
            sender_address: msg.sender,
            memo: memo
        });
        claims[email].push(cd);
        claimsIndex[email] = claimsIndex[email] + 1;
        
        emit DepositDone(cd);
    }

    function Claim(
        bytes memory _header,
        bytes memory _payload,
        bytes memory _signature,
        bytes32 _digest
        ) external {
            if (checkJwt(_header, _signature, _digest)) {
            // Deserialize the payload
            bytes memory decoded_payload = Base64.decode(_payload);
            JwtTokenLib.Claims memory des_payload = JwtValidator.getToken(
                decoded_payload
            );

            // validate the audience
            if (keccak256(des_payload.aud) != aud) {
                revert InvalidAudience();
            }
            // check if this email has tokens for claiming 
            bytes32 email = keccak256(des_payload.email);

            bytes memory nonce = des_payload.nonce;
            address receiver;
            assembly {
                receiver := mload(add(nonce, 20))
            }

            uint256 count = claimsIndex[email];
            if (count > 0) {
                // then there are claimables
                for (uint i = 0; i < count; i++) {
                    ClaimData memory cd = claims[email][i];
                    IERC20 token = IERC20(cd.token_address);
                    token.transfer(receiver, cd.amount);
                }
                delete claims[email];
                delete claimsIndex[email];
                emit TokenTransferred();
            }
            else
            {
                revert NoClaims();
            }
        }
        }

    function checkJwt(
        bytes memory _header,
        bytes memory _signature,
        bytes32 _digest
    ) private view returns (bool isValid) {
        // Deserialize the header
        bytes memory decoded_header = Base64.decode(_header);
        JwtTokenLib.Claims memory des_header = JwtValidator.getToken(
            decoded_header
        );

        // Check the kid
        bytes memory modulus = _getModulus(des_header.kid);
        // Validate jwt token
        isValid = RsaVerifyOptimized.pkcs1Sha256(
            _digest,
            _signature,
            exponent,
            modulus
        );
    }

    function _getModulus(bytes memory key) private view returns (bytes memory) {
        bytes32 hash = keccak256(key);

        if (hash == key1) {
            return modulus1;
        } else if (hash == key2) {
            return modulus2;
        } else {
            revert InvalidKey();
        }
    }

    function changeKey(uint8 id, bytes32 key, bytes memory modulus) onlyOwner() external {
        if (id == 1) {
            key1 = key;
            modulus1 = modulus;
        }
        else if( id == 2){
            key2 = key;
            modulus2 = modulus;
        }
        else
        {
            revert InvalidKeyId(id);
        }
    }

    function changeAudience(bytes32 _aud) onlyOwner() external {
        aud = _aud;
    }
}
