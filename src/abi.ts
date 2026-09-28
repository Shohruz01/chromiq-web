export const chromiqAbi = [
  {
    type: "function",
    name: "mint",
    stateMutability: "payable",
    inputs: [
      {
        name: "quantity",
        type: "uint256",
      },
    ],
    outputs: [],
  },

  {
    type: "function",
    name: "mintPrice",
    stateMutability: "view",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
  },

  {
    type: "function",
    name: "totalMinted",
    stateMutability: "view",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
  },

  {
    type: "function",
    name: "mintOpen",
    stateMutability: "view",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
  },

  {
    type: "function",
    name: "tokenURI",
    stateMutability: "view",
    inputs: [
      {
        name: "tokenId",
        type: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "string",
      },
    ],
  },

  {
    type: "function",
    name: "ownerOf",
    stateMutability: "view",
    inputs: [
      {
        name: "tokenId",
        type: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "address",
      },
    ],
  },
] as const;
