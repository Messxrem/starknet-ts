
export const tokenAddresses = {
  ETH:            '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
  USDC:           '0x053C91253BC9682c04929cA02ED00b3E423f6710D2ee7e0D5EBB06F3eCF368A8',
  USDT:           '0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8',
  DAI:            '0x00da114221cb83fa859dbdb4c44beeaa0bb37c7537ad5ae66fe5e0efd20e6eb3',
  WBTC:           '0x03fe2b97c1fd336e750087d68b9b867997fd64a2661ff3ca5a7c771641e8e7ac',
}

export const tokensArray = [
tokenAddresses.USDC, 
tokenAddresses.USDT, 
tokenAddresses.DAI
// tokenAddresses.WBTC
];

export const protocols: Record<string, { address: string; entrypoint: string }> = {
'MySwap': {
  address: '0x010884171baf1914edc28d7afb619b40a4051cfae78a094a55d230f19e944a28', 
  entrypoint: 'swap'
},
'JediSwap': {
  address: '0x041fd22b238fa21cfcf5dd45a8548974d8263b3a531a60388411c5e230f97023', 
  entrypoint: 'swap_exact_tokens_for_tokens'
},
'_10KSwap': {
  address: '0x07a6f98c03379b9513ca84cca1373ff452a7462a3b61598f0af5bb27ad7f76d1', 
  entrypoint: 'swapExactTokensForTokens'
},
'SithSwap': {
  address: '0x028c858a586fa12123a1ccb337a0a3b369281f91ea00544d0c086524b759f627', 
  entrypoint: 'swapExactTokensForTokens'
},
'Protoss': {
  address: '0x07a0922657e550ba1ef76531454cb6d203d4d168153a0f05671492982c2f7741', 
  entrypoint: 'swapExactTokensForTokens'
},
'StarknetId': {
  address: '0x05dbdedc203e92749e2e746e2d40a768d966bd243df04a6b712e222bc040a9af',
  entrypoint: 'mint'
},
'StarkVerse': {
  address: '0x060582df2cd4ad2c988b11fdede5c43f56a432e895df255ccd1af129160044b8',
  entrypoint: 'publicMint'
},
'Dmail': {
  address: '0x0454f0bd015e730e5adbb4f080b075fdbf55654ff41ee336203aa2e1ac4d4309',
  entrypoint: 'transaction'
},
'Starkgate': {
  address: '0x073314940630fd6dcda0d772d4c972c4e0a9946bef9dabf4ef84eda8ef542b82',
  entrypoint: 'initiate_withdraw'
},
'Orbiter': {
  address: '0x0173f81c529191726c6e7287e24626fe24760ac44dae2a1f7e02080230f8458b',
  entrypoint: 'transferERC20'
},
'Avnu': {
  address: '0x04270219d365d6b017231b52e92b3fb5d7c8378b05e9abc97724537a80e93b0f',
  entrypoint: 'multi_route_swap'
},
'Fibrous': {
  address: '0x01b23ed400b210766111ba5b1e63e33922c6ba0c45e6ad56ce112e5f4c578e62',
  entrypoint: 'swap'
},
}

export const orbiterBridgesAddresses = [
'0x064a24243f2aabae8d2148fa878276e6e6e452e3941b417f3c33b1649ea83e11',
'0x07b393627bd514d2aa4c83e9f0c468939df15ea3c29980cd8e7be3ec847795f0',
'0x064a24243f2aabae8d2148fa878276e6e6e452e3941b417f3c33b1649ea83e11'
]

export const poolIds: Record<string, number> = {
'0x053C91253BC9682c04929cA02ED00b3E423f6710D2ee7e0D5EBB06F3eCF368A8': 1,
'0x00da114221cb83fa859dbdb4c44beeaa0bb37c7537ad5ae66fe5e0efd20e6eb3': 2,
'0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8': 4
}

