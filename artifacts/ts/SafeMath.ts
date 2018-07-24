export const SafeMath = 
{
  "contractName": "SafeMath",
  "abi": [],
  "bytecode": "0x60606040523415600e57600080fd5b603580601b6000396000f3006060604052600080fd00a165627a7a723058207e5c56aa9a56d72ec3a12fa314c290f06a91296db137205626beb89689b737a00029",
  "deployedBytecode": "0x6060604052600080fd00a165627a7a723058207e5c56aa9a56d72ec3a12fa314c290f06a91296db137205626beb89689b737a00029",
  "sourceMap": "117:1021:34:-;;;;;;;;;;;;;;;;;",
  "deployedSourceMap": "117:1021:34:-;;;;;",
  "source": "pragma solidity ^0.4.18;\n\n\n/**\n * @title SafeMath\n * @dev Math operations with safety checks that throw on error\n */\nlibrary SafeMath {\n\n  /**\n  * @dev Multiplies two numbers, throws on overflow.\n  */\n  function mul(uint256 a, uint256 b) internal pure returns (uint256) {\n    if (a == 0) {\n      return 0;\n    }\n    uint256 c = a * b;\n    assert(c / a == b);\n    return c;\n  }\n\n  /**\n  * @dev Integer division of two numbers, truncating the quotient.\n  */\n  function div(uint256 a, uint256 b) internal pure returns (uint256) {\n    // assert(b > 0); // Solidity automatically throws when dividing by 0\n    uint256 c = a / b;\n    // assert(a == b * c + a % b); // There is no case in which this doesn't hold\n    return c;\n  }\n\n  /**\n  * @dev Subtracts two numbers, throws on overflow (i.e. if subtrahend is greater than minuend).\n  */\n  function sub(uint256 a, uint256 b) internal pure returns (uint256) {\n    assert(b <= a);\n    return a - b;\n  }\n\n  /**\n  * @dev Adds two numbers, throws on overflow.\n  */\n  function add(uint256 a, uint256 b) internal pure returns (uint256) {\n    uint256 c = a + b;\n    assert(c >= a);\n    return c;\n  }\n}\n",
  "sourcePath": "zeppelin-solidity/contracts/math/SafeMath.sol",
  "ast": {
    "attributes": {
      "absolutePath": "zeppelin-solidity/contracts/math/SafeMath.sol",
      "exportedSymbols": {
        "SafeMath": [
          10069
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
        "id": 9973,
        "name": "PragmaDirective",
        "src": "0:24:34"
      },
      {
        "attributes": {
          "baseContracts": [
            null
          ],
          "contractDependencies": [
            null
          ],
          "contractKind": "library",
          "documentation": "@title SafeMath\n@dev Math operations with safety checks that throw on error",
          "fullyImplemented": true,
          "linearizedBaseContracts": [
            10069
          ],
          "name": "SafeMath",
          "scope": 10070
        },
        "children": [
          {
            "attributes": {
              "constant": true,
              "implemented": true,
              "isConstructor": false,
              "modifiers": [
                null
              ],
              "name": "mul",
              "payable": false,
              "scope": 10069,
              "stateMutability": "pure",
              "superFunction": null,
              "visibility": "internal"
            },
            "children": [
              {
                "children": [
                  {
                    "attributes": {
                      "constant": false,
                      "name": "a",
                      "scope": 10006,
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
                        "id": 9974,
                        "name": "ElementaryTypeName",
                        "src": "216:7:34"
                      }
                    ],
                    "id": 9975,
                    "name": "VariableDeclaration",
                    "src": "216:9:34"
                  },
                  {
                    "attributes": {
                      "constant": false,
                      "name": "b",
                      "scope": 10006,
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
                        "id": 9976,
                        "name": "ElementaryTypeName",
                        "src": "227:7:34"
                      }
                    ],
                    "id": 9977,
                    "name": "VariableDeclaration",
                    "src": "227:9:34"
                  }
                ],
                "id": 9978,
                "name": "ParameterList",
                "src": "215:22:34"
              },
              {
                "children": [
                  {
                    "attributes": {
                      "constant": false,
                      "name": "",
                      "scope": 10006,
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
                        "id": 9979,
                        "name": "ElementaryTypeName",
                        "src": "261:7:34"
                      }
                    ],
                    "id": 9980,
                    "name": "VariableDeclaration",
                    "src": "261:7:34"
                  }
                ],
                "id": 9981,
                "name": "ParameterList",
                "src": "260:9:34"
              },
              {
                "children": [
                  {
                    "attributes": {
                      "falseBody": null
                    },
                    "children": [
                      {
                        "attributes": {
                          "argumentTypes": null,
                          "commonType": {
                            "typeIdentifier": "t_uint256",
                            "typeString": "uint256"
                          },
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": false,
                          "lValueRequested": false,
                          "operator": "==",
                          "type": "bool"
                        },
                        "children": [
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 9975,
                              "type": "uint256",
                              "value": "a"
                            },
                            "id": 9982,
                            "name": "Identifier",
                            "src": "280:1:34"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "hexvalue": "30",
                              "isConstant": false,
                              "isLValue": false,
                              "isPure": true,
                              "lValueRequested": false,
                              "subdenomination": null,
                              "token": "number",
                              "type": "int_const 0",
                              "value": "0"
                            },
                            "id": 9983,
                            "name": "Literal",
                            "src": "285:1:34"
                          }
                        ],
                        "id": 9984,
                        "name": "BinaryOperation",
                        "src": "280:6:34"
                      },
                      {
                        "children": [
                          {
                            "attributes": {
                              "functionReturnParameters": 9981
                            },
                            "children": [
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "hexvalue": "30",
                                  "isConstant": false,
                                  "isLValue": false,
                                  "isPure": true,
                                  "lValueRequested": false,
                                  "subdenomination": null,
                                  "token": "number",
                                  "type": "int_const 0",
                                  "value": "0"
                                },
                                "id": 9985,
                                "name": "Literal",
                                "src": "303:1:34"
                              }
                            ],
                            "id": 9986,
                            "name": "Return",
                            "src": "296:8:34"
                          }
                        ],
                        "id": 9987,
                        "name": "Block",
                        "src": "288:23:34"
                      }
                    ],
                    "id": 9988,
                    "name": "IfStatement",
                    "src": "276:35:34"
                  },
                  {
                    "attributes": {
                      "assignments": [
                        9990
                      ]
                    },
                    "children": [
                      {
                        "attributes": {
                          "constant": false,
                          "name": "c",
                          "scope": 10006,
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
                            "id": 9989,
                            "name": "ElementaryTypeName",
                            "src": "316:7:34"
                          }
                        ],
                        "id": 9990,
                        "name": "VariableDeclaration",
                        "src": "316:9:34"
                      },
                      {
                        "attributes": {
                          "argumentTypes": null,
                          "commonType": {
                            "typeIdentifier": "t_uint256",
                            "typeString": "uint256"
                          },
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": false,
                          "lValueRequested": false,
                          "operator": "*",
                          "type": "uint256"
                        },
                        "children": [
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 9975,
                              "type": "uint256",
                              "value": "a"
                            },
                            "id": 9991,
                            "name": "Identifier",
                            "src": "328:1:34"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 9977,
                              "type": "uint256",
                              "value": "b"
                            },
                            "id": 9992,
                            "name": "Identifier",
                            "src": "332:1:34"
                          }
                        ],
                        "id": 9993,
                        "name": "BinaryOperation",
                        "src": "328:5:34"
                      }
                    ],
                    "id": 9994,
                    "name": "VariableDeclarationStatement",
                    "src": "316:17:34"
                  },
                  {
                    "children": [
                      {
                        "attributes": {
                          "argumentTypes": null,
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": false,
                          "isStructConstructorCall": false,
                          "lValueRequested": false,
                          "names": [
                            null
                          ],
                          "type": "tuple()",
                          "type_conversion": false
                        },
                        "children": [
                          {
                            "attributes": {
                              "argumentTypes": [
                                {
                                  "typeIdentifier": "t_bool",
                                  "typeString": "bool"
                                }
                              ],
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 11798,
                              "type": "function (bool) pure",
                              "value": "assert"
                            },
                            "id": 9995,
                            "name": "Identifier",
                            "src": "339:6:34"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "commonType": {
                                "typeIdentifier": "t_uint256",
                                "typeString": "uint256"
                              },
                              "isConstant": false,
                              "isLValue": false,
                              "isPure": false,
                              "lValueRequested": false,
                              "operator": "==",
                              "type": "bool"
                            },
                            "children": [
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "commonType": {
                                    "typeIdentifier": "t_uint256",
                                    "typeString": "uint256"
                                  },
                                  "isConstant": false,
                                  "isLValue": false,
                                  "isPure": false,
                                  "lValueRequested": false,
                                  "operator": "/",
                                  "type": "uint256"
                                },
                                "children": [
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "overloadedDeclarations": [
                                        null
                                      ],
                                      "referencedDeclaration": 9990,
                                      "type": "uint256",
                                      "value": "c"
                                    },
                                    "id": 9996,
                                    "name": "Identifier",
                                    "src": "346:1:34"
                                  },
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "overloadedDeclarations": [
                                        null
                                      ],
                                      "referencedDeclaration": 9975,
                                      "type": "uint256",
                                      "value": "a"
                                    },
                                    "id": 9997,
                                    "name": "Identifier",
                                    "src": "350:1:34"
                                  }
                                ],
                                "id": 9998,
                                "name": "BinaryOperation",
                                "src": "346:5:34"
                              },
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "overloadedDeclarations": [
                                    null
                                  ],
                                  "referencedDeclaration": 9977,
                                  "type": "uint256",
                                  "value": "b"
                                },
                                "id": 9999,
                                "name": "Identifier",
                                "src": "355:1:34"
                              }
                            ],
                            "id": 10000,
                            "name": "BinaryOperation",
                            "src": "346:10:34"
                          }
                        ],
                        "id": 10001,
                        "name": "FunctionCall",
                        "src": "339:18:34"
                      }
                    ],
                    "id": 10002,
                    "name": "ExpressionStatement",
                    "src": "339:18:34"
                  },
                  {
                    "attributes": {
                      "functionReturnParameters": 9981
                    },
                    "children": [
                      {
                        "attributes": {
                          "argumentTypes": null,
                          "overloadedDeclarations": [
                            null
                          ],
                          "referencedDeclaration": 9990,
                          "type": "uint256",
                          "value": "c"
                        },
                        "id": 10003,
                        "name": "Identifier",
                        "src": "370:1:34"
                      }
                    ],
                    "id": 10004,
                    "name": "Return",
                    "src": "363:8:34"
                  }
                ],
                "id": 10005,
                "name": "Block",
                "src": "270:106:34"
              }
            ],
            "id": 10006,
            "name": "FunctionDefinition",
            "src": "203:173:34"
          },
          {
            "attributes": {
              "constant": true,
              "implemented": true,
              "isConstructor": false,
              "modifiers": [
                null
              ],
              "name": "div",
              "payable": false,
              "scope": 10069,
              "stateMutability": "pure",
              "superFunction": null,
              "visibility": "internal"
            },
            "children": [
              {
                "children": [
                  {
                    "attributes": {
                      "constant": false,
                      "name": "a",
                      "scope": 10024,
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
                        "id": 10007,
                        "name": "ElementaryTypeName",
                        "src": "471:7:34"
                      }
                    ],
                    "id": 10008,
                    "name": "VariableDeclaration",
                    "src": "471:9:34"
                  },
                  {
                    "attributes": {
                      "constant": false,
                      "name": "b",
                      "scope": 10024,
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
                        "id": 10009,
                        "name": "ElementaryTypeName",
                        "src": "482:7:34"
                      }
                    ],
                    "id": 10010,
                    "name": "VariableDeclaration",
                    "src": "482:9:34"
                  }
                ],
                "id": 10011,
                "name": "ParameterList",
                "src": "470:22:34"
              },
              {
                "children": [
                  {
                    "attributes": {
                      "constant": false,
                      "name": "",
                      "scope": 10024,
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
                        "id": 10012,
                        "name": "ElementaryTypeName",
                        "src": "516:7:34"
                      }
                    ],
                    "id": 10013,
                    "name": "VariableDeclaration",
                    "src": "516:7:34"
                  }
                ],
                "id": 10014,
                "name": "ParameterList",
                "src": "515:9:34"
              },
              {
                "children": [
                  {
                    "attributes": {
                      "assignments": [
                        10016
                      ]
                    },
                    "children": [
                      {
                        "attributes": {
                          "constant": false,
                          "name": "c",
                          "scope": 10024,
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
                            "id": 10015,
                            "name": "ElementaryTypeName",
                            "src": "605:7:34"
                          }
                        ],
                        "id": 10016,
                        "name": "VariableDeclaration",
                        "src": "605:9:34"
                      },
                      {
                        "attributes": {
                          "argumentTypes": null,
                          "commonType": {
                            "typeIdentifier": "t_uint256",
                            "typeString": "uint256"
                          },
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": false,
                          "lValueRequested": false,
                          "operator": "/",
                          "type": "uint256"
                        },
                        "children": [
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 10008,
                              "type": "uint256",
                              "value": "a"
                            },
                            "id": 10017,
                            "name": "Identifier",
                            "src": "617:1:34"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 10010,
                              "type": "uint256",
                              "value": "b"
                            },
                            "id": 10018,
                            "name": "Identifier",
                            "src": "621:1:34"
                          }
                        ],
                        "id": 10019,
                        "name": "BinaryOperation",
                        "src": "617:5:34"
                      }
                    ],
                    "id": 10020,
                    "name": "VariableDeclarationStatement",
                    "src": "605:17:34"
                  },
                  {
                    "attributes": {
                      "functionReturnParameters": 10014
                    },
                    "children": [
                      {
                        "attributes": {
                          "argumentTypes": null,
                          "overloadedDeclarations": [
                            null
                          ],
                          "referencedDeclaration": 10016,
                          "type": "uint256",
                          "value": "c"
                        },
                        "id": 10021,
                        "name": "Identifier",
                        "src": "717:1:34"
                      }
                    ],
                    "id": 10022,
                    "name": "Return",
                    "src": "710:8:34"
                  }
                ],
                "id": 10023,
                "name": "Block",
                "src": "525:198:34"
              }
            ],
            "id": 10024,
            "name": "FunctionDefinition",
            "src": "458:265:34"
          },
          {
            "attributes": {
              "constant": true,
              "implemented": true,
              "isConstructor": false,
              "modifiers": [
                null
              ],
              "name": "sub",
              "payable": false,
              "scope": 10069,
              "stateMutability": "pure",
              "superFunction": null,
              "visibility": "internal"
            },
            "children": [
              {
                "children": [
                  {
                    "attributes": {
                      "constant": false,
                      "name": "a",
                      "scope": 10044,
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
                        "id": 10025,
                        "name": "ElementaryTypeName",
                        "src": "848:7:34"
                      }
                    ],
                    "id": 10026,
                    "name": "VariableDeclaration",
                    "src": "848:9:34"
                  },
                  {
                    "attributes": {
                      "constant": false,
                      "name": "b",
                      "scope": 10044,
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
                        "id": 10027,
                        "name": "ElementaryTypeName",
                        "src": "859:7:34"
                      }
                    ],
                    "id": 10028,
                    "name": "VariableDeclaration",
                    "src": "859:9:34"
                  }
                ],
                "id": 10029,
                "name": "ParameterList",
                "src": "847:22:34"
              },
              {
                "children": [
                  {
                    "attributes": {
                      "constant": false,
                      "name": "",
                      "scope": 10044,
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
                        "id": 10030,
                        "name": "ElementaryTypeName",
                        "src": "893:7:34"
                      }
                    ],
                    "id": 10031,
                    "name": "VariableDeclaration",
                    "src": "893:7:34"
                  }
                ],
                "id": 10032,
                "name": "ParameterList",
                "src": "892:9:34"
              },
              {
                "children": [
                  {
                    "children": [
                      {
                        "attributes": {
                          "argumentTypes": null,
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": false,
                          "isStructConstructorCall": false,
                          "lValueRequested": false,
                          "names": [
                            null
                          ],
                          "type": "tuple()",
                          "type_conversion": false
                        },
                        "children": [
                          {
                            "attributes": {
                              "argumentTypes": [
                                {
                                  "typeIdentifier": "t_bool",
                                  "typeString": "bool"
                                }
                              ],
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 11798,
                              "type": "function (bool) pure",
                              "value": "assert"
                            },
                            "id": 10033,
                            "name": "Identifier",
                            "src": "908:6:34"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "commonType": {
                                "typeIdentifier": "t_uint256",
                                "typeString": "uint256"
                              },
                              "isConstant": false,
                              "isLValue": false,
                              "isPure": false,
                              "lValueRequested": false,
                              "operator": "<=",
                              "type": "bool"
                            },
                            "children": [
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "overloadedDeclarations": [
                                    null
                                  ],
                                  "referencedDeclaration": 10028,
                                  "type": "uint256",
                                  "value": "b"
                                },
                                "id": 10034,
                                "name": "Identifier",
                                "src": "915:1:34"
                              },
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "overloadedDeclarations": [
                                    null
                                  ],
                                  "referencedDeclaration": 10026,
                                  "type": "uint256",
                                  "value": "a"
                                },
                                "id": 10035,
                                "name": "Identifier",
                                "src": "920:1:34"
                              }
                            ],
                            "id": 10036,
                            "name": "BinaryOperation",
                            "src": "915:6:34"
                          }
                        ],
                        "id": 10037,
                        "name": "FunctionCall",
                        "src": "908:14:34"
                      }
                    ],
                    "id": 10038,
                    "name": "ExpressionStatement",
                    "src": "908:14:34"
                  },
                  {
                    "attributes": {
                      "functionReturnParameters": 10032
                    },
                    "children": [
                      {
                        "attributes": {
                          "argumentTypes": null,
                          "commonType": {
                            "typeIdentifier": "t_uint256",
                            "typeString": "uint256"
                          },
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": false,
                          "lValueRequested": false,
                          "operator": "-",
                          "type": "uint256"
                        },
                        "children": [
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 10026,
                              "type": "uint256",
                              "value": "a"
                            },
                            "id": 10039,
                            "name": "Identifier",
                            "src": "935:1:34"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 10028,
                              "type": "uint256",
                              "value": "b"
                            },
                            "id": 10040,
                            "name": "Identifier",
                            "src": "939:1:34"
                          }
                        ],
                        "id": 10041,
                        "name": "BinaryOperation",
                        "src": "935:5:34"
                      }
                    ],
                    "id": 10042,
                    "name": "Return",
                    "src": "928:12:34"
                  }
                ],
                "id": 10043,
                "name": "Block",
                "src": "902:43:34"
              }
            ],
            "id": 10044,
            "name": "FunctionDefinition",
            "src": "835:110:34"
          },
          {
            "attributes": {
              "constant": true,
              "implemented": true,
              "isConstructor": false,
              "modifiers": [
                null
              ],
              "name": "add",
              "payable": false,
              "scope": 10069,
              "stateMutability": "pure",
              "superFunction": null,
              "visibility": "internal"
            },
            "children": [
              {
                "children": [
                  {
                    "attributes": {
                      "constant": false,
                      "name": "a",
                      "scope": 10068,
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
                        "id": 10045,
                        "name": "ElementaryTypeName",
                        "src": "1020:7:34"
                      }
                    ],
                    "id": 10046,
                    "name": "VariableDeclaration",
                    "src": "1020:9:34"
                  },
                  {
                    "attributes": {
                      "constant": false,
                      "name": "b",
                      "scope": 10068,
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
                        "id": 10047,
                        "name": "ElementaryTypeName",
                        "src": "1031:7:34"
                      }
                    ],
                    "id": 10048,
                    "name": "VariableDeclaration",
                    "src": "1031:9:34"
                  }
                ],
                "id": 10049,
                "name": "ParameterList",
                "src": "1019:22:34"
              },
              {
                "children": [
                  {
                    "attributes": {
                      "constant": false,
                      "name": "",
                      "scope": 10068,
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
                        "id": 10050,
                        "name": "ElementaryTypeName",
                        "src": "1065:7:34"
                      }
                    ],
                    "id": 10051,
                    "name": "VariableDeclaration",
                    "src": "1065:7:34"
                  }
                ],
                "id": 10052,
                "name": "ParameterList",
                "src": "1064:9:34"
              },
              {
                "children": [
                  {
                    "attributes": {
                      "assignments": [
                        10054
                      ]
                    },
                    "children": [
                      {
                        "attributes": {
                          "constant": false,
                          "name": "c",
                          "scope": 10068,
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
                            "id": 10053,
                            "name": "ElementaryTypeName",
                            "src": "1080:7:34"
                          }
                        ],
                        "id": 10054,
                        "name": "VariableDeclaration",
                        "src": "1080:9:34"
                      },
                      {
                        "attributes": {
                          "argumentTypes": null,
                          "commonType": {
                            "typeIdentifier": "t_uint256",
                            "typeString": "uint256"
                          },
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": false,
                          "lValueRequested": false,
                          "operator": "+",
                          "type": "uint256"
                        },
                        "children": [
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 10046,
                              "type": "uint256",
                              "value": "a"
                            },
                            "id": 10055,
                            "name": "Identifier",
                            "src": "1092:1:34"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 10048,
                              "type": "uint256",
                              "value": "b"
                            },
                            "id": 10056,
                            "name": "Identifier",
                            "src": "1096:1:34"
                          }
                        ],
                        "id": 10057,
                        "name": "BinaryOperation",
                        "src": "1092:5:34"
                      }
                    ],
                    "id": 10058,
                    "name": "VariableDeclarationStatement",
                    "src": "1080:17:34"
                  },
                  {
                    "children": [
                      {
                        "attributes": {
                          "argumentTypes": null,
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": false,
                          "isStructConstructorCall": false,
                          "lValueRequested": false,
                          "names": [
                            null
                          ],
                          "type": "tuple()",
                          "type_conversion": false
                        },
                        "children": [
                          {
                            "attributes": {
                              "argumentTypes": [
                                {
                                  "typeIdentifier": "t_bool",
                                  "typeString": "bool"
                                }
                              ],
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 11798,
                              "type": "function (bool) pure",
                              "value": "assert"
                            },
                            "id": 10059,
                            "name": "Identifier",
                            "src": "1103:6:34"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "commonType": {
                                "typeIdentifier": "t_uint256",
                                "typeString": "uint256"
                              },
                              "isConstant": false,
                              "isLValue": false,
                              "isPure": false,
                              "lValueRequested": false,
                              "operator": ">=",
                              "type": "bool"
                            },
                            "children": [
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "overloadedDeclarations": [
                                    null
                                  ],
                                  "referencedDeclaration": 10054,
                                  "type": "uint256",
                                  "value": "c"
                                },
                                "id": 10060,
                                "name": "Identifier",
                                "src": "1110:1:34"
                              },
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "overloadedDeclarations": [
                                    null
                                  ],
                                  "referencedDeclaration": 10046,
                                  "type": "uint256",
                                  "value": "a"
                                },
                                "id": 10061,
                                "name": "Identifier",
                                "src": "1115:1:34"
                              }
                            ],
                            "id": 10062,
                            "name": "BinaryOperation",
                            "src": "1110:6:34"
                          }
                        ],
                        "id": 10063,
                        "name": "FunctionCall",
                        "src": "1103:14:34"
                      }
                    ],
                    "id": 10064,
                    "name": "ExpressionStatement",
                    "src": "1103:14:34"
                  },
                  {
                    "attributes": {
                      "functionReturnParameters": 10052
                    },
                    "children": [
                      {
                        "attributes": {
                          "argumentTypes": null,
                          "overloadedDeclarations": [
                            null
                          ],
                          "referencedDeclaration": 10054,
                          "type": "uint256",
                          "value": "c"
                        },
                        "id": 10065,
                        "name": "Identifier",
                        "src": "1130:1:34"
                      }
                    ],
                    "id": 10066,
                    "name": "Return",
                    "src": "1123:8:34"
                  }
                ],
                "id": 10067,
                "name": "Block",
                "src": "1074:62:34"
              }
            ],
            "id": 10068,
            "name": "FunctionDefinition",
            "src": "1007:129:34"
          }
        ],
        "id": 10069,
        "name": "ContractDefinition",
        "src": "117:1021:34"
      }
    ],
    "id": 10070,
    "name": "SourceUnit",
    "src": "0:1139:34"
  },
  "compiler": {
    "name": "solc",
    "version": "0.4.18+commit.9cf6e910.Emscripten.clang"
  },
  "networks": {},
  "schemaVersion": "1.0.1",
  "updatedAt": "2018-07-24T01:55:45.041Z"
}