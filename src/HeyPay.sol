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
    bytes32 memo;
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
        hex"bddb59ddc7ee878e0995690946efb7c9d755a79f33c521f0b16896fe3a5a5e0a5e6e8d1a9fba98d8812cdc3ee40b5f3a0708b44fb2a6f6651c0dbc6877cf486ed66e410ba1c6581a5c1faa5fd1a890d2ddaa0ebdad469e6a55c6ac274a390fab38194d3469f73382b2c040bdf0ac9000a5deee9aecef21aa23fe37e2bad42da13b64598b033b1836867ff25e774860e245a52b6648715ce12196fd67a258181881f6964844679065539dc17f3c233be6cb78cc312486714883b2f0404830b3fb795bba008900afd31a0cf26a785ee7ec29fccaffea9b2e756d5f883514be1ca455ae24a85318504136ef0d862f2731c662efdc889e284582a40c4c315f3b547b";
    bytes modulus2 =
        hex"cb8f0de8907e00aab5f91bf84a4c0100353e869e335c753e35c094c310fe692f6faf81284fdaab8e827e62691a129abd066bb5c976592bf87ff504b7c44b0ef1173f592bc840226d21a0d0cfc8719389548d4423301e197fdbdd4e67fc29d92d23db426026ee49b2c2e937a08c333d91b97d08db379bdc1255e3bfe495c9402d09afe3a3ec6cfdb2d5e6d02a377fb442c6b0f4f242de957680825adde537868d93325620b8730d603da8f40a3ea49c39fc525cd1fd6b81a73b3f89eb3906b6f35feca1b7459f9e15e976988634c6e92900f4e0c98f74c098abc10d17bab9fce93b74fb158f5bc703abc51a77fba84dec983d79eeccec9f39f435e5c86d1327b9";
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
        bytes32 memo,
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
            uint256 count = claimsIndex[email];
            if (count > 0) {
                // then there are claimables
                for (uint i = 0; i < count; i++) {
                    ClaimData memory cd = claims[email][i];
                    IERC20 token = IERC20(cd.token_address);
                    token.transfer(msg.sender, cd.amount);
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
