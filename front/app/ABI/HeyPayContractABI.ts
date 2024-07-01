export const HeyPayContractABI = [
    { "type": "constructor", "inputs": [], "stateMutability": "nonpayable" },
    {
      "type": "function",
      "name": "Claim",
      "inputs": [
        { "name": "_header", "type": "bytes", "internalType": "bytes" },
        { "name": "_payload", "type": "bytes", "internalType": "bytes" },
        { "name": "_signature", "type": "bytes", "internalType": "bytes" },
        { "name": "_digest", "type": "bytes32", "internalType": "bytes32" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "Deposit",
      "inputs": [
        { "name": "email", "type": "bytes32", "internalType": "bytes32" },
        { "name": "memo", "type": "bytes", "internalType": "bytes" },
        {
          "name": "tokenAddress",
          "type": "address",
          "internalType": "address"
        },
        { "name": "amount", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "changeAudience",
      "inputs": [
        { "name": "_aud", "type": "bytes32", "internalType": "bytes32" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "changeKey",
      "inputs": [
        { "name": "id", "type": "uint8", "internalType": "uint8" },
        { "name": "key", "type": "bytes32", "internalType": "bytes32" },
        { "name": "modulus", "type": "bytes", "internalType": "bytes" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "claims",
      "inputs": [
        { "name": "", "type": "bytes32", "internalType": "bytes32" },
        { "name": "", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [
        {
          "name": "token_address",
          "type": "address",
          "internalType": "address"
        },
        { "name": "amount", "type": "uint256", "internalType": "uint256" },
        {
          "name": "sender_address",
          "type": "address",
          "internalType": "address"
        },
        { "name": "memo", "type": "bytes", "internalType": "bytes" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "owner",
      "inputs": [],
      "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "renounceOwnership",
      "inputs": [],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "transferOwnership",
      "inputs": [
        { "name": "newOwner", "type": "address", "internalType": "address" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "event",
      "name": "DepositDone",
      "inputs": [
        {
          "name": "cd",
          "type": "tuple",
          "indexed": true,
          "internalType": "struct ClaimData",
          "components": [
            {
              "name": "token_address",
              "type": "address",
              "internalType": "address"
            },
            { "name": "amount", "type": "uint256", "internalType": "uint256" },
            {
              "name": "sender_address",
              "type": "address",
              "internalType": "address"
            },
            { "name": "memo", "type": "bytes", "internalType": "bytes" }
          ]
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "OwnershipTransferred",
      "inputs": [
        {
          "name": "previousOwner",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "newOwner",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "TokenTransferred",
      "inputs": [],
      "anonymous": false
    },
    { "type": "error", "name": "InvalidAudience", "inputs": [] },
    { "type": "error", "name": "InvalidKey", "inputs": [] },
    {
      "type": "error",
      "name": "InvalidKeyId",
      "inputs": [{ "name": "id", "type": "uint256", "internalType": "uint256" }]
    },
    { "type": "error", "name": "InvalidToken", "inputs": [] },
    { "type": "error", "name": "JsonParseFailed", "inputs": [] },
    { "type": "error", "name": "NoClaims", "inputs": [] },
    {
      "type": "error",
      "name": "NotEnoughAllowance",
      "inputs": [
        { "name": "allowance", "type": "uint256", "internalType": "uint256" },
        { "name": "amount", "type": "uint256", "internalType": "uint256" }
      ]
    },
    {
      "type": "error",
      "name": "NotEnoughBalance",
      "inputs": [
        { "name": "balance", "type": "uint256", "internalType": "uint256" },
        { "name": "amount", "type": "uint256", "internalType": "uint256" }
      ]
    },
    {
      "type": "error",
      "name": "OwnableInvalidOwner",
      "inputs": [
        { "name": "owner", "type": "address", "internalType": "address" }
      ]
    },
    {
      "type": "error",
      "name": "OwnableUnauthorizedAccount",
      "inputs": [
        { "name": "account", "type": "address", "internalType": "address" }
      ]
    },
    { "type": "error", "name": "ZerAmount", "inputs": [] }
  ] as const