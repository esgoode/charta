export const ERC20Basic = 
{
  "contractName": "ERC20Basic",
  "abi": [
    {
      "constant": true,
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "who",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "to",
          "type": "address"
        },
        {
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    }
  ],
  "bytecode": "0x",
  "deployedBytecode": "0x",
  "sourceMap": "",
  "deployedSourceMap": "",
  "source": "pragma solidity ^0.4.18;\n\n\n/**\n * @title ERC20Basic\n * @dev Simpler version of ERC20 interface\n * @dev see https://github.com/ethereum/EIPs/issues/179\n */\ncontract ERC20Basic {\n  function totalSupply() public view returns (uint256);\n  function balanceOf(address who) public view returns (uint256);\n  function transfer(address to, uint256 value) public returns (bool);\n  event Transfer(address indexed from, address indexed to, uint256 value);\n}\n",
  "sourcePath": "zeppelin-solidity/contracts/token/ERC20/ERC20Basic.sol",
  "ast": {
    "attributes": {
      "absolutePath": "zeppelin-solidity/contracts/token/ERC20/ERC20Basic.sol",
      "exportedSymbols": {
        "ERC20Basic": [
          10296
        ]
      }
    },
    "children": [
      {
        "attributes": {
          "literals": [
            "solidity",
            "^",
            "0.4",
            ".18"
          ]
        },
        "id": 10266,
        "name": "PragmaDirective",
        "src": "0:24:38"
      },
      {
        "attributes": {
          "baseContracts": [
            null
          ],
          "contractDependencies": [
            null
          ],
          "contractKind": "contract",
          "documentation": "@title ERC20Basic\n@dev Simpler version of ERC20 interface\n@dev see https://github.com/ethereum/EIPs/issues/179",
          "fullyImplemented": false,
          "linearizedBaseContracts": [
            10296
          ],
          "name": "ERC20Basic",
          "scope": 10297
        },
        "children": [
          {
            "attributes": {
              "body": null,
              "constant": true,
              "implemented": false,
              "isConstructor": false,
              "modifiers": [
                null
              ],
              "name": "totalSupply",
              "payable": false,
              "scope": 10296,
              "stateMutability": "view",
              "superFunction": null,
              "visibility": "public"
            },
            "children": [
              {
                "attributes": {
                  "parameters": [
                    null
                  ]
                },
                "children": [],
                "id": 10267,
                "name": "ParameterList",
                "src": "199:2:38"
              },
              {
                "children": [
                  {
                    "attributes": {
                      "constant": false,
                      "name": "",
                      "scope": 10271,
                      "stateVariable": false,
                      "storageLocation": "default",
                      "type": "uint256",
                      "value": null,
                      "visibility": "internal"
                    },
                    "children": [
                      {
                        "attributes": {
                          "name": "uint256",
                          "type": "uint256"
                        },
                        "id": 10268,
                        "name": "ElementaryTypeName",
                        "src": "223:7:38"
                      }
                    ],
                    "id": 10269,
                    "name": "VariableDeclaration",
                    "src": "223:7:38"
                  }
                ],
                "id": 10270,
                "name": "ParameterList",
                "src": "222:9:38"
              }
            ],
            "id": 10271,
            "name": "FunctionDefinition",
            "src": "179:53:38"
          },
          {
            "attributes": {
              "body": null,
              "constant": true,
              "implemented": false,
              "isConstructor": false,
              "modifiers": [
                null
              ],
              "name": "balanceOf",
              "payable": false,
              "scope": 10296,
              "stateMutability": "view",
              "superFunction": null,
              "visibility": "public"
            },
            "children": [
              {
                "children": [
                  {
                    "attributes": {
                      "constant": false,
                      "name": "who",
                      "scope": 10278,
                      "stateVariable": false,
                      "storageLocation": "default",
                      "type": "address",
                      "value": null,
                      "visibility": "internal"
                    },
                    "children": [
                      {
                        "attributes": {
                          "name": "address",
                          "type": "address"
                        },
                        "id": 10272,
                        "name": "ElementaryTypeName",
                        "src": "254:7:38"
                      }
                    ],
                    "id": 10273,
                    "name": "VariableDeclaration",
                    "src": "254:11:38"
                  }
                ],
                "id": 10274,
                "name": "ParameterList",
                "src": "253:13:38"
              },
              {
                "children": [
                  {
                    "attributes": {
                      "constant": false,
                      "name": "",
                      "scope": 10278,
                      "stateVariable": false,
                      "storageLocation": "default",
                      "type": "uint256",
                      "value": null,
                      "visibility": "internal"
                    },
                    "children": [
                      {
                        "attributes": {
                          "name": "uint256",
                          "type": "uint256"
                        },
                        "id": 10275,
                        "name": "ElementaryTypeName",
                        "src": "288:7:38"
                      }
                    ],
                    "id": 10276,
                    "name": "VariableDeclaration",
                    "src": "288:7:38"
                  }
                ],
                "id": 10277,
                "name": "ParameterList",
                "src": "287:9:38"
              }
            ],
            "id": 10278,
            "name": "FunctionDefinition",
            "src": "235:62:38"
          },
          {
            "attributes": {
              "body": null,
              "constant": false,
              "implemented": false,
              "isConstructor": false,
              "modifiers": [
                null
              ],
              "name": "transfer",
              "payable": false,
              "scope": 10296,
              "stateMutability": "nonpayable",
              "superFunction": null,
              "visibility": "public"
            },
            "children": [
              {
                "children": [
                  {
                    "attributes": {
                      "constant": false,
                      "name": "to",
                      "scope": 10287,
                      "stateVariable": false,
                      "storageLocation": "default",
                      "type": "address",
                      "value": null,
                      "visibility": "internal"
                    },
                    "children": [
                      {
                        "attributes": {
                          "name": "address",
                          "type": "address"
                        },
                        "id": 10279,
                        "name": "ElementaryTypeName",
                        "src": "318:7:38"
                      }
                    ],
                    "id": 10280,
                    "name": "VariableDeclaration",
                    "src": "318:10:38"
                  },
                  {
                    "attributes": {
                      "constant": false,
                      "name": "value",
                      "scope": 10287,
                      "stateVariable": false,
                      "storageLocation": "default",
                      "type": "uint256",
                      "value": null,
                      "visibility": "internal"
                    },
                    "children": [
                      {
                        "attributes": {
                          "name": "uint256",
                          "type": "uint256"
                        },
                        "id": 10281,
                        "name": "ElementaryTypeName",
                        "src": "330:7:38"
                      }
                    ],
                    "id": 10282,
                    "name": "VariableDeclaration",
                    "src": "330:13:38"
                  }
                ],
                "id": 10283,
                "name": "ParameterList",
                "src": "317:27:38"
              },
              {
                "children": [
                  {
                    "attributes": {
                      "constant": false,
                      "name": "",
                      "scope": 10287,
                      "stateVariable": false,
                      "storageLocation": "default",
                      "type": "bool",
                      "value": null,
                      "visibility": "internal"
                    },
                    "children": [
                      {
                        "attributes": {
                          "name": "bool",
                          "type": "bool"
                        },
                        "id": 10284,
                        "name": "ElementaryTypeName",
                        "src": "361:4:38"
                      }
                    ],
                    "id": 10285,
                    "name": "VariableDeclaration",
                    "src": "361:4:38"
                  }
                ],
                "id": 10286,
                "name": "ParameterList",
                "src": "360:6:38"
              }
            ],
            "id": 10287,
            "name": "FunctionDefinition",
            "src": "300:67:38"
          },
          {
            "attributes": {
              "anonymous": false,
              "name": "Transfer"
            },
            "children": [
              {
                "children": [
                  {
                    "attributes": {
                      "constant": false,
                      "indexed": true,
                      "name": "from",
                      "scope": 10295,
                      "stateVariable": false,
                      "storageLocation": "default",
                      "type": "address",
                      "value": null,
                      "visibility": "internal"
                    },
                    "children": [
                      {
                        "attributes": {
                          "name": "address",
                          "type": "address"
                        },
                        "id": 10288,
                        "name": "ElementaryTypeName",
                        "src": "385:7:38"
                      }
                    ],
                    "id": 10289,
                    "name": "VariableDeclaration",
                    "src": "385:20:38"
                  },
                  {
                    "attributes": {
                      "constant": false,
                      "indexed": true,
                      "name": "to",
                      "scope": 10295,
                      "stateVariable": false,
                      "storageLocation": "default",
                      "type": "address",
                      "value": null,
                      "visibility": "internal"
                    },
                    "children": [
                      {
                        "attributes": {
                          "name": "address",
                          "type": "address"
                        },
                        "id": 10290,
                        "name": "ElementaryTypeName",
                        "src": "407:7:38"
                      }
                    ],
                    "id": 10291,
                    "name": "VariableDeclaration",
                    "src": "407:18:38"
                  },
                  {
                    "attributes": {
                      "constant": false,
                      "indexed": false,
                      "name": "value",
                      "scope": 10295,
                      "stateVariable": false,
                      "storageLocation": "default",
                      "type": "uint256",
                      "value": null,
                      "visibility": "internal"
                    },
                    "children": [
                      {
                        "attributes": {
                          "name": "uint256",
                          "type": "uint256"
                        },
                        "id": 10292,
                        "name": "ElementaryTypeName",
                        "src": "427:7:38"
                      }
                    ],
                    "id": 10293,
                    "name": "VariableDeclaration",
                    "src": "427:13:38"
                  }
                ],
                "id": 10294,
                "name": "ParameterList",
                "src": "384:57:38"
              }
            ],
            "id": 10295,
            "name": "EventDefinition",
            "src": "370:72:38"
          }
        ],
        "id": 10296,
        "name": "ContractDefinition",
        "src": "155:289:38"
      }
    ],
    "id": 10297,
    "name": "SourceUnit",
    "src": "0:445:38"
  },
  "compiler": {
    "name": "solc",
    "version": "0.4.18+commit.9cf6e910.Emscripten.clang"
  },
  "networks": {},
  "schemaVersion": "1.0.1",
  "updatedAt": "2018-07-24T01:55:45.061Z"
}