export const jediSwapPoolAddresses: Record<string, string> = {
'0x053C91253BC9682c04929cA02ED00b3E423f6710D2ee7e0D5EBB06F3eCF368A8': '0x04d0390b777b424e43839cd1e744799f3de6c176c7e32c1812a41dbd9c19db6a',
'0x00da114221cb83fa859dbdb4c44beeaa0bb37c7537ad5ae66fe5e0efd20e6eb3': '0x045e7131d776dddc137e30bdd490b431c7144677e97bf9369f629ed8d3fb7dd6',
'0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8': '0x045e7131d776dddc137e30bdd490b431c7144677e97bf9369f629ed8d3fb7dd6'
}

export interface TokensData {
path: string[];
poolId: number;
jediSwapPoolAddress: string;
}

export const abiERC20 = [
  {
      "name": "Uint256",
      "size": 2,
      "type": "struct",
      "members": [
          {
              "name": "low",
              "type": "felt",
              "offset": 0
          },
          {
              "name": "high",
              "type": "felt",
              "offset": 1
          }
      ]
  },
  {
      "data": [
          {
              "name": "from_",
              "type": "felt"
          },
          {
              "name": "to",
              "type": "felt"
          },
          {
              "name": "value",
              "type": "Uint256"
          }
      ],
      "keys": [],
      "name": "Transfer",
      "type": "event"
  },
  {
      "data": [
          {
              "name": "owner",
              "type": "felt"
          },
          {
              "name": "spender",
              "type": "felt"
          },
          {
              "name": "value",
              "type": "Uint256"
          }
      ],
      "keys": [],
      "name": "Approval",
      "type": "event"
  },
  {
      "name": "name",
      "type": "function",
      "inputs": [],
      "outputs": [
          {
              "name": "name",
              "type": "felt"
          }
      ],
      "stateMutability": "view"
  },
  {
      "name": "symbol",
      "type": "function",
      "inputs": [],
      "outputs": [
          {
              "name": "symbol",
              "type": "felt"
          }
      ],
      "stateMutability": "view"
  },
  {
      "name": "totalSupply",
      "type": "function",
      "inputs": [],
      "outputs": [
          {
              "name": "totalSupply",
              "type": "Uint256"
          }
      ],
      "stateMutability": "view"
  },
  {
      "name": "decimals",
      "type": "function",
      "inputs": [],
      "outputs": [
          {
              "name": "decimals",
              "type": "felt"
          }
      ],
      "stateMutability": "view"
  },
  {
      "name": "balanceOf",
      "type": "function",
      "inputs": [
          {
              "name": "account",
              "type": "felt"
          }
      ],
      "outputs": [
          {
              "name": "balance",
              "type": "Uint256"
          }
      ],
      "stateMutability": "view"
  },
  {
      "name": "allowance",
      "type": "function",
      "inputs": [
          {
              "name": "owner",
              "type": "felt"
          },
          {
              "name": "spender",
              "type": "felt"
          }
      ],
      "outputs": [
          {
              "name": "remaining",
              "type": "Uint256"
          }
      ],
      "stateMutability": "view"
  },
  {
      "name": "permittedMinter",
      "type": "function",
      "inputs": [],
      "outputs": [
          {
              "name": "minter",
              "type": "felt"
          }
      ],
      "stateMutability": "view"
  },
  {
      "name": "initialized",
      "type": "function",
      "inputs": [],
      "outputs": [
          {
              "name": "res",
              "type": "felt"
          }
      ],
      "stateMutability": "view"
  },
  {
      "name": "get_version",
      "type": "function",
      "inputs": [],
      "outputs": [
          {
              "name": "version",
              "type": "felt"
          }
      ],
      "stateMutability": "view"
  },
  {
      "name": "get_identity",
      "type": "function",
      "inputs": [],
      "outputs": [
          {
              "name": "identity",
              "type": "felt"
          }
      ],
      "stateMutability": "view"
  },
  {
      "name": "initialize",
      "type": "function",
      "inputs": [
          {
              "name": "init_vector_len",
              "type": "felt"
          },
          {
              "name": "init_vector",
              "type": "felt*"
          }
      ],
      "outputs": []
  },
  {
      "name": "transfer",
      "type": "function",
      "inputs": [
          {
              "name": "recipient",
              "type": "felt"
          },
          {
              "name": "amount",
              "type": "Uint256"
          }
      ],
      "outputs": [
          {
              "name": "success",
              "type": "felt"
          }
      ]
  },
  {
      "name": "transferFrom",
      "type": "function",
      "inputs": [
          {
              "name": "sender",
              "type": "felt"
          },
          {
              "name": "recipient",
              "type": "felt"
          },
          {
              "name": "amount",
              "type": "Uint256"
          }
      ],
      "outputs": [
          {
              "name": "success",
              "type": "felt"
          }
      ]
  },
  {
      "name": "approve",
      "type": "function",
      "inputs": [
          {
              "name": "spender",
              "type": "felt"
          },
          {
              "name": "amount",
              "type": "Uint256"
          }
      ],
      "outputs": [
          {
              "name": "success",
              "type": "felt"
          }
      ]
  },
  {
      "name": "increaseAllowance",
      "type": "function",
      "inputs": [
          {
              "name": "spender",
              "type": "felt"
          },
          {
              "name": "added_value",
              "type": "Uint256"
          }
      ],
      "outputs": [
          {
              "name": "success",
              "type": "felt"
          }
      ]
  },
  {
      "name": "decreaseAllowance",
      "type": "function",
      "inputs": [
          {
              "name": "spender",
              "type": "felt"
          },
          {
              "name": "subtracted_value",
              "type": "Uint256"
          }
      ],
      "outputs": [
          {
              "name": "success",
              "type": "felt"
          }
      ]
  },
  {
      "name": "permissionedMint",
      "type": "function",
      "inputs": [
          {
              "name": "recipient",
              "type": "felt"
          },
          {
              "name": "amount",
              "type": "Uint256"
          }
      ],
      "outputs": []
  },
  {
      "name": "permissionedBurn",
      "type": "function",
      "inputs": [
          {
              "name": "account",
              "type": "felt"
          },
          {
              "name": "amount",
              "type": "Uint256"
          }
      ],
      "outputs": []
  }
]

export const abi10KSwap = [
  {
    "name": "Uint256",
    "size": 2,
    "type": "struct",
    "members": [
      {
        "name": "low",
        "type": "felt",
        "offset": 0
      },
      {
        "name": "high",
        "type": "felt",
        "offset": 1
      }
    ]
  },
  {
    "name": "constructor",
    "type": "constructor",
    "inputs": [
      {
        "name": "factory",
        "type": "felt"
      },
      {
        "name": "pairClass",
        "type": "felt"
      }
    ],
    "outputs": []
  },
  {
    "name": "factory",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "factory",
        "type": "felt"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "quote",
    "type": "function",
    "inputs": [
      {
        "name": "amountA",
        "type": "Uint256"
      },
      {
        "name": "reserveA",
        "type": "felt"
      },
      {
        "name": "reserveB",
        "type": "felt"
      }
    ],
    "outputs": [
      {
        "name": "amountB",
        "type": "Uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "getAmountOut",
    "type": "function",
    "inputs": [
      {
        "name": "amountIn",
        "type": "Uint256"
      },
      {
        "name": "reserveIn",
        "type": "felt"
      },
      {
        "name": "reserveOut",
        "type": "felt"
      }
    ],
    "outputs": [
      {
        "name": "amountOut",
        "type": "Uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "getAmountIn",
    "type": "function",
    "inputs": [
      {
        "name": "amountOut",
        "type": "Uint256"
      },
      {
        "name": "reserveIn",
        "type": "felt"
      },
      {
        "name": "reserveOut",
        "type": "felt"
      }
    ],
    "outputs": [
      {
        "name": "amountIn",
        "type": "Uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "getAmountsOut",
    "type": "function",
    "inputs": [
      {
        "name": "amountIn",
        "type": "Uint256"
      },
      {
        "name": "path_len",
        "type": "felt"
      },
      {
        "name": "path",
        "type": "felt*"
      }
    ],
    "outputs": [
      {
        "name": "amounts_len",
        "type": "felt"
      },
      {
        "name": "amounts",
        "type": "Uint256*"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "getAmountsIn",
    "type": "function",
    "inputs": [
      {
        "name": "amountOut",
        "type": "Uint256"
      },
      {
        "name": "path_len",
        "type": "felt"
      },
      {
        "name": "path",
        "type": "felt*"
      }
    ],
    "outputs": [
      {
        "name": "amounts_len",
        "type": "felt"
      },
      {
        "name": "amounts",
        "type": "Uint256*"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "addLiquidity",
    "type": "function",
    "inputs": [
      {
        "name": "tokenA",
        "type": "felt"
      },
      {
        "name": "tokenB",
        "type": "felt"
      },
      {
        "name": "amountADesired",
        "type": "Uint256"
      },
      {
        "name": "amountBDesired",
        "type": "Uint256"
      },
      {
        "name": "amountAMin",
        "type": "Uint256"
      },
      {
        "name": "amountBMin",
        "type": "Uint256"
      },
      {
        "name": "to",
        "type": "felt"
      },
      {
        "name": "deadline",
        "type": "felt"
      }
    ],
    "outputs": [
      {
        "name": "amountA",
        "type": "Uint256"
      },
      {
        "name": "amountB",
        "type": "Uint256"
      },
      {
        "name": "liquidity",
        "type": "Uint256"
      }
    ]
  },
  {
    "name": "removeLiquidity",
    "type": "function",
    "inputs": [
      {
        "name": "tokenA",
        "type": "felt"
      },
      {
        "name": "tokenB",
        "type": "felt"
      },
      {
        "name": "liquidity",
        "type": "Uint256"
      },
      {
        "name": "amountAMin",
        "type": "Uint256"
      },
      {
        "name": "amountBMin",
        "type": "Uint256"
      },
      {
        "name": "to",
        "type": "felt"
      },
      {
        "name": "deadline",
        "type": "felt"
      }
    ],
    "outputs": [
      {
        "name": "amountA",
        "type": "Uint256"
      },
      {
        "name": "amountB",
        "type": "Uint256"
      }
    ]
  },
  {
    "name": "swapExactTokensForTokens",
    "type": "function",
    "inputs": [
      {
        "name": "amountIn",
        "type": "Uint256"
      },
      {
        "name": "amountOutMin",
        "type": "Uint256"
      },
      {
        "name": "path_len",
        "type": "felt"
      },
      {
        "name": "path",
        "type": "felt*"
      },
      {
        "name": "to",
        "type": "felt"
      },
      {
        "name": "deadline",
        "type": "felt"
      }
    ],
    "outputs": [
      {
        "name": "amounts_len",
        "type": "felt"
      },
      {
        "name": "amounts",
        "type": "Uint256*"
      }
    ]
  },
  {
    "name": "swapTokensForExactTokens",
    "type": "function",
    "inputs": [
      {
        "name": "amountOut",
        "type": "Uint256"
      },
      {
        "name": "amountInMax",
        "type": "Uint256"
      },
      {
        "name": "path_len",
        "type": "felt"
      },
      {
        "name": "path",
        "type": "felt*"
      },
      {
        "name": "to",
        "type": "felt"
      },
      {
        "name": "deadline",
        "type": "felt"
      }
    ],
    "outputs": [
      {
        "name": "amounts_len",
        "type": "felt"
      },
      {
        "name": "amounts",
        "type": "Uint256*"
      }
    ]
  },
  {
    "name": "swapExactTokensForTokensSupportingFeeOnTransferTokens",
    "type": "function",
    "inputs": [
      {
        "name": "amountIn",
        "type": "Uint256"
      },
      {
        "name": "amountOutMin",
        "type": "Uint256"
      },
      {
        "name": "path_len",
        "type": "felt"
      },
      {
        "name": "path",
        "type": "felt*"
      },
      {
        "name": "to",
        "type": "felt"
      },
      {
        "name": "deadline",
        "type": "felt"
      }
    ],
    "outputs": []
  }
]
