export const ApproveAndCallFallBack = 
{
  "contractName": "ApproveAndCallFallBack",
  "abi": [
    {
      "constant": false,
      "inputs": [
        {
          "name": "from",
          "type": "address"
        },
        {
          "name": "_amount",
          "type": "uint256"
        },
        {
          "name": "_token",
          "type": "address"
        },
        {
          "name": "_data",
          "type": "bytes"
        }
      ],
      "name": "receiveApproval",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ],
  "bytecode": "0x",
  "deployedBytecode": "0x",
  "sourceMap": "",
  "deployedSourceMap": "",
  "source": "pragma solidity 0.4.18;\n\n// External dependencies.\nimport \"zeppelin-solidity/contracts/token/ERC20/ERC20.sol\";\nimport \"zeppelin-solidity/contracts/token/ERC721/ERC721Receiver.sol\";\nimport \"zeppelin-solidity/contracts/math/SafeMath.sol\";\n\nimport \"../ContractRegistry.sol\";\n\nimport \"./Controlled.sol\";\n\ncontract ApproveAndCallFallBack {\n    function receiveApproval(address from, uint256 _amount, address _token, bytes _data) public;\n}\n\n/// Much structure taken from Giveth's MiniMeToken: https://github.com/Giveth/minime\ncontract CrowdfundingToken is Controlled, ERC721Receiver {\n    using SafeMath for uint;\n\n    /// @dev `Checkpoint` is the structure that attaches a block number to a\n    ///  given value, the block number attached is the one that last changed the\n    ///  value\n    struct  Checkpoint {\n\n        // `fromBlock` is the block number that the value was generated from\n        uint fromBlock;\n\n        // `value` is the amount of tokens at a specific block number\n        uint value;\n    }\n\n    string public name;                //The Token's name: e.g. DigixDAO Tokens\n    uint8 public decimals;             //Number of decimals of the smallest unit\n    string public symbol;              //An identifier: e.g. REP\n\n    // the underlying Dharma Debt Token\n    address public debtToken;\n    uint public agreementId;\n    ContractRegistry public contractRegistry;\n\n    // the TokenRegistry index of the token in which repayment to crowdfunding token holders are denominated\n    uint public repaymentTokenIndex;\n\n    Checkpoint[] public repayments;\n\n    // keeps track of how much has been withdrawn from each address;\n    // the inner mapping is of repayment index to whether or not the repayment index has been withdrawn against\n    mapping (address => mapping (uint => bool)) public withdrawals;\n\n    // `balances` is the map that tracks the balance of each address, in this\n    //  contract when the balance changes the block number that the change\n    //  occurred is also included in the map\n    mapping (address => Checkpoint[]) balances;\n\n    // `allowed` tracks any extra transfer rights as in all ERC20 tokens\n    mapping (address => mapping (address => uint256)) allowed;\n\n    // Tracks the history of the `totalSupply` of the token\n    Checkpoint[] totalSupplyHistory;\n\n    // Flag that determines if the token is transferable or not.\n    bool public transfersEnabled;\n\n////////////////\n// Constructor\n////////////////\n\n    /// @notice Constructor to create a CrowdfundingToken\n    /// @param _tokenName Name of the new token\n    /// @param _decimalUnits Number of decimals of the new token\n    /// @param _tokenSymbol Token Symbol for the new token\n    /// @param _transfersEnabled If true, tokens will be able to be transferred\n    function CrowdfundingToken(\n        address _owner,\n        address _debtToken,\n        uint _agreementId,\n        address _contractRegistry,\n        string _tokenName,\n        uint8 _decimalUnits,\n        string _tokenSymbol,\n        uint _repaymentTokenIndex,\n        bool _transfersEnabled\n    )\n        public\n        Controlled(_owner)\n    {\n        debtToken = _debtToken;\n        agreementId = _agreementId;\n        contractRegistry = ContractRegistry(_contractRegistry);\n        name = _tokenName;\n        decimals = _decimalUnits;\n        symbol = _tokenSymbol;\n        repaymentTokenIndex = _repaymentTokenIndex;\n        transfersEnabled = _transfersEnabled;\n    }\n\n///////////////////\n// CrowdfundingToken Methods\n///////////////////\n\n    /**\n     * Registers a repayment amount and block\n     */\n    function registerRepayment(\n        uint _repaymentAmount\n    )\n        external\n        onlyController\n    {\n        // if tokens have not yet been minted, we reject the repayment because we would not\n        // be able to divide the repayment into withdrawal allowances\n        require(totalSupply() > 0);\n\n        updateValueAtNow(repayments, _repaymentAmount);\n    }\n\n    /**\n     * Withdraw the available withdrawal allowance for the repayments beginning and ending at the\n     * given indicies, inclusive.\n     */\n    function withdraw(\n        uint start,\n        uint end\n    )\n        external\n    {\n        // require that the message sender holds at least one token\n        require(balanceOf(msg.sender) > 0);\n\n        // calculate the total amount available for withdrawal for the message sender, beginning and ending\n        // at the given repayment indicies\n        uint withdrawalAmount = getWithdrawalAllowance(msg.sender, start, end);\n\n        // require that the message sender has a positive withdrawal allowance\n        require(withdrawalAmount > 0);\n\n        // ensure contract has enough balance to make repayment transfer\n        address repaymentToken = contractRegistry.tokenRegistry().getTokenAddressByIndex(repaymentTokenIndex);\n\n        require(ERC20(repaymentToken).balanceOf(this) >= withdrawalAmount);\n\n        // transfer the total available amount to the message sender\n        if (\n            ERC20(repaymentToken).transfer(\n                msg.sender,\n                withdrawalAmount\n            )\n        ) {\n            // mark the repayment indices as withdrawn against\n            for (uint i = start; i <= end; i++) {\n                withdrawals[msg.sender][i] = true;\n            }\n        }\n    }\n\n    /**\n     * Returns the number of repayments made so far\n     */\n    function getNumberOfRepaymentsMade(\n    )\n        public\n        view\n        returns (uint numberOfRepaymentsMade)\n    {\n        return repayments.length;\n    }\n\n    /**\n     * Returns the total withdrawal allowance of the given account, as accrued between the start and end repayment\n     * indicies, inclusive.\n     */\n    function getWithdrawalAllowance(\n        address account,\n        uint start,\n        uint end\n    )\n        public\n        view\n        returns (uint totalWithdrawalAllowance)\n    {\n        require(start >= 0);\n\n        require(end < repayments.length);\n\n        mapping (uint => bool) accountWithdrawals = withdrawals[account];\n\n        for (uint i = start; i <= end; i++) {\n            // if the account has already withdrawn against this repayment index, continue\n            if (accountWithdrawals[i]) {\n                continue;\n            }\n\n            Checkpoint storage repaymentCheckpoint = repayments[i];\n\n            uint repaymentAmount = repaymentCheckpoint.value;\n            uint blockNumber = repaymentCheckpoint.fromBlock;\n\n            uint balanceAtBlockNumber = balanceOfAt(account, blockNumber);\n            uint totalSupplyAtBlockNumber = totalSupplyAt(blockNumber);\n\n            totalWithdrawalAllowance = totalWithdrawalAllowance\n                .add(repaymentAmount.mul(balanceAtBlockNumber).div(totalSupplyAtBlockNumber));\n        }\n\n        return totalWithdrawalAllowance;\n    }\n\n///////////////////\n// ERC20 Methods\n///////////////////\n\n    /// @notice Send `_amount` tokens to `_to` from `msg.sender`\n    /// @param _to The address of the recipient\n    /// @param _amount The amount of tokens to be transferred\n    /// @return Whether the transfer was successful or not\n    function transfer(address _to, uint256 _amount) public returns (bool success) {\n        require(transfersEnabled);\n        return doTransfer(msg.sender, _to, _amount);\n    }\n\n    /// @notice Send `_amount` tokens to `_to` from `_from` on the condition it\n    ///  is approved by `_from`\n    /// @param _from The address holding the tokens being transferred\n    /// @param _to The address of the recipient\n    /// @param _amount The amount of tokens to be transferred\n    /// @return True if the transfer was successful\n    function transferFrom(address _from, address _to, uint256 _amount\n    ) public returns (bool success) {\n\n        // The controller of this contract can move tokens around at will,\n        //  this is important to recognize! Confirm that you trust the\n        //  controller of this contract, which in most situations should be\n        //  another open source smart contract or 0x0\n        if (msg.sender != controller) {\n            require(transfersEnabled);\n\n            // The standard ERC 20 transferFrom functionality\n            if (allowed[_from][msg.sender] < _amount) return false;\n            allowed[_from][msg.sender] -= _amount;\n        }\n        return doTransfer(_from, _to, _amount);\n    }\n\n    /// @dev This is the actual transfer function in the token contract, it can\n    ///  only be called by other functions in this contract.\n    /// @param _from The address holding the tokens being transferred\n    /// @param _to The address of the recipient\n    /// @param _amount The amount of tokens to be transferred\n    /// @return True if the transfer was successful\n    function doTransfer(address _from, address _to, uint _amount\n    ) internal returns(bool) {\n\n           if (_amount == 0) {\n               return true;\n           }\n\n           // Do not allow transfer to 0x0 or the token contract itself\n           require((_to != 0) && (_to != address(this)));\n\n           // If the amount being transfered is more than the balance of the\n           //  account the transfer returns false\n           var previousBalanceFrom = balanceOfAt(_from, block.number);\n           if (previousBalanceFrom < _amount) {\n               return false;\n           }\n\n           // First update the balance array with the new value for the address\n           //  sending the tokens\n           updateValueAtNow(balances[_from], previousBalanceFrom - _amount);\n\n           // Then update the balance array with the new value for the address\n           //  receiving the tokens\n           var previousBalanceTo = balanceOfAt(_to, block.number);\n           require(previousBalanceTo + _amount >= previousBalanceTo); // Check for overflow\n           updateValueAtNow(balances[_to], previousBalanceTo + _amount);\n\n           // An event to make the transfer easy to find on the blockchain\n           Transfer(_from, _to, _amount);\n\n           return true;\n    }\n\n    /// @param _owner The address that's balance is being requested\n    /// @return The balance of `_owner` at the current block\n    function balanceOf(address _owner) public constant returns (uint256 balance) {\n        return balanceOfAt(_owner, block.number);\n    }\n\n    /// @notice `msg.sender` approves `_spender` to spend `_amount` tokens on\n    ///  its behalf. This is a modified version of the ERC20 approve function\n    ///  to be a little bit safer\n    /// @param _spender The address of the account able to transfer the tokens\n    /// @param _amount The amount of tokens to be approved for transfer\n    /// @return True if the approval was successful\n    function approve(address _spender, uint256 _amount) public returns (bool success) {\n        require(transfersEnabled);\n\n        // To change the approve amount you first have to reduce the addresses`\n        //  allowance to zero by calling `approve(_spender,0)` if it is not\n        //  already 0 to mitigate the race condition described here:\n        //  https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729\n        require((_amount == 0) || (allowed[msg.sender][_spender] == 0));\n\n        allowed[msg.sender][_spender] = _amount;\n        Approval(msg.sender, _spender, _amount);\n        return true;\n    }\n\n    /// @dev This function makes it easy to read the `allowed[]` map\n    /// @param _owner The address of the account that owns the token\n    /// @param _spender The address of the account able to transfer the tokens\n    /// @return Amount of remaining tokens of _owner that _spender is allowed\n    ///  to spend\n    function allowance(address _owner, address _spender\n    ) public constant returns (uint256 remaining) {\n        return allowed[_owner][_spender];\n    }\n\n    /// @notice `msg.sender` approves `_spender` to send `_amount` tokens on\n    ///  its behalf, and then a function is triggered in the contract that is\n    ///  being approved, `_spender`. This allows users to use their tokens to\n    ///  interact with contracts in one function call instead of two\n    /// @param _spender The address of the contract able to transfer the tokens\n    /// @param _amount The amount of tokens to be approved for transfer\n    /// @return True if the function call was successful\n    function approveAndCall(address _spender, uint256 _amount, bytes _extraData\n    ) public returns (bool success) {\n        require(approve(_spender, _amount));\n\n        ApproveAndCallFallBack(_spender).receiveApproval(\n            msg.sender,\n            _amount,\n            this,\n            _extraData\n        );\n\n        return true;\n    }\n\n    /// @dev This function makes it easy to get the total number of tokens\n    /// @return The total number of tokens\n    function totalSupply() public constant returns (uint) {\n        return totalSupplyAt(block.number);\n    }\n\n////////////////\n// Query balance and totalSupply in History\n////////////////\n\n    /// @dev Queries the balance of `_owner` at a specific `_blockNumber`\n    /// @param _owner The address from which the balance will be retrieved\n    /// @param _blockNumber The block number when the balance is queried\n    /// @return The balance at `_blockNumber`\n    function balanceOfAt(address _owner, uint _blockNumber) public constant\n        returns (uint) {\n\n        if ((balances[_owner].length == 0) || (balances[_owner][0].fromBlock > _blockNumber)) {\n            return 0;\n\n        // This will return the expected balance during normal situations\n        } else {\n            return getValueAt(balances[_owner], _blockNumber);\n        }\n    }\n\n    /// @notice Total amount of tokens at a specific `_blockNumber`.\n    /// @param _blockNumber The block number when the totalSupply is queried\n    /// @return The total amount of tokens at `_blockNumber`\n    function totalSupplyAt(uint _blockNumber) public constant returns(uint) {\n\n        if ((totalSupplyHistory.length == 0) || (totalSupplyHistory[0].fromBlock > _blockNumber)) {\n            return 0;\n\n        // This will return the expected totalSupply during normal situations\n        } else {\n            return getValueAt(totalSupplyHistory, _blockNumber);\n        }\n    }\n\n////////////////\n// Generate and destroy tokens\n////////////////\n\n    /// @notice Generates `_amount` tokens that are assigned to `_owner`\n    /// @param _owner The address that will be assigned the new tokens\n    /// @param _amount The quantity of tokens generated\n    /// @return True if the tokens are generated correctly\n    function generateTokens(address _owner, uint _amount\n    ) public onlyController returns (bool) {\n        uint curTotalSupply = totalSupply();\n        require(curTotalSupply + _amount >= curTotalSupply); // Check for overflow\n        uint previousBalanceTo = balanceOf(_owner);\n        require(previousBalanceTo + _amount >= previousBalanceTo); // Check for overflow\n        updateValueAtNow(totalSupplyHistory, curTotalSupply + _amount);\n        updateValueAtNow(balances[_owner], previousBalanceTo + _amount);\n        Transfer(0, _owner, _amount);\n        return true;\n    }\n\n////////////////\n// Enable tokens transfers\n////////////////\n\n    /// @notice Enables token holders to transfer their tokens freely if true\n    /// @param _transfersEnabled True if transfers are allowed in the clone\n    function enableTransfers(bool _transfersEnabled) public onlyController {\n        transfersEnabled = _transfersEnabled;\n    }\n\n////////////////\n// Internal helper functions to query and set a value in a snapshot array\n////////////////\n\n    /// @dev `getValueAt` retrieves the number of tokens at a given block number\n    /// @param checkpoints The history of values being queried\n    /// @param _block The block number to retrieve the value at\n    /// @return The number of tokens being queried\n    function getValueAt(Checkpoint[] storage checkpoints, uint _block\n    ) constant internal returns (uint) {\n        if (checkpoints.length == 0) return 0;\n\n        // Shortcut for the actual value\n        if (_block >= checkpoints[checkpoints.length-1].fromBlock)\n            return checkpoints[checkpoints.length-1].value;\n        if (_block < checkpoints[0].fromBlock) return 0;\n\n        // Binary search of the value in the array\n        uint min = 0;\n        uint max = checkpoints.length-1;\n        while (max > min) {\n            uint mid = (max + min + 1)/ 2;\n            if (checkpoints[mid].fromBlock<=_block) {\n                min = mid;\n            } else {\n                max = mid-1;\n            }\n        }\n        return checkpoints[min].value;\n    }\n\n    /// @dev `updateValueAtNow` used to update an array of Checkpoints\n    /// @param checkpoints The history of data being updated\n    /// @param _value The new number of tokens\n    function updateValueAtNow(Checkpoint[] storage checkpoints, uint _value\n    ) internal  {\n        if ((checkpoints.length == 0)\n        || (checkpoints[checkpoints.length -1].fromBlock < block.number)) {\n               Checkpoint storage newCheckPoint = checkpoints[ checkpoints.length++ ];\n               newCheckPoint.fromBlock =  uint(block.number);\n               newCheckPoint.value = uint(_value);\n           } else {\n               Checkpoint storage oldCheckPoint = checkpoints[checkpoints.length-1];\n               oldCheckPoint.value = uint(_value);\n           }\n    }\n\n    /// @dev Internal function to determine if an address is a contract\n    /// @param _addr The address being queried\n    /// @return True if `_addr` is a contract\n    function isContract(address _addr) constant internal returns(bool) {\n        uint size;\n        if (_addr == 0) return false;\n        assembly {\n            size := extcodesize(_addr)\n        }\n        return size>0;\n    }\n\n    /// @dev Helper function to return a min betwen the two uints\n    function min(uint a, uint b) pure internal returns (uint) {\n        return a < b ? a : b;\n    }\n\n//////////\n// Safety Methods\n//////////\n\n    /// @notice This method can be used by the controller to extract mistakenly\n    ///  sent tokens to this contract.\n    /// @param _token The address of the token contract that you want to recover\n    ///  set to 0 in case you want to extract ether.\n    function claimTokens(address _token) public onlyController {\n        if (_token == 0x0) {\n            controller.transfer(this.balance);\n            return;\n        }\n\n        CrowdfundingToken token = CrowdfundingToken(_token);\n        uint balance = token.balanceOf(this);\n        token.transfer(controller, balance);\n        ClaimedTokens(_token, controller, balance);\n    }\n\n//////////\n// ERC721Receiver Method\n//////////\n\n    function onERC721Received(\n        address,\n        uint256,\n        bytes\n    )\n        public\n        returns(bytes4)\n    {\n        return ERC721_RECEIVED;\n    }\n\n////////////////\n// Events\n////////////////\n    event ClaimedTokens(address indexed _token, address indexed _controller, uint _amount);\n    event Transfer(address indexed _from, address indexed _to, uint256 _amount);\n    event Approval(\n        address indexed _owner,\n        address indexed _spender,\n        uint256 _amount\n        );\n\n}\n",
  "sourcePath": "/Users/chrismin/Documents/dev/dharma/charta/contracts/crowdfunding/CrowdfundingToken.sol",
  "ast": {
    "attributes": {
      "absolutePath": "/Users/chrismin/Documents/dev/dharma/charta/contracts/crowdfunding/CrowdfundingToken.sol",
      "exportedSymbols": {
        "ApproveAndCallFallBack": [
          3788
        ],
        "CrowdfundingToken": [
          4821
        ]
      }
    },
    "children": [
      {
        "attributes": {
          "literals": [
            "solidity",
            "0.4",
            ".18"
          ]
        },
        "id": 3771,
        "name": "PragmaDirective",
        "src": "0:23:12"
      },
      {
        "attributes": {
          "SourceUnit": 10265,
          "absolutePath": "zeppelin-solidity/contracts/token/ERC20/ERC20.sol",
          "file": "zeppelin-solidity/contracts/token/ERC20/ERC20.sol",
          "scope": 4822,
          "symbolAliases": [
            null
          ],
          "unitAlias": ""
        },
        "id": 3772,
        "name": "ImportDirective",
        "src": "51:59:12"
      },
      {
        "attributes": {
          "SourceUnit": 11425,
          "absolutePath": "zeppelin-solidity/contracts/token/ERC721/ERC721Receiver.sol",
          "file": "zeppelin-solidity/contracts/token/ERC721/ERC721Receiver.sol",
          "scope": 4822,
          "symbolAliases": [
            null
          ],
          "unitAlias": ""
        },
        "id": 3773,
        "name": "ImportDirective",
        "src": "111:69:12"
      },
      {
        "attributes": {
          "SourceUnit": 10070,
          "absolutePath": "zeppelin-solidity/contracts/math/SafeMath.sol",
          "file": "zeppelin-solidity/contracts/math/SafeMath.sol",
          "scope": 4822,
          "symbolAliases": [
            null
          ],
          "unitAlias": ""
        },
        "id": 3774,
        "name": "ImportDirective",
        "src": "181:55:12"
      },
      {
        "attributes": {
          "SourceUnit": 924,
          "absolutePath": "/Users/chrismin/Documents/dev/dharma/charta/contracts/ContractRegistry.sol",
          "file": "../ContractRegistry.sol",
          "scope": 4822,
          "symbolAliases": [
            null
          ],
          "unitAlias": ""
        },
        "id": 3775,
        "name": "ImportDirective",
        "src": "238:33:12"
      },
      {
        "attributes": {
          "SourceUnit": 3770,
          "absolutePath": "/Users/chrismin/Documents/dev/dharma/charta/contracts/crowdfunding/Controlled.sol",
          "file": "./Controlled.sol",
          "scope": 4822,
          "symbolAliases": [
            null
          ],
          "unitAlias": ""
        },
        "id": 3776,
        "name": "ImportDirective",
        "src": "273:26:12"
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
          "documentation": null,
          "fullyImplemented": false,
          "linearizedBaseContracts": [
            3788
          ],
          "name": "ApproveAndCallFallBack",
          "scope": 4822
        },
        "children": [
          {
            "attributes": {
              "body": null,
              "constant": false,
              "implemented": false,
              "isConstructor": false,
              "modifiers": [
                null
              ],
              "name": "receiveApproval",
              "payable": false,
              "scope": 3788,
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
                      "name": "from",
                      "scope": 3787,
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
                        "id": 3777,
                        "name": "ElementaryTypeName",
                        "src": "364:7:12"
                      }
                    ],
                    "id": 3778,
                    "name": "VariableDeclaration",
                    "src": "364:12:12"
                  },
                  {
                    "attributes": {
                      "constant": false,
                      "name": "_amount",
                      "scope": 3787,
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
                        "id": 3779,
                        "name": "ElementaryTypeName",
                        "src": "378:7:12"
                      }
                    ],
                    "id": 3780,
                    "name": "VariableDeclaration",
                    "src": "378:15:12"
                  },
                  {
                    "attributes": {
                      "constant": false,
                      "name": "_token",
                      "scope": 3787,
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
                        "id": 3781,
                        "name": "ElementaryTypeName",
                        "src": "395:7:12"
                      }
                    ],
                    "id": 3782,
                    "name": "VariableDeclaration",
                    "src": "395:14:12"
                  },
                  {
                    "attributes": {
                      "constant": false,
                      "name": "_data",
                      "scope": 3787,
                      "stateVariable": false,
                      "storageLocation": "default",
                      "type": "bytes memory",
                      "value": null,
                      "visibility": "internal"
                    },
                    "children": [
                      {
                        "attributes": {
                          "name": "bytes",
                          "type": "bytes storage pointer"
                        },
                        "id": 3783,
                        "name": "ElementaryTypeName",
                        "src": "411:5:12"
                      }
                    ],
                    "id": 3784,
                    "name": "VariableDeclaration",
                    "src": "411:11:12"
                  }
                ],
                "id": 3785,
                "name": "ParameterList",
                "src": "363:60:12"
              },
              {
                "attributes": {
                  "parameters": [
                    null
                  ]
                },
                "children": [],
                "id": 3786,
                "name": "ParameterList",
                "src": "430:0:12"
              }
            ],
            "id": 3787,
            "name": "FunctionDefinition",
            "src": "339:92:12"
          }
        ],
        "id": 3788,
        "name": "ContractDefinition",
        "src": "301:132:12"
      },
      {
        "attributes": {
          "contractDependencies": [
            3769,
            11424
          ],
          "contractKind": "contract",
          "documentation": "Much structure taken from Giveth's MiniMeToken: https://github.com/Giveth/minime",
          "fullyImplemented": true,
          "linearizedBaseContracts": [
            4821,
            11424,
            3769
          ],
          "name": "CrowdfundingToken",
          "scope": 4822
        },
        "children": [
          {
            "attributes": {
              "arguments": [
                null
              ]
            },
            "children": [
              {
                "attributes": {
                  "contractScope": null,
                  "name": "Controlled",
                  "referencedDeclaration": 3769,
                  "type": "contract Controlled"
                },
                "id": 3789,
                "name": "UserDefinedTypeName",
                "src": "550:10:12"
              }
            ],
            "id": 3790,
            "name": "InheritanceSpecifier",
            "src": "550:10:12"
          },
          {
            "attributes": {
              "arguments": [
                null
              ]
            },
            "children": [
              {
                "attributes": {
                  "contractScope": null,
                  "name": "ERC721Receiver",
                  "referencedDeclaration": 11424,
                  "type": "contract ERC721Receiver"
                },
                "id": 3791,
                "name": "UserDefinedTypeName",
                "src": "562:14:12"
              }
            ],
            "id": 3792,
            "name": "InheritanceSpecifier",
            "src": "562:14:12"
          },
          {
            "children": [
              {
                "attributes": {
                  "contractScope": null,
                  "name": "SafeMath",
                  "referencedDeclaration": 10069,
                  "type": "library SafeMath"
                },
                "id": 3793,
                "name": "UserDefinedTypeName",
                "src": "589:8:12"
              },
              {
                "attributes": {
                  "name": "uint",
                  "type": "uint256"
                },
                "id": 3794,
                "name": "ElementaryTypeName",
                "src": "602:4:12"
              }
            ],
            "id": 3795,
            "name": "UsingForDirective",
            "src": "583:24:12"
          },
          {
            "attributes": {
              "canonicalName": "CrowdfundingToken.Checkpoint",
              "name": "Checkpoint",
              "scope": 4821,
              "visibility": "public"
            },
            "children": [
              {
                "attributes": {
                  "constant": false,
                  "name": "fromBlock",
                  "scope": 3800,
                  "stateVariable": false,
                  "storageLocation": "default",
                  "type": "uint256",
                  "value": null,
                  "visibility": "internal"
                },
                "children": [
                  {
                    "attributes": {
                      "name": "uint",
                      "type": "uint256"
                    },
                    "id": 3796,
                    "name": "ElementaryTypeName",
                    "src": "893:4:12"
                  }
                ],
                "id": 3797,
                "name": "VariableDeclaration",
                "src": "893:14:12"
              },
              {
                "attributes": {
                  "constant": false,
                  "name": "value",
                  "scope": 3800,
                  "stateVariable": false,
                  "storageLocation": "default",
                  "type": "uint256",
                  "value": null,
                  "visibility": "internal"
                },
                "children": [
                  {
                    "attributes": {
                      "name": "uint",
                      "type": "uint256"
                    },
                    "id": 3798,
                    "name": "ElementaryTypeName",
                    "src": "988:4:12"
                  }
                ],
                "id": 3799,
                "name": "VariableDeclaration",
                "src": "988:10:12"
              }
            ],
            "id": 3800,
            "name": "StructDefinition",
            "src": "786:219:12"
          },
          {
            "attributes": {
              "constant": false,
              "name": "name",
              "scope": 4821,
              "stateVariable": true,
              "storageLocation": "default",
              "type": "string storage ref",
              "value": null,
              "visibility": "public"
            },
            "children": [
              {
                "attributes": {
                  "name": "string",
                  "type": "string storage pointer"
                },
                "id": 3801,
                "name": "ElementaryTypeName",
                "src": "1011:6:12"
              }
            ],
            "id": 3802,
            "name": "VariableDeclaration",
            "src": "1011:18:12"
          },
          {
            "attributes": {
              "constant": false,
              "name": "decimals",
              "scope": 4821,
              "stateVariable": true,
              "storageLocation": "default",
              "type": "uint8",
              "value": null,
              "visibility": "public"
            },
            "children": [
              {
                "attributes": {
                  "name": "uint8",
                  "type": "uint8"
                },
                "id": 3803,
                "name": "ElementaryTypeName",
                "src": "1091:5:12"
              }
            ],
            "id": 3804,
            "name": "VariableDeclaration",
            "src": "1091:21:12"
          },
          {
            "attributes": {
              "constant": false,
              "name": "symbol",
              "scope": 4821,
              "stateVariable": true,
              "storageLocation": "default",
              "type": "string storage ref",
              "value": null,
              "visibility": "public"
            },
            "children": [
              {
                "attributes": {
                  "name": "string",
                  "type": "string storage pointer"
                },
                "id": 3805,
                "name": "ElementaryTypeName",
                "src": "1172:6:12"
              }
            ],
            "id": 3806,
            "name": "VariableDeclaration",
            "src": "1172:20:12"
          },
          {
            "attributes": {
              "constant": false,
              "name": "debtToken",
              "scope": 4821,
              "stateVariable": true,
              "storageLocation": "default",
              "type": "address",
              "value": null,
              "visibility": "public"
            },
            "children": [
              {
                "attributes": {
                  "name": "address",
                  "type": "address"
                },
                "id": 3807,
                "name": "ElementaryTypeName",
                "src": "1278:7:12"
              }
            ],
            "id": 3808,
            "name": "VariableDeclaration",
            "src": "1278:24:12"
          },
          {
            "attributes": {
              "constant": false,
              "name": "agreementId",
              "scope": 4821,
              "stateVariable": true,
              "storageLocation": "default",
              "type": "uint256",
              "value": null,
              "visibility": "public"
            },
            "children": [
              {
                "attributes": {
                  "name": "uint",
                  "type": "uint256"
                },
                "id": 3809,
                "name": "ElementaryTypeName",
                "src": "1308:4:12"
              }
            ],
            "id": 3810,
            "name": "VariableDeclaration",
            "src": "1308:23:12"
          },
          {
            "attributes": {
              "constant": false,
              "name": "contractRegistry",
              "scope": 4821,
              "stateVariable": true,
              "storageLocation": "default",
              "type": "contract ContractRegistry",
              "value": null,
              "visibility": "public"
            },
            "children": [
              {
                "attributes": {
                  "contractScope": null,
                  "name": "ContractRegistry",
                  "referencedDeclaration": 923,
                  "type": "contract ContractRegistry"
                },
                "id": 3811,
                "name": "UserDefinedTypeName",
                "src": "1337:16:12"
              }
            ],
            "id": 3812,
            "name": "VariableDeclaration",
            "src": "1337:40:12"
          },
          {
            "attributes": {
              "constant": false,
              "name": "repaymentTokenIndex",
              "scope": 4821,
              "stateVariable": true,
              "storageLocation": "default",
              "type": "uint256",
              "value": null,
              "visibility": "public"
            },
            "children": [
              {
                "attributes": {
                  "name": "uint",
                  "type": "uint256"
                },
                "id": 3813,
                "name": "ElementaryTypeName",
                "src": "1493:4:12"
              }
            ],
            "id": 3814,
            "name": "VariableDeclaration",
            "src": "1493:31:12"
          },
          {
            "attributes": {
              "constant": false,
              "name": "repayments",
              "scope": 4821,
              "stateVariable": true,
              "storageLocation": "default",
              "type": "struct CrowdfundingToken.Checkpoint storage ref[] storage ref",
              "value": null,
              "visibility": "public"
            },
            "children": [
              {
                "attributes": {
                  "length": null,
                  "type": "struct CrowdfundingToken.Checkpoint storage ref[] storage pointer"
                },
                "children": [
                  {
                    "attributes": {
                      "contractScope": null,
                      "name": "Checkpoint",
                      "referencedDeclaration": 3800,
                      "type": "struct CrowdfundingToken.Checkpoint storage pointer"
                    },
                    "id": 3815,
                    "name": "UserDefinedTypeName",
                    "src": "1531:10:12"
                  }
                ],
                "id": 3816,
                "name": "ArrayTypeName",
                "src": "1531:12:12"
              }
            ],
            "id": 3817,
            "name": "VariableDeclaration",
            "src": "1531:30:12"
          },
          {
            "attributes": {
              "constant": false,
              "name": "withdrawals",
              "scope": 4821,
              "stateVariable": true,
              "storageLocation": "default",
              "type": "mapping(address => mapping(uint256 => bool))",
              "value": null,
              "visibility": "public"
            },
            "children": [
              {
                "attributes": {
                  "type": "mapping(address => mapping(uint256 => bool))"
                },
                "children": [
                  {
                    "attributes": {
                      "name": "address",
                      "type": "address"
                    },
                    "id": 3818,
                    "name": "ElementaryTypeName",
                    "src": "1758:7:12"
                  },
                  {
                    "attributes": {
                      "type": "mapping(uint256 => bool)"
                    },
                    "children": [
                      {
                        "attributes": {
                          "name": "uint",
                          "type": "uint256"
                        },
                        "id": 3819,
                        "name": "ElementaryTypeName",
                        "src": "1778:4:12"
                      },
                      {
                        "attributes": {
                          "name": "bool",
                          "type": "bool"
                        },
                        "id": 3820,
                        "name": "ElementaryTypeName",
                        "src": "1786:4:12"
                      }
                    ],
                    "id": 3821,
                    "name": "Mapping",
                    "src": "1769:22:12"
                  }
                ],
                "id": 3822,
                "name": "Mapping",
                "src": "1749:43:12"
              }
            ],
            "id": 3823,
            "name": "VariableDeclaration",
            "src": "1749:62:12"
          },
          {
            "attributes": {
              "constant": false,
              "name": "balances",
              "scope": 4821,
              "stateVariable": true,
              "storageLocation": "default",
              "type": "mapping(address => struct CrowdfundingToken.Checkpoint storage ref[] storage ref)",
              "value": null,
              "visibility": "internal"
            },
            "children": [
              {
                "attributes": {
                  "type": "mapping(address => struct CrowdfundingToken.Checkpoint storage ref[] storage ref)"
                },
                "children": [
                  {
                    "attributes": {
                      "name": "address",
                      "type": "address"
                    },
                    "id": 3824,
                    "name": "ElementaryTypeName",
                    "src": "2025:7:12"
                  },
                  {
                    "attributes": {
                      "length": null,
                      "type": "struct CrowdfundingToken.Checkpoint storage ref[] storage pointer"
                    },
                    "children": [
                      {
                        "attributes": {
                          "contractScope": null,
                          "name": "Checkpoint",
                          "referencedDeclaration": 3800,
                          "type": "struct CrowdfundingToken.Checkpoint storage pointer"
                        },
                        "id": 3825,
                        "name": "UserDefinedTypeName",
                        "src": "2036:10:12"
                      }
                    ],
                    "id": 3826,
                    "name": "ArrayTypeName",
                    "src": "2036:12:12"
                  }
                ],
                "id": 3827,
                "name": "Mapping",
                "src": "2016:33:12"
              }
            ],
            "id": 3828,
            "name": "VariableDeclaration",
            "src": "2016:42:12"
          },
          {
            "attributes": {
              "constant": false,
              "name": "allowed",
              "scope": 4821,
              "stateVariable": true,
              "storageLocation": "default",
              "type": "mapping(address => mapping(address => uint256))",
              "value": null,
              "visibility": "internal"
            },
            "children": [
              {
                "attributes": {
                  "type": "mapping(address => mapping(address => uint256))"
                },
                "children": [
                  {
                    "attributes": {
                      "name": "address",
                      "type": "address"
                    },
                    "id": 3829,
                    "name": "ElementaryTypeName",
                    "src": "2147:7:12"
                  },
                  {
                    "attributes": {
                      "type": "mapping(address => uint256)"
                    },
                    "children": [
                      {
                        "attributes": {
                          "name": "address",
                          "type": "address"
                        },
                        "id": 3830,
                        "name": "ElementaryTypeName",
                        "src": "2167:7:12"
                      },
                      {
                        "attributes": {
                          "name": "uint256",
                          "type": "uint256"
                        },
                        "id": 3831,
                        "name": "ElementaryTypeName",
                        "src": "2178:7:12"
                      }
                    ],
                    "id": 3832,
                    "name": "Mapping",
                    "src": "2158:28:12"
                  }
                ],
                "id": 3833,
                "name": "Mapping",
                "src": "2138:49:12"
              }
            ],
            "id": 3834,
            "name": "VariableDeclaration",
            "src": "2138:57:12"
          },
          {
            "attributes": {
              "constant": false,
              "name": "totalSupplyHistory",
              "scope": 4821,
              "stateVariable": true,
              "storageLocation": "default",
              "type": "struct CrowdfundingToken.Checkpoint storage ref[] storage ref",
              "value": null,
              "visibility": "internal"
            },
            "children": [
              {
                "attributes": {
                  "length": null,
                  "type": "struct CrowdfundingToken.Checkpoint storage ref[] storage pointer"
                },
                "children": [
                  {
                    "attributes": {
                      "contractScope": null,
                      "name": "Checkpoint",
                      "referencedDeclaration": 3800,
                      "type": "struct CrowdfundingToken.Checkpoint storage pointer"
                    },
                    "id": 3835,
                    "name": "UserDefinedTypeName",
                    "src": "2262:10:12"
                  }
                ],
                "id": 3836,
                "name": "ArrayTypeName",
                "src": "2262:12:12"
              }
            ],
            "id": 3837,
            "name": "VariableDeclaration",
            "src": "2262:31:12"
          },
          {
            "attributes": {
              "constant": false,
              "name": "transfersEnabled",
              "scope": 4821,
              "stateVariable": true,
              "storageLocation": "default",
              "type": "bool",
              "value": null,
              "visibility": "public"
            },
            "children": [
              {
                "attributes": {
                  "name": "bool",
                  "type": "bool"
                },
                "id": 3838,
                "name": "ElementaryTypeName",
                "src": "2365:4:12"
              }
            ],
            "id": 3839,
            "name": "VariableDeclaration",
            "src": "2365:28:12"
          },
          {
            "attributes": {
              "constant": false,
              "implemented": true,
              "isConstructor": true,
              "name": "CrowdfundingToken",
              "payable": false,
              "scope": 4821,
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
                      "name": "_owner",
                      "scope": 3898,
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
                        "id": 3840,
                        "name": "ElementaryTypeName",
                        "src": "2796:7:12"
                      }
                    ],
                    "id": 3841,
                    "name": "VariableDeclaration",
                    "src": "2796:14:12"
                  },
                  {
                    "attributes": {
                      "constant": false,
                      "name": "_debtToken",
                      "scope": 3898,
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
                        "id": 3842,
                        "name": "ElementaryTypeName",
                        "src": "2820:7:12"
                      }
                    ],
                    "id": 3843,
                    "name": "VariableDeclaration",
                    "src": "2820:18:12"
                  },
                  {
                    "attributes": {
                      "constant": false,
                      "name": "_agreementId",
                      "scope": 3898,
                      "stateVariable": false,
                      "storageLocation": "default",
                      "type": "uint256",
                      "value": null,
                      "visibility": "internal"
                    },
                    "children": [
                      {
                        "attributes": {
                          "name": "uint",
                          "type": "uint256"
                        },
                        "id": 3844,
                        "name": "ElementaryTypeName",
                        "src": "2848:4:12"
                      }
                    ],
                    "id": 3845,
                    "name": "VariableDeclaration",
                    "src": "2848:17:12"
                  },
                  {
                    "attributes": {
                      "constant": false,
                      "name": "_contractRegistry",
                      "scope": 3898,
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
                        "id": 3846,
                        "name": "ElementaryTypeName",
                        "src": "2875:7:12"
                      }
                    ],
                    "id": 3847,
                    "name": "VariableDeclaration",
                    "src": "2875:25:12"
                  },
                  {
                    "attributes": {
                      "constant": false,
                      "name": "_tokenName",
                      "scope": 3898,
                      "stateVariable": false,
                      "storageLocation": "default",
                      "type": "string memory",
                      "value": null,
                      "visibility": "internal"
                    },
                    "children": [
                      {
                        "attributes": {
                          "name": "string",
                          "type": "string storage pointer"
                        },
                        "id": 3848,
                        "name": "ElementaryTypeName",
                        "src": "2910:6:12"
                      }
                    ],
                    "id": 3849,
                    "name": "VariableDeclaration",
                    "src": "2910:17:12"
                  },
                  {
                    "attributes": {
                      "constant": false,
                      "name": "_decimalUnits",
                      "scope": 3898,
                      "stateVariable": false,
                      "storageLocation": "default",
                      "type": "uint8",
                      "value": null,
                      "visibility": "internal"
                    },
                    "children": [
                      {
                        "attributes": {
                          "name": "uint8",
                          "type": "uint8"
                        },
                        "id": 3850,
                        "name": "ElementaryTypeName",
                        "src": "2937:5:12"
                      }
                    ],
                    "id": 3851,
                    "name": "VariableDeclaration",
                    "src": "2937:19:12"
                  },
                  {
                    "attributes": {
                      "constant": false,
                      "name": "_tokenSymbol",
                      "scope": 3898,
                      "stateVariable": false,
                      "storageLocation": "default",
                      "type": "string memory",
                      "value": null,
                      "visibility": "internal"
                    },
                    "children": [
                      {
                        "attributes": {
                          "name": "string",
                          "type": "string storage pointer"
                        },
                        "id": 3852,
                        "name": "ElementaryTypeName",
                        "src": "2966:6:12"
                      }
                    ],
                    "id": 3853,
                    "name": "VariableDeclaration",
                    "src": "2966:19:12"
                  },
                  {
                    "attributes": {
                      "constant": false,
                      "name": "_repaymentTokenIndex",
                      "scope": 3898,
                      "stateVariable": false,
                      "storageLocation": "default",
                      "type": "uint256",
                      "value": null,
                      "visibility": "internal"
                    },
                    "children": [
                      {
                        "attributes": {
                          "name": "uint",
                          "type": "uint256"
                        },
                        "id": 3854,
                        "name": "ElementaryTypeName",
                        "src": "2995:4:12"
                      }
                    ],
                    "id": 3855,
                    "name": "VariableDeclaration",
                    "src": "2995:25:12"
                  },
                  {
                    "attributes": {
                      "constant": false,
                      "name": "_transfersEnabled",
                      "scope": 3898,
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
                        "id": 3856,
                        "name": "ElementaryTypeName",
                        "src": "3030:4:12"
                      }
                    ],
                    "id": 3857,
                    "name": "VariableDeclaration",
                    "src": "3030:22:12"
                  }
                ],
                "id": 3858,
                "name": "ParameterList",
                "src": "2786:272:12"
              },
              {
                "attributes": {
                  "parameters": [
                    null
                  ]
                },
                "children": [],
                "id": 3862,
                "name": "ParameterList",
                "src": "3105:0:12"
              },
              {
                "children": [
                  {
                    "attributes": {
                      "argumentTypes": null,
                      "overloadedDeclarations": [
                        null
                      ],
                      "referencedDeclaration": 3769,
                      "type": "type(contract Controlled)",
                      "value": "Controlled"
                    },
                    "id": 3859,
                    "name": "Identifier",
                    "src": "3082:10:12"
                  },
                  {
                    "attributes": {
                      "argumentTypes": null,
                      "overloadedDeclarations": [
                        null
                      ],
                      "referencedDeclaration": 3841,
                      "type": "address",
                      "value": "_owner"
                    },
                    "id": 3860,
                    "name": "Identifier",
                    "src": "3093:6:12"
                  }
                ],
                "id": 3861,
                "name": "ModifierInvocation",
                "src": "3082:18:12"
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
                          "lValueRequested": false,
                          "operator": "=",
                          "type": "address"
                        },
                        "children": [
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 3808,
                              "type": "address",
                              "value": "debtToken"
                            },
                            "id": 3863,
                            "name": "Identifier",
                            "src": "3115:9:12"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 3843,
                              "type": "address",
                              "value": "_debtToken"
                            },
                            "id": 3864,
                            "name": "Identifier",
                            "src": "3127:10:12"
                          }
                        ],
                        "id": 3865,
                        "name": "Assignment",
                        "src": "3115:22:12"
                      }
                    ],
                    "id": 3866,
                    "name": "ExpressionStatement",
                    "src": "3115:22:12"
                  },
                  {
                    "children": [
                      {
                        "attributes": {
                          "argumentTypes": null,
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": false,
                          "lValueRequested": false,
                          "operator": "=",
                          "type": "uint256"
                        },
                        "children": [
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 3810,
                              "type": "uint256",
                              "value": "agreementId"
                            },
                            "id": 3867,
                            "name": "Identifier",
                            "src": "3147:11:12"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 3845,
                              "type": "uint256",
                              "value": "_agreementId"
                            },
                            "id": 3868,
                            "name": "Identifier",
                            "src": "3161:12:12"
                          }
                        ],
                        "id": 3869,
                        "name": "Assignment",
                        "src": "3147:26:12"
                      }
                    ],
                    "id": 3870,
                    "name": "ExpressionStatement",
                    "src": "3147:26:12"
                  },
                  {
                    "children": [
                      {
                        "attributes": {
                          "argumentTypes": null,
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": false,
                          "lValueRequested": false,
                          "operator": "=",
                          "type": "contract ContractRegistry"
                        },
                        "children": [
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 3812,
                              "type": "contract ContractRegistry",
                              "value": "contractRegistry"
                            },
                            "id": 3871,
                            "name": "Identifier",
                            "src": "3183:16:12"
                          },
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
                              "type": "contract ContractRegistry",
                              "type_conversion": true
                            },
                            "children": [
                              {
                                "attributes": {
                                  "argumentTypes": [
                                    {
                                      "typeIdentifier": "t_address",
                                      "typeString": "address"
                                    }
                                  ],
                                  "overloadedDeclarations": [
                                    null
                                  ],
                                  "referencedDeclaration": 923,
                                  "type": "type(contract ContractRegistry)",
                                  "value": "ContractRegistry"
                                },
                                "id": 3872,
                                "name": "Identifier",
                                "src": "3202:16:12"
                              },
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "overloadedDeclarations": [
                                    null
                                  ],
                                  "referencedDeclaration": 3847,
                                  "type": "address",
                                  "value": "_contractRegistry"
                                },
                                "id": 3873,
                                "name": "Identifier",
                                "src": "3219:17:12"
                              }
                            ],
                            "id": 3874,
                            "name": "FunctionCall",
                            "src": "3202:35:12"
                          }
                        ],
                        "id": 3875,
                        "name": "Assignment",
                        "src": "3183:54:12"
                      }
                    ],
                    "id": 3876,
                    "name": "ExpressionStatement",
                    "src": "3183:54:12"
                  },
                  {
                    "children": [
                      {
                        "attributes": {
                          "argumentTypes": null,
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": false,
                          "lValueRequested": false,
                          "operator": "=",
                          "type": "string storage ref"
                        },
                        "children": [
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 3802,
                              "type": "string storage ref",
                              "value": "name"
                            },
                            "id": 3877,
                            "name": "Identifier",
                            "src": "3247:4:12"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 3849,
                              "type": "string memory",
                              "value": "_tokenName"
                            },
                            "id": 3878,
                            "name": "Identifier",
                            "src": "3254:10:12"
                          }
                        ],
                        "id": 3879,
                        "name": "Assignment",
                        "src": "3247:17:12"
                      }
                    ],
                    "id": 3880,
                    "name": "ExpressionStatement",
                    "src": "3247:17:12"
                  },
                  {
                    "children": [
                      {
                        "attributes": {
                          "argumentTypes": null,
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": false,
                          "lValueRequested": false,
                          "operator": "=",
                          "type": "uint8"
                        },
                        "children": [
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 3804,
                              "type": "uint8",
                              "value": "decimals"
                            },
                            "id": 3881,
                            "name": "Identifier",
                            "src": "3274:8:12"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 3851,
                              "type": "uint8",
                              "value": "_decimalUnits"
                            },
                            "id": 3882,
                            "name": "Identifier",
                            "src": "3285:13:12"
                          }
                        ],
                        "id": 3883,
                        "name": "Assignment",
                        "src": "3274:24:12"
                      }
                    ],
                    "id": 3884,
                    "name": "ExpressionStatement",
                    "src": "3274:24:12"
                  },
                  {
                    "children": [
                      {
                        "attributes": {
                          "argumentTypes": null,
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": false,
                          "lValueRequested": false,
                          "operator": "=",
                          "type": "string storage ref"
                        },
                        "children": [
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 3806,
                              "type": "string storage ref",
                              "value": "symbol"
                            },
                            "id": 3885,
                            "name": "Identifier",
                            "src": "3308:6:12"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 3853,
                              "type": "string memory",
                              "value": "_tokenSymbol"
                            },
                            "id": 3886,
                            "name": "Identifier",
                            "src": "3317:12:12"
                          }
                        ],
                        "id": 3887,
                        "name": "Assignment",
                        "src": "3308:21:12"
                      }
                    ],
                    "id": 3888,
                    "name": "ExpressionStatement",
                    "src": "3308:21:12"
                  },
                  {
                    "children": [
                      {
                        "attributes": {
                          "argumentTypes": null,
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": false,
                          "lValueRequested": false,
                          "operator": "=",
                          "type": "uint256"
                        },
                        "children": [
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 3814,
                              "type": "uint256",
                              "value": "repaymentTokenIndex"
                            },
                            "id": 3889,
                            "name": "Identifier",
                            "src": "3339:19:12"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 3855,
                              "type": "uint256",
                              "value": "_repaymentTokenIndex"
                            },
                            "id": 3890,
                            "name": "Identifier",
                            "src": "3361:20:12"
                          }
                        ],
                        "id": 3891,
                        "name": "Assignment",
                        "src": "3339:42:12"
                      }
                    ],
                    "id": 3892,
                    "name": "ExpressionStatement",
                    "src": "3339:42:12"
                  },
                  {
                    "children": [
                      {
                        "attributes": {
                          "argumentTypes": null,
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": false,
                          "lValueRequested": false,
                          "operator": "=",
                          "type": "bool"
                        },
                        "children": [
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 3839,
                              "type": "bool",
                              "value": "transfersEnabled"
                            },
                            "id": 3893,
                            "name": "Identifier",
                            "src": "3391:16:12"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 3857,
                              "type": "bool",
                              "value": "_transfersEnabled"
                            },
                            "id": 3894,
                            "name": "Identifier",
                            "src": "3410:17:12"
                          }
                        ],
                        "id": 3895,
                        "name": "Assignment",
                        "src": "3391:36:12"
                      }
                    ],
                    "id": 3896,
                    "name": "ExpressionStatement",
                    "src": "3391:36:12"
                  }
                ],
                "id": 3897,
                "name": "Block",
                "src": "3105:329:12"
              }
            ],
            "id": 3898,
            "name": "FunctionDefinition",
            "src": "2760:674:12"
          },
          {
            "attributes": {
              "constant": false,
              "implemented": true,
              "isConstructor": false,
              "name": "registerRepayment",
              "payable": false,
              "scope": 4821,
              "stateMutability": "nonpayable",
              "superFunction": null,
              "visibility": "external"
            },
            "children": [
              {
                "children": [
                  {
                    "attributes": {
                      "constant": false,
                      "name": "_repaymentAmount",
                      "scope": 3918,
                      "stateVariable": false,
                      "storageLocation": "default",
                      "type": "uint256",
                      "value": null,
                      "visibility": "internal"
                    },
                    "children": [
                      {
                        "attributes": {
                          "name": "uint",
                          "type": "uint256"
                        },
                        "id": 3899,
                        "name": "ElementaryTypeName",
                        "src": "3608:4:12"
                      }
                    ],
                    "id": 3900,
                    "name": "VariableDeclaration",
                    "src": "3608:21:12"
                  }
                ],
                "id": 3901,
                "name": "ParameterList",
                "src": "3598:37:12"
              },
              {
                "attributes": {
                  "parameters": [
                    null
                  ]
                },
                "children": [],
                "id": 3904,
                "name": "ParameterList",
                "src": "3680:0:12"
              },
              {
                "attributes": {
                  "arguments": [
                    null
                  ]
                },
                "children": [
                  {
                    "attributes": {
                      "argumentTypes": null,
                      "overloadedDeclarations": [
                        null
                      ],
                      "referencedDeclaration": 3744,
                      "type": "modifier ()",
                      "value": "onlyController"
                    },
                    "id": 3902,
                    "name": "Identifier",
                    "src": "3661:14:12"
                  }
                ],
                "id": 3903,
                "name": "ModifierInvocation",
                "src": "3661:14:12"
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
                              "referencedDeclaration": 11810,
                              "type": "function (bool) pure",
                              "value": "require"
                            },
                            "id": 3905,
                            "name": "Identifier",
                            "src": "3852:7:12"
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
                              "operator": ">",
                              "type": "bool"
                            },
                            "children": [
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "arguments": [
                                    null
                                  ],
                                  "isConstant": false,
                                  "isLValue": false,
                                  "isPure": false,
                                  "isStructConstructorCall": false,
                                  "lValueRequested": false,
                                  "names": [
                                    null
                                  ],
                                  "type": "uint256",
                                  "type_conversion": false
                                },
                                "children": [
                                  {
                                    "attributes": {
                                      "argumentTypes": [
                                        null
                                      ],
                                      "overloadedDeclarations": [
                                        null
                                      ],
                                      "referencedDeclaration": 4384,
                                      "type": "function () view returns (uint256)",
                                      "value": "totalSupply"
                                    },
                                    "id": 3906,
                                    "name": "Identifier",
                                    "src": "3860:11:12"
                                  }
                                ],
                                "id": 3907,
                                "name": "FunctionCall",
                                "src": "3860:13:12"
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
                                "id": 3908,
                                "name": "Literal",
                                "src": "3876:1:12"
                              }
                            ],
                            "id": 3909,
                            "name": "BinaryOperation",
                            "src": "3860:17:12"
                          }
                        ],
                        "id": 3910,
                        "name": "FunctionCall",
                        "src": "3852:26:12"
                      }
                    ],
                    "id": 3911,
                    "name": "ExpressionStatement",
                    "src": "3852:26:12"
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
                                  "typeIdentifier": "t_array$_t_struct$_Checkpoint_$3800_storage_$dyn_storage",
                                  "typeString": "struct CrowdfundingToken.Checkpoint storage ref[] storage ref"
                                },
                                {
                                  "typeIdentifier": "t_uint256",
                                  "typeString": "uint256"
                                }
                              ],
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4696,
                              "type": "function (struct CrowdfundingToken.Checkpoint storage ref[] storage pointer,uint256)",
                              "value": "updateValueAtNow"
                            },
                            "id": 3912,
                            "name": "Identifier",
                            "src": "3889:16:12"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 3817,
                              "type": "struct CrowdfundingToken.Checkpoint storage ref[] storage ref",
                              "value": "repayments"
                            },
                            "id": 3913,
                            "name": "Identifier",
                            "src": "3906:10:12"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 3900,
                              "type": "uint256",
                              "value": "_repaymentAmount"
                            },
                            "id": 3914,
                            "name": "Identifier",
                            "src": "3918:16:12"
                          }
                        ],
                        "id": 3915,
                        "name": "FunctionCall",
                        "src": "3889:46:12"
                      }
                    ],
                    "id": 3916,
                    "name": "ExpressionStatement",
                    "src": "3889:46:12"
                  }
                ],
                "id": 3917,
                "name": "Block",
                "src": "3680:262:12"
              }
            ],
            "id": 3918,
            "name": "FunctionDefinition",
            "src": "3572:370:12"
          },
          {
            "attributes": {
              "constant": false,
              "implemented": true,
              "isConstructor": false,
              "modifiers": [
                null
              ],
              "name": "withdraw",
              "payable": false,
              "scope": 4821,
              "stateMutability": "nonpayable",
              "superFunction": null,
              "visibility": "external"
            },
            "children": [
              {
                "children": [
                  {
                    "attributes": {
                      "constant": false,
                      "name": "start",
                      "scope": 4001,
                      "stateVariable": false,
                      "storageLocation": "default",
                      "type": "uint256",
                      "value": null,
                      "visibility": "internal"
                    },
                    "children": [
                      {
                        "attributes": {
                          "name": "uint",
                          "type": "uint256"
                        },
                        "id": 3919,
                        "name": "ElementaryTypeName",
                        "src": "4123:4:12"
                      }
                    ],
                    "id": 3920,
                    "name": "VariableDeclaration",
                    "src": "4123:10:12"
                  },
                  {
                    "attributes": {
                      "constant": false,
                      "name": "end",
                      "scope": 4001,
                      "stateVariable": false,
                      "storageLocation": "default",
                      "type": "uint256",
                      "value": null,
                      "visibility": "internal"
                    },
                    "children": [
                      {
                        "attributes": {
                          "name": "uint",
                          "type": "uint256"
                        },
                        "id": 3921,
                        "name": "ElementaryTypeName",
                        "src": "4143:4:12"
                      }
                    ],
                    "id": 3922,
                    "name": "VariableDeclaration",
                    "src": "4143:8:12"
                  }
                ],
                "id": 3923,
                "name": "ParameterList",
                "src": "4113:44:12"
              },
              {
                "attributes": {
                  "parameters": [
                    null
                  ]
                },
                "children": [],
                "id": 3924,
                "name": "ParameterList",
                "src": "4179:0:12"
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
                              "referencedDeclaration": 11810,
                              "type": "function (bool) pure",
                              "value": "require"
                            },
                            "id": 3925,
                            "name": "Identifier",
                            "src": "4257:7:12"
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
                              "operator": ">",
                              "type": "bool"
                            },
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
                                  "type": "uint256",
                                  "type_conversion": false
                                },
                                "children": [
                                  {
                                    "attributes": {
                                      "argumentTypes": [
                                        {
                                          "typeIdentifier": "t_address",
                                          "typeString": "address"
                                        }
                                      ],
                                      "overloadedDeclarations": [
                                        null
                                      ],
                                      "referencedDeclaration": 4276,
                                      "type": "function (address) view returns (uint256)",
                                      "value": "balanceOf"
                                    },
                                    "id": 3926,
                                    "name": "Identifier",
                                    "src": "4265:9:12"
                                  },
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "isConstant": false,
                                      "isLValue": false,
                                      "isPure": false,
                                      "lValueRequested": false,
                                      "member_name": "sender",
                                      "referencedDeclaration": null,
                                      "type": "address"
                                    },
                                    "children": [
                                      {
                                        "attributes": {
                                          "argumentTypes": null,
                                          "overloadedDeclarations": [
                                            null
                                          ],
                                          "referencedDeclaration": 11807,
                                          "type": "msg",
                                          "value": "msg"
                                        },
                                        "id": 3927,
                                        "name": "Identifier",
                                        "src": "4275:3:12"
                                      }
                                    ],
                                    "id": 3928,
                                    "name": "MemberAccess",
                                    "src": "4275:10:12"
                                  }
                                ],
                                "id": 3929,
                                "name": "FunctionCall",
                                "src": "4265:21:12"
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
                                "id": 3930,
                                "name": "Literal",
                                "src": "4289:1:12"
                              }
                            ],
                            "id": 3931,
                            "name": "BinaryOperation",
                            "src": "4265:25:12"
                          }
                        ],
                        "id": 3932,
                        "name": "FunctionCall",
                        "src": "4257:34:12"
                      }
                    ],
                    "id": 3933,
                    "name": "ExpressionStatement",
                    "src": "4257:34:12"
                  },
                  {
                    "attributes": {
                      "assignments": [
                        3935
                      ]
                    },
                    "children": [
                      {
                        "attributes": {
                          "constant": false,
                          "name": "withdrawalAmount",
                          "scope": 4001,
                          "stateVariable": false,
                          "storageLocation": "default",
                          "type": "uint256",
                          "value": null,
                          "visibility": "internal"
                        },
                        "children": [
                          {
                            "attributes": {
                              "name": "uint",
                              "type": "uint256"
                            },
                            "id": 3934,
                            "name": "ElementaryTypeName",
                            "src": "4453:4:12"
                          }
                        ],
                        "id": 3935,
                        "name": "VariableDeclaration",
                        "src": "4453:21:12"
                      },
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
                          "type": "uint256",
                          "type_conversion": false
                        },
                        "children": [
                          {
                            "attributes": {
                              "argumentTypes": [
                                {
                                  "typeIdentifier": "t_address",
                                  "typeString": "address"
                                },
                                {
                                  "typeIdentifier": "t_uint256",
                                  "typeString": "uint256"
                                },
                                {
                                  "typeIdentifier": "t_uint256",
                                  "typeString": "uint256"
                                }
                              ],
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4105,
                              "type": "function (address,uint256,uint256) view returns (uint256)",
                              "value": "getWithdrawalAllowance"
                            },
                            "id": 3936,
                            "name": "Identifier",
                            "src": "4477:22:12"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "isConstant": false,
                              "isLValue": false,
                              "isPure": false,
                              "lValueRequested": false,
                              "member_name": "sender",
                              "referencedDeclaration": null,
                              "type": "address"
                            },
                            "children": [
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "overloadedDeclarations": [
                                    null
                                  ],
                                  "referencedDeclaration": 11807,
                                  "type": "msg",
                                  "value": "msg"
                                },
                                "id": 3937,
                                "name": "Identifier",
                                "src": "4500:3:12"
                              }
                            ],
                            "id": 3938,
                            "name": "MemberAccess",
                            "src": "4500:10:12"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 3920,
                              "type": "uint256",
                              "value": "start"
                            },
                            "id": 3939,
                            "name": "Identifier",
                            "src": "4512:5:12"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 3922,
                              "type": "uint256",
                              "value": "end"
                            },
                            "id": 3940,
                            "name": "Identifier",
                            "src": "4519:3:12"
                          }
                        ],
                        "id": 3941,
                        "name": "FunctionCall",
                        "src": "4477:46:12"
                      }
                    ],
                    "id": 3942,
                    "name": "VariableDeclarationStatement",
                    "src": "4453:70:12"
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
                              "referencedDeclaration": 11810,
                              "type": "function (bool) pure",
                              "value": "require"
                            },
                            "id": 3943,
                            "name": "Identifier",
                            "src": "4613:7:12"
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
                              "operator": ">",
                              "type": "bool"
                            },
                            "children": [
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "overloadedDeclarations": [
                                    null
                                  ],
                                  "referencedDeclaration": 3935,
                                  "type": "uint256",
                                  "value": "withdrawalAmount"
                                },
                                "id": 3944,
                                "name": "Identifier",
                                "src": "4621:16:12"
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
                                "id": 3945,
                                "name": "Literal",
                                "src": "4640:1:12"
                              }
                            ],
                            "id": 3946,
                            "name": "BinaryOperation",
                            "src": "4621:20:12"
                          }
                        ],
                        "id": 3947,
                        "name": "FunctionCall",
                        "src": "4613:29:12"
                      }
                    ],
                    "id": 3948,
                    "name": "ExpressionStatement",
                    "src": "4613:29:12"
                  },
                  {
                    "attributes": {
                      "assignments": [
                        3950
                      ]
                    },
                    "children": [
                      {
                        "attributes": {
                          "constant": false,
                          "name": "repaymentToken",
                          "scope": 4001,
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
                            "id": 3949,
                            "name": "ElementaryTypeName",
                            "src": "4726:7:12"
                          }
                        ],
                        "id": 3950,
                        "name": "VariableDeclaration",
                        "src": "4726:22:12"
                      },
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
                          "type": "address",
                          "type_conversion": false
                        },
                        "children": [
                          {
                            "attributes": {
                              "argumentTypes": [
                                {
                                  "typeIdentifier": "t_uint256",
                                  "typeString": "uint256"
                                }
                              ],
                              "isConstant": false,
                              "isLValue": false,
                              "isPure": false,
                              "lValueRequested": false,
                              "member_name": "getTokenAddressByIndex",
                              "referencedDeclaration": 3439,
                              "type": "function (uint256) view external returns (address)"
                            },
                            "children": [
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "arguments": [
                                    null
                                  ],
                                  "isConstant": false,
                                  "isLValue": false,
                                  "isPure": false,
                                  "isStructConstructorCall": false,
                                  "lValueRequested": false,
                                  "names": [
                                    null
                                  ],
                                  "type": "contract TokenRegistry",
                                  "type_conversion": false
                                },
                                "children": [
                                  {
                                    "attributes": {
                                      "argumentTypes": [
                                        null
                                      ],
                                      "isConstant": false,
                                      "isLValue": false,
                                      "isPure": false,
                                      "lValueRequested": false,
                                      "member_name": "tokenRegistry",
                                      "referencedDeclaration": 654,
                                      "type": "function () view external returns (contract TokenRegistry)"
                                    },
                                    "children": [
                                      {
                                        "attributes": {
                                          "argumentTypes": null,
                                          "overloadedDeclarations": [
                                            null
                                          ],
                                          "referencedDeclaration": 3812,
                                          "type": "contract ContractRegistry",
                                          "value": "contractRegistry"
                                        },
                                        "id": 3951,
                                        "name": "Identifier",
                                        "src": "4751:16:12"
                                      }
                                    ],
                                    "id": 3952,
                                    "name": "MemberAccess",
                                    "src": "4751:30:12"
                                  }
                                ],
                                "id": 3953,
                                "name": "FunctionCall",
                                "src": "4751:32:12"
                              }
                            ],
                            "id": 3954,
                            "name": "MemberAccess",
                            "src": "4751:55:12"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 3814,
                              "type": "uint256",
                              "value": "repaymentTokenIndex"
                            },
                            "id": 3955,
                            "name": "Identifier",
                            "src": "4807:19:12"
                          }
                        ],
                        "id": 3956,
                        "name": "FunctionCall",
                        "src": "4751:76:12"
                      }
                    ],
                    "id": 3957,
                    "name": "VariableDeclarationStatement",
                    "src": "4726:101:12"
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
                              "referencedDeclaration": 11810,
                              "type": "function (bool) pure",
                              "value": "require"
                            },
                            "id": 3958,
                            "name": "Identifier",
                            "src": "4838:7:12"
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
                                  "isConstant": false,
                                  "isLValue": false,
                                  "isPure": false,
                                  "isStructConstructorCall": false,
                                  "lValueRequested": false,
                                  "names": [
                                    null
                                  ],
                                  "type": "uint256",
                                  "type_conversion": false
                                },
                                "children": [
                                  {
                                    "attributes": {
                                      "argumentTypes": [
                                        {
                                          "typeIdentifier": "t_contract$_CrowdfundingToken_$4821",
                                          "typeString": "contract CrowdfundingToken"
                                        }
                                      ],
                                      "isConstant": false,
                                      "isLValue": false,
                                      "isPure": false,
                                      "lValueRequested": false,
                                      "member_name": "balanceOf",
                                      "referencedDeclaration": 10278,
                                      "type": "function (address) view external returns (uint256)"
                                    },
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
                                          "type": "contract ERC20",
                                          "type_conversion": true
                                        },
                                        "children": [
                                          {
                                            "attributes": {
                                              "argumentTypes": [
                                                {
                                                  "typeIdentifier": "t_address",
                                                  "typeString": "address"
                                                }
                                              ],
                                              "overloadedDeclarations": [
                                                null
                                              ],
                                              "referencedDeclaration": 10264,
                                              "type": "type(contract ERC20)",
                                              "value": "ERC20"
                                            },
                                            "id": 3959,
                                            "name": "Identifier",
                                            "src": "4846:5:12"
                                          },
                                          {
                                            "attributes": {
                                              "argumentTypes": null,
                                              "overloadedDeclarations": [
                                                null
                                              ],
                                              "referencedDeclaration": 3950,
                                              "type": "address",
                                              "value": "repaymentToken"
                                            },
                                            "id": 3960,
                                            "name": "Identifier",
                                            "src": "4852:14:12"
                                          }
                                        ],
                                        "id": 3961,
                                        "name": "FunctionCall",
                                        "src": "4846:21:12"
                                      }
                                    ],
                                    "id": 3962,
                                    "name": "MemberAccess",
                                    "src": "4846:31:12"
                                  },
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "overloadedDeclarations": [
                                        null
                                      ],
                                      "referencedDeclaration": 11876,
                                      "type": "contract CrowdfundingToken",
                                      "value": "this"
                                    },
                                    "id": 3963,
                                    "name": "Identifier",
                                    "src": "4878:4:12"
                                  }
                                ],
                                "id": 3964,
                                "name": "FunctionCall",
                                "src": "4846:37:12"
                              },
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "overloadedDeclarations": [
                                    null
                                  ],
                                  "referencedDeclaration": 3935,
                                  "type": "uint256",
                                  "value": "withdrawalAmount"
                                },
                                "id": 3965,
                                "name": "Identifier",
                                "src": "4887:16:12"
                              }
                            ],
                            "id": 3966,
                            "name": "BinaryOperation",
                            "src": "4846:57:12"
                          }
                        ],
                        "id": 3967,
                        "name": "FunctionCall",
                        "src": "4838:66:12"
                      }
                    ],
                    "id": 3968,
                    "name": "ExpressionStatement",
                    "src": "4838:66:12"
                  },
                  {
                    "attributes": {
                      "falseBody": null
                    },
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
                          "type": "bool",
                          "type_conversion": false
                        },
                        "children": [
                          {
                            "attributes": {
                              "argumentTypes": [
                                {
                                  "typeIdentifier": "t_address",
                                  "typeString": "address"
                                },
                                {
                                  "typeIdentifier": "t_uint256",
                                  "typeString": "uint256"
                                }
                              ],
                              "isConstant": false,
                              "isLValue": false,
                              "isPure": false,
                              "lValueRequested": false,
                              "member_name": "transfer",
                              "referencedDeclaration": 10287,
                              "type": "function (address,uint256) external returns (bool)"
                            },
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
                                  "type": "contract ERC20",
                                  "type_conversion": true
                                },
                                "children": [
                                  {
                                    "attributes": {
                                      "argumentTypes": [
                                        {
                                          "typeIdentifier": "t_address",
                                          "typeString": "address"
                                        }
                                      ],
                                      "overloadedDeclarations": [
                                        null
                                      ],
                                      "referencedDeclaration": 10264,
                                      "type": "type(contract ERC20)",
                                      "value": "ERC20"
                                    },
                                    "id": 3969,
                                    "name": "Identifier",
                                    "src": "5001:5:12"
                                  },
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "overloadedDeclarations": [
                                        null
                                      ],
                                      "referencedDeclaration": 3950,
                                      "type": "address",
                                      "value": "repaymentToken"
                                    },
                                    "id": 3970,
                                    "name": "Identifier",
                                    "src": "5007:14:12"
                                  }
                                ],
                                "id": 3971,
                                "name": "FunctionCall",
                                "src": "5001:21:12"
                              }
                            ],
                            "id": 3972,
                            "name": "MemberAccess",
                            "src": "5001:30:12"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "isConstant": false,
                              "isLValue": false,
                              "isPure": false,
                              "lValueRequested": false,
                              "member_name": "sender",
                              "referencedDeclaration": null,
                              "type": "address"
                            },
                            "children": [
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "overloadedDeclarations": [
                                    null
                                  ],
                                  "referencedDeclaration": 11807,
                                  "type": "msg",
                                  "value": "msg"
                                },
                                "id": 3973,
                                "name": "Identifier",
                                "src": "5049:3:12"
                              }
                            ],
                            "id": 3974,
                            "name": "MemberAccess",
                            "src": "5049:10:12"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 3935,
                              "type": "uint256",
                              "value": "withdrawalAmount"
                            },
                            "id": 3975,
                            "name": "Identifier",
                            "src": "5077:16:12"
                          }
                        ],
                        "id": 3976,
                        "name": "FunctionCall",
                        "src": "5001:106:12"
                      },
                      {
                        "children": [
                          {
                            "children": [
                              {
                                "attributes": {
                                  "assignments": [
                                    3978
                                  ]
                                },
                                "children": [
                                  {
                                    "attributes": {
                                      "constant": false,
                                      "name": "i",
                                      "scope": 4001,
                                      "stateVariable": false,
                                      "storageLocation": "default",
                                      "type": "uint256",
                                      "value": null,
                                      "visibility": "internal"
                                    },
                                    "children": [
                                      {
                                        "attributes": {
                                          "name": "uint",
                                          "type": "uint256"
                                        },
                                        "id": 3977,
                                        "name": "ElementaryTypeName",
                                        "src": "5200:4:12"
                                      }
                                    ],
                                    "id": 3978,
                                    "name": "VariableDeclaration",
                                    "src": "5200:6:12"
                                  },
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "overloadedDeclarations": [
                                        null
                                      ],
                                      "referencedDeclaration": 3920,
                                      "type": "uint256",
                                      "value": "start"
                                    },
                                    "id": 3979,
                                    "name": "Identifier",
                                    "src": "5209:5:12"
                                  }
                                ],
                                "id": 3980,
                                "name": "VariableDeclarationStatement",
                                "src": "5200:14:12"
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
                                      "referencedDeclaration": 3978,
                                      "type": "uint256",
                                      "value": "i"
                                    },
                                    "id": 3981,
                                    "name": "Identifier",
                                    "src": "5216:1:12"
                                  },
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "overloadedDeclarations": [
                                        null
                                      ],
                                      "referencedDeclaration": 3922,
                                      "type": "uint256",
                                      "value": "end"
                                    },
                                    "id": 3982,
                                    "name": "Identifier",
                                    "src": "5221:3:12"
                                  }
                                ],
                                "id": 3983,
                                "name": "BinaryOperation",
                                "src": "5216:8:12"
                              },
                              {
                                "children": [
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "isConstant": false,
                                      "isLValue": false,
                                      "isPure": false,
                                      "lValueRequested": false,
                                      "operator": "++",
                                      "prefix": false,
                                      "type": "uint256"
                                    },
                                    "children": [
                                      {
                                        "attributes": {
                                          "argumentTypes": null,
                                          "overloadedDeclarations": [
                                            null
                                          ],
                                          "referencedDeclaration": 3978,
                                          "type": "uint256",
                                          "value": "i"
                                        },
                                        "id": 3984,
                                        "name": "Identifier",
                                        "src": "5226:1:12"
                                      }
                                    ],
                                    "id": 3985,
                                    "name": "UnaryOperation",
                                    "src": "5226:3:12"
                                  }
                                ],
                                "id": 3986,
                                "name": "ExpressionStatement",
                                "src": "5226:3:12"
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
                                          "lValueRequested": false,
                                          "operator": "=",
                                          "type": "bool"
                                        },
                                        "children": [
                                          {
                                            "attributes": {
                                              "argumentTypes": null,
                                              "isConstant": false,
                                              "isLValue": true,
                                              "isPure": false,
                                              "lValueRequested": true,
                                              "type": "bool"
                                            },
                                            "children": [
                                              {
                                                "attributes": {
                                                  "argumentTypes": null,
                                                  "isConstant": false,
                                                  "isLValue": true,
                                                  "isPure": false,
                                                  "lValueRequested": false,
                                                  "type": "mapping(uint256 => bool)"
                                                },
                                                "children": [
                                                  {
                                                    "attributes": {
                                                      "argumentTypes": null,
                                                      "overloadedDeclarations": [
                                                        null
                                                      ],
                                                      "referencedDeclaration": 3823,
                                                      "type": "mapping(address => mapping(uint256 => bool))",
                                                      "value": "withdrawals"
                                                    },
                                                    "id": 3987,
                                                    "name": "Identifier",
                                                    "src": "5249:11:12"
                                                  },
                                                  {
                                                    "attributes": {
                                                      "argumentTypes": null,
                                                      "isConstant": false,
                                                      "isLValue": false,
                                                      "isPure": false,
                                                      "lValueRequested": false,
                                                      "member_name": "sender",
                                                      "referencedDeclaration": null,
                                                      "type": "address"
                                                    },
                                                    "children": [
                                                      {
                                                        "attributes": {
                                                          "argumentTypes": null,
                                                          "overloadedDeclarations": [
                                                            null
                                                          ],
                                                          "referencedDeclaration": 11807,
                                                          "type": "msg",
                                                          "value": "msg"
                                                        },
                                                        "id": 3988,
                                                        "name": "Identifier",
                                                        "src": "5261:3:12"
                                                      }
                                                    ],
                                                    "id": 3989,
                                                    "name": "MemberAccess",
                                                    "src": "5261:10:12"
                                                  }
                                                ],
                                                "id": 3991,
                                                "name": "IndexAccess",
                                                "src": "5249:23:12"
                                              },
                                              {
                                                "attributes": {
                                                  "argumentTypes": null,
                                                  "overloadedDeclarations": [
                                                    null
                                                  ],
                                                  "referencedDeclaration": 3978,
                                                  "type": "uint256",
                                                  "value": "i"
                                                },
                                                "id": 3990,
                                                "name": "Identifier",
                                                "src": "5273:1:12"
                                              }
                                            ],
                                            "id": 3992,
                                            "name": "IndexAccess",
                                            "src": "5249:26:12"
                                          },
                                          {
                                            "attributes": {
                                              "argumentTypes": null,
                                              "hexvalue": "74727565",
                                              "isConstant": false,
                                              "isLValue": false,
                                              "isPure": true,
                                              "lValueRequested": false,
                                              "subdenomination": null,
                                              "token": "bool",
                                              "type": "bool",
                                              "value": "true"
                                            },
                                            "id": 3993,
                                            "name": "Literal",
                                            "src": "5278:4:12"
                                          }
                                        ],
                                        "id": 3994,
                                        "name": "Assignment",
                                        "src": "5249:33:12"
                                      }
                                    ],
                                    "id": 3995,
                                    "name": "ExpressionStatement",
                                    "src": "5249:33:12"
                                  }
                                ],
                                "id": 3996,
                                "name": "Block",
                                "src": "5231:66:12"
                              }
                            ],
                            "id": 3997,
                            "name": "ForStatement",
                            "src": "5195:102:12"
                          }
                        ],
                        "id": 3998,
                        "name": "Block",
                        "src": "5118:189:12"
                      }
                    ],
                    "id": 3999,
                    "name": "IfStatement",
                    "src": "4984:323:12"
                  }
                ],
                "id": 4000,
                "name": "Block",
                "src": "4179:1134:12"
              }
            ],
            "id": 4001,
            "name": "FunctionDefinition",
            "src": "4096:1217:12"
          },
          {
            "attributes": {
              "constant": true,
              "implemented": true,
              "isConstructor": false,
              "modifiers": [
                null
              ],
              "name": "getNumberOfRepaymentsMade",
              "payable": false,
              "scope": 4821,
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
                "id": 4002,
                "name": "ParameterList",
                "src": "5421:7:12"
              },
              {
                "children": [
                  {
                    "attributes": {
                      "constant": false,
                      "name": "numberOfRepaymentsMade",
                      "scope": 4010,
                      "stateVariable": false,
                      "storageLocation": "default",
                      "type": "uint256",
                      "value": null,
                      "visibility": "internal"
                    },
                    "children": [
                      {
                        "attributes": {
                          "name": "uint",
                          "type": "uint256"
                        },
                        "id": 4003,
                        "name": "ElementaryTypeName",
                        "src": "5474:4:12"
                      }
                    ],
                    "id": 4004,
                    "name": "VariableDeclaration",
                    "src": "5474:27:12"
                  }
                ],
                "id": 4005,
                "name": "ParameterList",
                "src": "5473:29:12"
              },
              {
                "children": [
                  {
                    "attributes": {
                      "functionReturnParameters": 4005
                    },
                    "children": [
                      {
                        "attributes": {
                          "argumentTypes": null,
                          "isConstant": false,
                          "isLValue": true,
                          "isPure": false,
                          "lValueRequested": false,
                          "member_name": "length",
                          "referencedDeclaration": null,
                          "type": "uint256"
                        },
                        "children": [
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 3817,
                              "type": "struct CrowdfundingToken.Checkpoint storage ref[] storage ref",
                              "value": "repayments"
                            },
                            "id": 4006,
                            "name": "Identifier",
                            "src": "5524:10:12"
                          }
                        ],
                        "id": 4007,
                        "name": "MemberAccess",
                        "src": "5524:17:12"
                      }
                    ],
                    "id": 4008,
                    "name": "Return",
                    "src": "5517:24:12"
                  }
                ],
                "id": 4009,
                "name": "Block",
                "src": "5507:41:12"
              }
            ],
            "id": 4010,
            "name": "FunctionDefinition",
            "src": "5387:161:12"
          },
          {
            "attributes": {
              "constant": true,
              "implemented": true,
              "isConstructor": false,
              "modifiers": [
                null
              ],
              "name": "getWithdrawalAllowance",
              "payable": false,
              "scope": 4821,
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
                      "name": "account",
                      "scope": 4105,
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
                        "id": 4011,
                        "name": "ElementaryTypeName",
                        "src": "5754:7:12"
                      }
                    ],
                    "id": 4012,
                    "name": "VariableDeclaration",
                    "src": "5754:15:12"
                  },
                  {
                    "attributes": {
                      "constant": false,
                      "name": "start",
                      "scope": 4105,
                      "stateVariable": false,
                      "storageLocation": "default",
                      "type": "uint256",
                      "value": null,
                      "visibility": "internal"
                    },
                    "children": [
                      {
                        "attributes": {
                          "name": "uint",
                          "type": "uint256"
                        },
                        "id": 4013,
                        "name": "ElementaryTypeName",
                        "src": "5779:4:12"
                      }
                    ],
                    "id": 4014,
                    "name": "VariableDeclaration",
                    "src": "5779:10:12"
                  },
                  {
                    "attributes": {
                      "constant": false,
                      "name": "end",
                      "scope": 4105,
                      "stateVariable": false,
                      "storageLocation": "default",
                      "type": "uint256",
                      "value": null,
                      "visibility": "internal"
                    },
                    "children": [
                      {
                        "attributes": {
                          "name": "uint",
                          "type": "uint256"
                        },
                        "id": 4015,
                        "name": "ElementaryTypeName",
                        "src": "5799:4:12"
                      }
                    ],
                    "id": 4016,
                    "name": "VariableDeclaration",
                    "src": "5799:8:12"
                  }
                ],
                "id": 4017,
                "name": "ParameterList",
                "src": "5744:69:12"
              },
              {
                "children": [
                  {
                    "attributes": {
                      "constant": false,
                      "name": "totalWithdrawalAllowance",
                      "scope": 4105,
                      "stateVariable": false,
                      "storageLocation": "default",
                      "type": "uint256",
                      "value": null,
                      "visibility": "internal"
                    },
                    "children": [
                      {
                        "attributes": {
                          "name": "uint",
                          "type": "uint256"
                        },
                        "id": 4018,
                        "name": "ElementaryTypeName",
                        "src": "5859:4:12"
                      }
                    ],
                    "id": 4019,
                    "name": "VariableDeclaration",
                    "src": "5859:29:12"
                  }
                ],
                "id": 4020,
                "name": "ParameterList",
                "src": "5858:31:12"
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
                              "referencedDeclaration": 11810,
                              "type": "function (bool) pure",
                              "value": "require"
                            },
                            "id": 4021,
                            "name": "Identifier",
                            "src": "5904:7:12"
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
                                  "referencedDeclaration": 4014,
                                  "type": "uint256",
                                  "value": "start"
                                },
                                "id": 4022,
                                "name": "Identifier",
                                "src": "5912:5:12"
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
                                "id": 4023,
                                "name": "Literal",
                                "src": "5921:1:12"
                              }
                            ],
                            "id": 4024,
                            "name": "BinaryOperation",
                            "src": "5912:10:12"
                          }
                        ],
                        "id": 4025,
                        "name": "FunctionCall",
                        "src": "5904:19:12"
                      }
                    ],
                    "id": 4026,
                    "name": "ExpressionStatement",
                    "src": "5904:19:12"
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
                              "referencedDeclaration": 11810,
                              "type": "function (bool) pure",
                              "value": "require"
                            },
                            "id": 4027,
                            "name": "Identifier",
                            "src": "5934:7:12"
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
                              "operator": "<",
                              "type": "bool"
                            },
                            "children": [
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "overloadedDeclarations": [
                                    null
                                  ],
                                  "referencedDeclaration": 4016,
                                  "type": "uint256",
                                  "value": "end"
                                },
                                "id": 4028,
                                "name": "Identifier",
                                "src": "5942:3:12"
                              },
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "isConstant": false,
                                  "isLValue": true,
                                  "isPure": false,
                                  "lValueRequested": false,
                                  "member_name": "length",
                                  "referencedDeclaration": null,
                                  "type": "uint256"
                                },
                                "children": [
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "overloadedDeclarations": [
                                        null
                                      ],
                                      "referencedDeclaration": 3817,
                                      "type": "struct CrowdfundingToken.Checkpoint storage ref[] storage ref",
                                      "value": "repayments"
                                    },
                                    "id": 4029,
                                    "name": "Identifier",
                                    "src": "5948:10:12"
                                  }
                                ],
                                "id": 4030,
                                "name": "MemberAccess",
                                "src": "5948:17:12"
                              }
                            ],
                            "id": 4031,
                            "name": "BinaryOperation",
                            "src": "5942:23:12"
                          }
                        ],
                        "id": 4032,
                        "name": "FunctionCall",
                        "src": "5934:32:12"
                      }
                    ],
                    "id": 4033,
                    "name": "ExpressionStatement",
                    "src": "5934:32:12"
                  },
                  {
                    "attributes": {
                      "assignments": [
                        4037
                      ]
                    },
                    "children": [
                      {
                        "attributes": {
                          "constant": false,
                          "name": "accountWithdrawals",
                          "scope": 4105,
                          "stateVariable": false,
                          "storageLocation": "default",
                          "type": "mapping(uint256 => bool)",
                          "value": null,
                          "visibility": "internal"
                        },
                        "children": [
                          {
                            "attributes": {
                              "type": "mapping(uint256 => bool)"
                            },
                            "children": [
                              {
                                "attributes": {
                                  "name": "uint",
                                  "type": "uint256"
                                },
                                "id": 4034,
                                "name": "ElementaryTypeName",
                                "src": "5986:4:12"
                              },
                              {
                                "attributes": {
                                  "name": "bool",
                                  "type": "bool"
                                },
                                "id": 4035,
                                "name": "ElementaryTypeName",
                                "src": "5994:4:12"
                              }
                            ],
                            "id": 4036,
                            "name": "Mapping",
                            "src": "5977:22:12"
                          }
                        ],
                        "id": 4037,
                        "name": "VariableDeclaration",
                        "src": "5977:41:12"
                      },
                      {
                        "attributes": {
                          "argumentTypes": null,
                          "isConstant": false,
                          "isLValue": true,
                          "isPure": false,
                          "lValueRequested": false,
                          "type": "mapping(uint256 => bool)"
                        },
                        "children": [
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 3823,
                              "type": "mapping(address => mapping(uint256 => bool))",
                              "value": "withdrawals"
                            },
                            "id": 4038,
                            "name": "Identifier",
                            "src": "6021:11:12"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4012,
                              "type": "address",
                              "value": "account"
                            },
                            "id": 4039,
                            "name": "Identifier",
                            "src": "6033:7:12"
                          }
                        ],
                        "id": 4040,
                        "name": "IndexAccess",
                        "src": "6021:20:12"
                      }
                    ],
                    "id": 4041,
                    "name": "VariableDeclarationStatement",
                    "src": "5977:64:12"
                  },
                  {
                    "children": [
                      {
                        "attributes": {
                          "assignments": [
                            4043
                          ]
                        },
                        "children": [
                          {
                            "attributes": {
                              "constant": false,
                              "name": "i",
                              "scope": 4105,
                              "stateVariable": false,
                              "storageLocation": "default",
                              "type": "uint256",
                              "value": null,
                              "visibility": "internal"
                            },
                            "children": [
                              {
                                "attributes": {
                                  "name": "uint",
                                  "type": "uint256"
                                },
                                "id": 4042,
                                "name": "ElementaryTypeName",
                                "src": "6057:4:12"
                              }
                            ],
                            "id": 4043,
                            "name": "VariableDeclaration",
                            "src": "6057:6:12"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4014,
                              "type": "uint256",
                              "value": "start"
                            },
                            "id": 4044,
                            "name": "Identifier",
                            "src": "6066:5:12"
                          }
                        ],
                        "id": 4045,
                        "name": "VariableDeclarationStatement",
                        "src": "6057:14:12"
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
                              "referencedDeclaration": 4043,
                              "type": "uint256",
                              "value": "i"
                            },
                            "id": 4046,
                            "name": "Identifier",
                            "src": "6073:1:12"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4016,
                              "type": "uint256",
                              "value": "end"
                            },
                            "id": 4047,
                            "name": "Identifier",
                            "src": "6078:3:12"
                          }
                        ],
                        "id": 4048,
                        "name": "BinaryOperation",
                        "src": "6073:8:12"
                      },
                      {
                        "children": [
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "isConstant": false,
                              "isLValue": false,
                              "isPure": false,
                              "lValueRequested": false,
                              "operator": "++",
                              "prefix": false,
                              "type": "uint256"
                            },
                            "children": [
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "overloadedDeclarations": [
                                    null
                                  ],
                                  "referencedDeclaration": 4043,
                                  "type": "uint256",
                                  "value": "i"
                                },
                                "id": 4049,
                                "name": "Identifier",
                                "src": "6083:1:12"
                              }
                            ],
                            "id": 4050,
                            "name": "UnaryOperation",
                            "src": "6083:3:12"
                          }
                        ],
                        "id": 4051,
                        "name": "ExpressionStatement",
                        "src": "6083:3:12"
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
                                  "isConstant": false,
                                  "isLValue": true,
                                  "isPure": false,
                                  "lValueRequested": false,
                                  "type": "bool"
                                },
                                "children": [
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "overloadedDeclarations": [
                                        null
                                      ],
                                      "referencedDeclaration": 4037,
                                      "type": "mapping(uint256 => bool)",
                                      "value": "accountWithdrawals"
                                    },
                                    "id": 4052,
                                    "name": "Identifier",
                                    "src": "6197:18:12"
                                  },
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "overloadedDeclarations": [
                                        null
                                      ],
                                      "referencedDeclaration": 4043,
                                      "type": "uint256",
                                      "value": "i"
                                    },
                                    "id": 4053,
                                    "name": "Identifier",
                                    "src": "6216:1:12"
                                  }
                                ],
                                "id": 4054,
                                "name": "IndexAccess",
                                "src": "6197:21:12"
                              },
                              {
                                "children": [
                                  {
                                    "id": 4055,
                                    "name": "Continue",
                                    "src": "6238:8:12"
                                  }
                                ],
                                "id": 4056,
                                "name": "Block",
                                "src": "6220:41:12"
                              }
                            ],
                            "id": 4057,
                            "name": "IfStatement",
                            "src": "6193:68:12"
                          },
                          {
                            "attributes": {
                              "assignments": [
                                4059
                              ]
                            },
                            "children": [
                              {
                                "attributes": {
                                  "constant": false,
                                  "name": "repaymentCheckpoint",
                                  "scope": 4105,
                                  "stateVariable": false,
                                  "storageLocation": "storage",
                                  "type": "struct CrowdfundingToken.Checkpoint storage pointer",
                                  "value": null,
                                  "visibility": "internal"
                                },
                                "children": [
                                  {
                                    "attributes": {
                                      "contractScope": null,
                                      "name": "Checkpoint",
                                      "referencedDeclaration": 3800,
                                      "type": "struct CrowdfundingToken.Checkpoint storage pointer"
                                    },
                                    "id": 4058,
                                    "name": "UserDefinedTypeName",
                                    "src": "6275:10:12"
                                  }
                                ],
                                "id": 4059,
                                "name": "VariableDeclaration",
                                "src": "6275:38:12"
                              },
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "isConstant": false,
                                  "isLValue": true,
                                  "isPure": false,
                                  "lValueRequested": false,
                                  "type": "struct CrowdfundingToken.Checkpoint storage ref"
                                },
                                "children": [
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "overloadedDeclarations": [
                                        null
                                      ],
                                      "referencedDeclaration": 3817,
                                      "type": "struct CrowdfundingToken.Checkpoint storage ref[] storage ref",
                                      "value": "repayments"
                                    },
                                    "id": 4060,
                                    "name": "Identifier",
                                    "src": "6316:10:12"
                                  },
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "overloadedDeclarations": [
                                        null
                                      ],
                                      "referencedDeclaration": 4043,
                                      "type": "uint256",
                                      "value": "i"
                                    },
                                    "id": 4061,
                                    "name": "Identifier",
                                    "src": "6327:1:12"
                                  }
                                ],
                                "id": 4062,
                                "name": "IndexAccess",
                                "src": "6316:13:12"
                              }
                            ],
                            "id": 4063,
                            "name": "VariableDeclarationStatement",
                            "src": "6275:54:12"
                          },
                          {
                            "attributes": {
                              "assignments": [
                                4065
                              ]
                            },
                            "children": [
                              {
                                "attributes": {
                                  "constant": false,
                                  "name": "repaymentAmount",
                                  "scope": 4105,
                                  "stateVariable": false,
                                  "storageLocation": "default",
                                  "type": "uint256",
                                  "value": null,
                                  "visibility": "internal"
                                },
                                "children": [
                                  {
                                    "attributes": {
                                      "name": "uint",
                                      "type": "uint256"
                                    },
                                    "id": 4064,
                                    "name": "ElementaryTypeName",
                                    "src": "6344:4:12"
                                  }
                                ],
                                "id": 4065,
                                "name": "VariableDeclaration",
                                "src": "6344:20:12"
                              },
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "isConstant": false,
                                  "isLValue": true,
                                  "isPure": false,
                                  "lValueRequested": false,
                                  "member_name": "value",
                                  "referencedDeclaration": 3799,
                                  "type": "uint256"
                                },
                                "children": [
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "overloadedDeclarations": [
                                        null
                                      ],
                                      "referencedDeclaration": 4059,
                                      "type": "struct CrowdfundingToken.Checkpoint storage pointer",
                                      "value": "repaymentCheckpoint"
                                    },
                                    "id": 4066,
                                    "name": "Identifier",
                                    "src": "6367:19:12"
                                  }
                                ],
                                "id": 4067,
                                "name": "MemberAccess",
                                "src": "6367:25:12"
                              }
                            ],
                            "id": 4068,
                            "name": "VariableDeclarationStatement",
                            "src": "6344:48:12"
                          },
                          {
                            "attributes": {
                              "assignments": [
                                4070
                              ]
                            },
                            "children": [
                              {
                                "attributes": {
                                  "constant": false,
                                  "name": "blockNumber",
                                  "scope": 4105,
                                  "stateVariable": false,
                                  "storageLocation": "default",
                                  "type": "uint256",
                                  "value": null,
                                  "visibility": "internal"
                                },
                                "children": [
                                  {
                                    "attributes": {
                                      "name": "uint",
                                      "type": "uint256"
                                    },
                                    "id": 4069,
                                    "name": "ElementaryTypeName",
                                    "src": "6406:4:12"
                                  }
                                ],
                                "id": 4070,
                                "name": "VariableDeclaration",
                                "src": "6406:16:12"
                              },
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "isConstant": false,
                                  "isLValue": true,
                                  "isPure": false,
                                  "lValueRequested": false,
                                  "member_name": "fromBlock",
                                  "referencedDeclaration": 3797,
                                  "type": "uint256"
                                },
                                "children": [
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "overloadedDeclarations": [
                                        null
                                      ],
                                      "referencedDeclaration": 4059,
                                      "type": "struct CrowdfundingToken.Checkpoint storage pointer",
                                      "value": "repaymentCheckpoint"
                                    },
                                    "id": 4071,
                                    "name": "Identifier",
                                    "src": "6425:19:12"
                                  }
                                ],
                                "id": 4072,
                                "name": "MemberAccess",
                                "src": "6425:29:12"
                              }
                            ],
                            "id": 4073,
                            "name": "VariableDeclarationStatement",
                            "src": "6406:48:12"
                          },
                          {
                            "attributes": {
                              "assignments": [
                                4075
                              ]
                            },
                            "children": [
                              {
                                "attributes": {
                                  "constant": false,
                                  "name": "balanceAtBlockNumber",
                                  "scope": 4105,
                                  "stateVariable": false,
                                  "storageLocation": "default",
                                  "type": "uint256",
                                  "value": null,
                                  "visibility": "internal"
                                },
                                "children": [
                                  {
                                    "attributes": {
                                      "name": "uint",
                                      "type": "uint256"
                                    },
                                    "id": 4074,
                                    "name": "ElementaryTypeName",
                                    "src": "6469:4:12"
                                  }
                                ],
                                "id": 4075,
                                "name": "VariableDeclaration",
                                "src": "6469:25:12"
                              },
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
                                  "type": "uint256",
                                  "type_conversion": false
                                },
                                "children": [
                                  {
                                    "attributes": {
                                      "argumentTypes": [
                                        {
                                          "typeIdentifier": "t_address",
                                          "typeString": "address"
                                        },
                                        {
                                          "typeIdentifier": "t_uint256",
                                          "typeString": "uint256"
                                        }
                                      ],
                                      "overloadedDeclarations": [
                                        null
                                      ],
                                      "referencedDeclaration": 4423,
                                      "type": "function (address,uint256) view returns (uint256)",
                                      "value": "balanceOfAt"
                                    },
                                    "id": 4076,
                                    "name": "Identifier",
                                    "src": "6497:11:12"
                                  },
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "overloadedDeclarations": [
                                        null
                                      ],
                                      "referencedDeclaration": 4012,
                                      "type": "address",
                                      "value": "account"
                                    },
                                    "id": 4077,
                                    "name": "Identifier",
                                    "src": "6509:7:12"
                                  },
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "overloadedDeclarations": [
                                        null
                                      ],
                                      "referencedDeclaration": 4070,
                                      "type": "uint256",
                                      "value": "blockNumber"
                                    },
                                    "id": 4078,
                                    "name": "Identifier",
                                    "src": "6518:11:12"
                                  }
                                ],
                                "id": 4079,
                                "name": "FunctionCall",
                                "src": "6497:33:12"
                              }
                            ],
                            "id": 4080,
                            "name": "VariableDeclarationStatement",
                            "src": "6469:61:12"
                          },
                          {
                            "attributes": {
                              "assignments": [
                                4082
                              ]
                            },
                            "children": [
                              {
                                "attributes": {
                                  "constant": false,
                                  "name": "totalSupplyAtBlockNumber",
                                  "scope": 4105,
                                  "stateVariable": false,
                                  "storageLocation": "default",
                                  "type": "uint256",
                                  "value": null,
                                  "visibility": "internal"
                                },
                                "children": [
                                  {
                                    "attributes": {
                                      "name": "uint",
                                      "type": "uint256"
                                    },
                                    "id": 4081,
                                    "name": "ElementaryTypeName",
                                    "src": "6544:4:12"
                                  }
                                ],
                                "id": 4082,
                                "name": "VariableDeclaration",
                                "src": "6544:29:12"
                              },
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
                                  "type": "uint256",
                                  "type_conversion": false
                                },
                                "children": [
                                  {
                                    "attributes": {
                                      "argumentTypes": [
                                        {
                                          "typeIdentifier": "t_uint256",
                                          "typeString": "uint256"
                                        }
                                      ],
                                      "overloadedDeclarations": [
                                        null
                                      ],
                                      "referencedDeclaration": 4454,
                                      "type": "function (uint256) view returns (uint256)",
                                      "value": "totalSupplyAt"
                                    },
                                    "id": 4083,
                                    "name": "Identifier",
                                    "src": "6576:13:12"
                                  },
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "overloadedDeclarations": [
                                        null
                                      ],
                                      "referencedDeclaration": 4070,
                                      "type": "uint256",
                                      "value": "blockNumber"
                                    },
                                    "id": 4084,
                                    "name": "Identifier",
                                    "src": "6590:11:12"
                                  }
                                ],
                                "id": 4085,
                                "name": "FunctionCall",
                                "src": "6576:26:12"
                              }
                            ],
                            "id": 4086,
                            "name": "VariableDeclarationStatement",
                            "src": "6544:58:12"
                          },
                          {
                            "children": [
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "isConstant": false,
                                  "isLValue": false,
                                  "isPure": false,
                                  "lValueRequested": false,
                                  "operator": "=",
                                  "type": "uint256"
                                },
                                "children": [
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "overloadedDeclarations": [
                                        null
                                      ],
                                      "referencedDeclaration": 4019,
                                      "type": "uint256",
                                      "value": "totalWithdrawalAllowance"
                                    },
                                    "id": 4087,
                                    "name": "Identifier",
                                    "src": "6617:24:12"
                                  },
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
                                      "type": "uint256",
                                      "type_conversion": false
                                    },
                                    "children": [
                                      {
                                        "attributes": {
                                          "argumentTypes": [
                                            {
                                              "typeIdentifier": "t_uint256",
                                              "typeString": "uint256"
                                            }
                                          ],
                                          "isConstant": false,
                                          "isLValue": false,
                                          "isPure": false,
                                          "lValueRequested": false,
                                          "member_name": "add",
                                          "referencedDeclaration": 10068,
                                          "type": "function (uint256,uint256) pure returns (uint256)"
                                        },
                                        "children": [
                                          {
                                            "attributes": {
                                              "argumentTypes": null,
                                              "overloadedDeclarations": [
                                                null
                                              ],
                                              "referencedDeclaration": 4019,
                                              "type": "uint256",
                                              "value": "totalWithdrawalAllowance"
                                            },
                                            "id": 4088,
                                            "name": "Identifier",
                                            "src": "6644:24:12"
                                          }
                                        ],
                                        "id": 4089,
                                        "name": "MemberAccess",
                                        "src": "6644:45:12"
                                      },
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
                                          "type": "uint256",
                                          "type_conversion": false
                                        },
                                        "children": [
                                          {
                                            "attributes": {
                                              "argumentTypes": [
                                                {
                                                  "typeIdentifier": "t_uint256",
                                                  "typeString": "uint256"
                                                }
                                              ],
                                              "isConstant": false,
                                              "isLValue": false,
                                              "isPure": false,
                                              "lValueRequested": false,
                                              "member_name": "div",
                                              "referencedDeclaration": 10024,
                                              "type": "function (uint256,uint256) pure returns (uint256)"
                                            },
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
                                                  "type": "uint256",
                                                  "type_conversion": false
                                                },
                                                "children": [
                                                  {
                                                    "attributes": {
                                                      "argumentTypes": [
                                                        {
                                                          "typeIdentifier": "t_uint256",
                                                          "typeString": "uint256"
                                                        }
                                                      ],
                                                      "isConstant": false,
                                                      "isLValue": false,
                                                      "isPure": false,
                                                      "lValueRequested": false,
                                                      "member_name": "mul",
                                                      "referencedDeclaration": 10006,
                                                      "type": "function (uint256,uint256) pure returns (uint256)"
                                                    },
                                                    "children": [
                                                      {
                                                        "attributes": {
                                                          "argumentTypes": null,
                                                          "overloadedDeclarations": [
                                                            null
                                                          ],
                                                          "referencedDeclaration": 4065,
                                                          "type": "uint256",
                                                          "value": "repaymentAmount"
                                                        },
                                                        "id": 4090,
                                                        "name": "Identifier",
                                                        "src": "6690:15:12"
                                                      }
                                                    ],
                                                    "id": 4091,
                                                    "name": "MemberAccess",
                                                    "src": "6690:19:12"
                                                  },
                                                  {
                                                    "attributes": {
                                                      "argumentTypes": null,
                                                      "overloadedDeclarations": [
                                                        null
                                                      ],
                                                      "referencedDeclaration": 4075,
                                                      "type": "uint256",
                                                      "value": "balanceAtBlockNumber"
                                                    },
                                                    "id": 4092,
                                                    "name": "Identifier",
                                                    "src": "6710:20:12"
                                                  }
                                                ],
                                                "id": 4093,
                                                "name": "FunctionCall",
                                                "src": "6690:41:12"
                                              }
                                            ],
                                            "id": 4094,
                                            "name": "MemberAccess",
                                            "src": "6690:45:12"
                                          },
                                          {
                                            "attributes": {
                                              "argumentTypes": null,
                                              "overloadedDeclarations": [
                                                null
                                              ],
                                              "referencedDeclaration": 4082,
                                              "type": "uint256",
                                              "value": "totalSupplyAtBlockNumber"
                                            },
                                            "id": 4095,
                                            "name": "Identifier",
                                            "src": "6736:24:12"
                                          }
                                        ],
                                        "id": 4096,
                                        "name": "FunctionCall",
                                        "src": "6690:71:12"
                                      }
                                    ],
                                    "id": 4097,
                                    "name": "FunctionCall",
                                    "src": "6644:118:12"
                                  }
                                ],
                                "id": 4098,
                                "name": "Assignment",
                                "src": "6617:145:12"
                              }
                            ],
                            "id": 4099,
                            "name": "ExpressionStatement",
                            "src": "6617:145:12"
                          }
                        ],
                        "id": 4100,
                        "name": "Block",
                        "src": "6088:685:12"
                      }
                    ],
                    "id": 4101,
                    "name": "ForStatement",
                    "src": "6052:721:12"
                  },
                  {
                    "attributes": {
                      "functionReturnParameters": 4020
                    },
                    "children": [
                      {
                        "attributes": {
                          "argumentTypes": null,
                          "overloadedDeclarations": [
                            null
                          ],
                          "referencedDeclaration": 4019,
                          "type": "uint256",
                          "value": "totalWithdrawalAllowance"
                        },
                        "id": 4102,
                        "name": "Identifier",
                        "src": "6790:24:12"
                      }
                    ],
                    "id": 4103,
                    "name": "Return",
                    "src": "6783:31:12"
                  }
                ],
                "id": 4104,
                "name": "Block",
                "src": "5894:927:12"
              }
            ],
            "id": 4105,
            "name": "FunctionDefinition",
            "src": "5713:1108:12"
          },
          {
            "attributes": {
              "constant": false,
              "implemented": true,
              "isConstructor": false,
              "modifiers": [
                null
              ],
              "name": "transfer",
              "payable": false,
              "scope": 4821,
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
                      "name": "_to",
                      "scope": 4126,
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
                        "id": 4106,
                        "name": "ElementaryTypeName",
                        "src": "7137:7:12"
                      }
                    ],
                    "id": 4107,
                    "name": "VariableDeclaration",
                    "src": "7137:11:12"
                  },
                  {
                    "attributes": {
                      "constant": false,
                      "name": "_amount",
                      "scope": 4126,
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
                        "id": 4108,
                        "name": "ElementaryTypeName",
                        "src": "7150:7:12"
                      }
                    ],
                    "id": 4109,
                    "name": "VariableDeclaration",
                    "src": "7150:15:12"
                  }
                ],
                "id": 4110,
                "name": "ParameterList",
                "src": "7136:30:12"
              },
              {
                "children": [
                  {
                    "attributes": {
                      "constant": false,
                      "name": "success",
                      "scope": 4126,
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
                        "id": 4111,
                        "name": "ElementaryTypeName",
                        "src": "7183:4:12"
                      }
                    ],
                    "id": 4112,
                    "name": "VariableDeclaration",
                    "src": "7183:12:12"
                  }
                ],
                "id": 4113,
                "name": "ParameterList",
                "src": "7182:14:12"
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
                              "referencedDeclaration": 11810,
                              "type": "function (bool) pure",
                              "value": "require"
                            },
                            "id": 4114,
                            "name": "Identifier",
                            "src": "7207:7:12"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 3839,
                              "type": "bool",
                              "value": "transfersEnabled"
                            },
                            "id": 4115,
                            "name": "Identifier",
                            "src": "7215:16:12"
                          }
                        ],
                        "id": 4116,
                        "name": "FunctionCall",
                        "src": "7207:25:12"
                      }
                    ],
                    "id": 4117,
                    "name": "ExpressionStatement",
                    "src": "7207:25:12"
                  },
                  {
                    "attributes": {
                      "functionReturnParameters": 4113
                    },
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
                          "type": "bool",
                          "type_conversion": false
                        },
                        "children": [
                          {
                            "attributes": {
                              "argumentTypes": [
                                {
                                  "typeIdentifier": "t_address",
                                  "typeString": "address"
                                },
                                {
                                  "typeIdentifier": "t_address",
                                  "typeString": "address"
                                },
                                {
                                  "typeIdentifier": "t_uint256",
                                  "typeString": "uint256"
                                }
                              ],
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4262,
                              "type": "function (address,address,uint256) returns (bool)",
                              "value": "doTransfer"
                            },
                            "id": 4118,
                            "name": "Identifier",
                            "src": "7249:10:12"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "isConstant": false,
                              "isLValue": false,
                              "isPure": false,
                              "lValueRequested": false,
                              "member_name": "sender",
                              "referencedDeclaration": null,
                              "type": "address"
                            },
                            "children": [
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "overloadedDeclarations": [
                                    null
                                  ],
                                  "referencedDeclaration": 11807,
                                  "type": "msg",
                                  "value": "msg"
                                },
                                "id": 4119,
                                "name": "Identifier",
                                "src": "7260:3:12"
                              }
                            ],
                            "id": 4120,
                            "name": "MemberAccess",
                            "src": "7260:10:12"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4107,
                              "type": "address",
                              "value": "_to"
                            },
                            "id": 4121,
                            "name": "Identifier",
                            "src": "7272:3:12"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4109,
                              "type": "uint256",
                              "value": "_amount"
                            },
                            "id": 4122,
                            "name": "Identifier",
                            "src": "7277:7:12"
                          }
                        ],
                        "id": 4123,
                        "name": "FunctionCall",
                        "src": "7249:36:12"
                      }
                    ],
                    "id": 4124,
                    "name": "Return",
                    "src": "7242:43:12"
                  }
                ],
                "id": 4125,
                "name": "Block",
                "src": "7197:95:12"
              }
            ],
            "id": 4126,
            "name": "FunctionDefinition",
            "src": "7119:173:12"
          },
          {
            "attributes": {
              "constant": false,
              "implemented": true,
              "isConstructor": false,
              "modifiers": [
                null
              ],
              "name": "transferFrom",
              "payable": false,
              "scope": 4821,
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
                      "name": "_from",
                      "scope": 4174,
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
                        "id": 4127,
                        "name": "ElementaryTypeName",
                        "src": "7664:7:12"
                      }
                    ],
                    "id": 4128,
                    "name": "VariableDeclaration",
                    "src": "7664:13:12"
                  },
                  {
                    "attributes": {
                      "constant": false,
                      "name": "_to",
                      "scope": 4174,
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
                        "id": 4129,
                        "name": "ElementaryTypeName",
                        "src": "7679:7:12"
                      }
                    ],
                    "id": 4130,
                    "name": "VariableDeclaration",
                    "src": "7679:11:12"
                  },
                  {
                    "attributes": {
                      "constant": false,
                      "name": "_amount",
                      "scope": 4174,
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
                        "id": 4131,
                        "name": "ElementaryTypeName",
                        "src": "7692:7:12"
                      }
                    ],
                    "id": 4132,
                    "name": "VariableDeclaration",
                    "src": "7692:15:12"
                  }
                ],
                "id": 4133,
                "name": "ParameterList",
                "src": "7663:50:12"
              },
              {
                "children": [
                  {
                    "attributes": {
                      "constant": false,
                      "name": "success",
                      "scope": 4174,
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
                        "id": 4134,
                        "name": "ElementaryTypeName",
                        "src": "7730:4:12"
                      }
                    ],
                    "id": 4135,
                    "name": "VariableDeclaration",
                    "src": "7730:12:12"
                  }
                ],
                "id": 4136,
                "name": "ParameterList",
                "src": "7729:14:12"
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
                            "typeIdentifier": "t_address",
                            "typeString": "address"
                          },
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": false,
                          "lValueRequested": false,
                          "operator": "!=",
                          "type": "bool"
                        },
                        "children": [
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "isConstant": false,
                              "isLValue": false,
                              "isPure": false,
                              "lValueRequested": false,
                              "member_name": "sender",
                              "referencedDeclaration": null,
                              "type": "address"
                            },
                            "children": [
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "overloadedDeclarations": [
                                    null
                                  ],
                                  "referencedDeclaration": 11807,
                                  "type": "msg",
                                  "value": "msg"
                                },
                                "id": 4137,
                                "name": "Identifier",
                                "src": "8035:3:12"
                              }
                            ],
                            "id": 4138,
                            "name": "MemberAccess",
                            "src": "8035:10:12"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 3746,
                              "type": "address",
                              "value": "controller"
                            },
                            "id": 4139,
                            "name": "Identifier",
                            "src": "8049:10:12"
                          }
                        ],
                        "id": 4140,
                        "name": "BinaryOperation",
                        "src": "8035:24:12"
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
                                      "referencedDeclaration": 11810,
                                      "type": "function (bool) pure",
                                      "value": "require"
                                    },
                                    "id": 4141,
                                    "name": "Identifier",
                                    "src": "8075:7:12"
                                  },
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "overloadedDeclarations": [
                                        null
                                      ],
                                      "referencedDeclaration": 3839,
                                      "type": "bool",
                                      "value": "transfersEnabled"
                                    },
                                    "id": 4142,
                                    "name": "Identifier",
                                    "src": "8083:16:12"
                                  }
                                ],
                                "id": 4143,
                                "name": "FunctionCall",
                                "src": "8075:25:12"
                              }
                            ],
                            "id": 4144,
                            "name": "ExpressionStatement",
                            "src": "8075:25:12"
                          },
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
                                  "operator": "<",
                                  "type": "bool"
                                },
                                "children": [
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "isConstant": false,
                                      "isLValue": true,
                                      "isPure": false,
                                      "lValueRequested": false,
                                      "type": "uint256"
                                    },
                                    "children": [
                                      {
                                        "attributes": {
                                          "argumentTypes": null,
                                          "isConstant": false,
                                          "isLValue": true,
                                          "isPure": false,
                                          "lValueRequested": false,
                                          "type": "mapping(address => uint256)"
                                        },
                                        "children": [
                                          {
                                            "attributes": {
                                              "argumentTypes": null,
                                              "overloadedDeclarations": [
                                                null
                                              ],
                                              "referencedDeclaration": 3834,
                                              "type": "mapping(address => mapping(address => uint256))",
                                              "value": "allowed"
                                            },
                                            "id": 4145,
                                            "name": "Identifier",
                                            "src": "8181:7:12"
                                          },
                                          {
                                            "attributes": {
                                              "argumentTypes": null,
                                              "overloadedDeclarations": [
                                                null
                                              ],
                                              "referencedDeclaration": 4128,
                                              "type": "address",
                                              "value": "_from"
                                            },
                                            "id": 4146,
                                            "name": "Identifier",
                                            "src": "8189:5:12"
                                          }
                                        ],
                                        "id": 4147,
                                        "name": "IndexAccess",
                                        "src": "8181:14:12"
                                      },
                                      {
                                        "attributes": {
                                          "argumentTypes": null,
                                          "isConstant": false,
                                          "isLValue": false,
                                          "isPure": false,
                                          "lValueRequested": false,
                                          "member_name": "sender",
                                          "referencedDeclaration": null,
                                          "type": "address"
                                        },
                                        "children": [
                                          {
                                            "attributes": {
                                              "argumentTypes": null,
                                              "overloadedDeclarations": [
                                                null
                                              ],
                                              "referencedDeclaration": 11807,
                                              "type": "msg",
                                              "value": "msg"
                                            },
                                            "id": 4148,
                                            "name": "Identifier",
                                            "src": "8196:3:12"
                                          }
                                        ],
                                        "id": 4149,
                                        "name": "MemberAccess",
                                        "src": "8196:10:12"
                                      }
                                    ],
                                    "id": 4150,
                                    "name": "IndexAccess",
                                    "src": "8181:26:12"
                                  },
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "overloadedDeclarations": [
                                        null
                                      ],
                                      "referencedDeclaration": 4132,
                                      "type": "uint256",
                                      "value": "_amount"
                                    },
                                    "id": 4151,
                                    "name": "Identifier",
                                    "src": "8210:7:12"
                                  }
                                ],
                                "id": 4152,
                                "name": "BinaryOperation",
                                "src": "8181:36:12"
                              },
                              {
                                "attributes": {
                                  "functionReturnParameters": 4136
                                },
                                "children": [
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "hexvalue": "66616c7365",
                                      "isConstant": false,
                                      "isLValue": false,
                                      "isPure": true,
                                      "lValueRequested": false,
                                      "subdenomination": null,
                                      "token": "bool",
                                      "type": "bool",
                                      "value": "false"
                                    },
                                    "id": 4153,
                                    "name": "Literal",
                                    "src": "8226:5:12"
                                  }
                                ],
                                "id": 4154,
                                "name": "Return",
                                "src": "8219:12:12"
                              }
                            ],
                            "id": 4155,
                            "name": "IfStatement",
                            "src": "8177:54:12"
                          },
                          {
                            "children": [
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "isConstant": false,
                                  "isLValue": false,
                                  "isPure": false,
                                  "lValueRequested": false,
                                  "operator": "-=",
                                  "type": "uint256"
                                },
                                "children": [
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "isConstant": false,
                                      "isLValue": true,
                                      "isPure": false,
                                      "lValueRequested": true,
                                      "type": "uint256"
                                    },
                                    "children": [
                                      {
                                        "attributes": {
                                          "argumentTypes": null,
                                          "isConstant": false,
                                          "isLValue": true,
                                          "isPure": false,
                                          "lValueRequested": false,
                                          "type": "mapping(address => uint256)"
                                        },
                                        "children": [
                                          {
                                            "attributes": {
                                              "argumentTypes": null,
                                              "overloadedDeclarations": [
                                                null
                                              ],
                                              "referencedDeclaration": 3834,
                                              "type": "mapping(address => mapping(address => uint256))",
                                              "value": "allowed"
                                            },
                                            "id": 4156,
                                            "name": "Identifier",
                                            "src": "8245:7:12"
                                          },
                                          {
                                            "attributes": {
                                              "argumentTypes": null,
                                              "overloadedDeclarations": [
                                                null
                                              ],
                                              "referencedDeclaration": 4128,
                                              "type": "address",
                                              "value": "_from"
                                            },
                                            "id": 4157,
                                            "name": "Identifier",
                                            "src": "8253:5:12"
                                          }
                                        ],
                                        "id": 4160,
                                        "name": "IndexAccess",
                                        "src": "8245:14:12"
                                      },
                                      {
                                        "attributes": {
                                          "argumentTypes": null,
                                          "isConstant": false,
                                          "isLValue": false,
                                          "isPure": false,
                                          "lValueRequested": false,
                                          "member_name": "sender",
                                          "referencedDeclaration": null,
                                          "type": "address"
                                        },
                                        "children": [
                                          {
                                            "attributes": {
                                              "argumentTypes": null,
                                              "overloadedDeclarations": [
                                                null
                                              ],
                                              "referencedDeclaration": 11807,
                                              "type": "msg",
                                              "value": "msg"
                                            },
                                            "id": 4158,
                                            "name": "Identifier",
                                            "src": "8260:3:12"
                                          }
                                        ],
                                        "id": 4159,
                                        "name": "MemberAccess",
                                        "src": "8260:10:12"
                                      }
                                    ],
                                    "id": 4161,
                                    "name": "IndexAccess",
                                    "src": "8245:26:12"
                                  },
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "overloadedDeclarations": [
                                        null
                                      ],
                                      "referencedDeclaration": 4132,
                                      "type": "uint256",
                                      "value": "_amount"
                                    },
                                    "id": 4162,
                                    "name": "Identifier",
                                    "src": "8275:7:12"
                                  }
                                ],
                                "id": 4163,
                                "name": "Assignment",
                                "src": "8245:37:12"
                              }
                            ],
                            "id": 4164,
                            "name": "ExpressionStatement",
                            "src": "8245:37:12"
                          }
                        ],
                        "id": 4165,
                        "name": "Block",
                        "src": "8061:232:12"
                      }
                    ],
                    "id": 4166,
                    "name": "IfStatement",
                    "src": "8031:262:12"
                  },
                  {
                    "attributes": {
                      "functionReturnParameters": 4136
                    },
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
                          "type": "bool",
                          "type_conversion": false
                        },
                        "children": [
                          {
                            "attributes": {
                              "argumentTypes": [
                                {
                                  "typeIdentifier": "t_address",
                                  "typeString": "address"
                                },
                                {
                                  "typeIdentifier": "t_address",
                                  "typeString": "address"
                                },
                                {
                                  "typeIdentifier": "t_uint256",
                                  "typeString": "uint256"
                                }
                              ],
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4262,
                              "type": "function (address,address,uint256) returns (bool)",
                              "value": "doTransfer"
                            },
                            "id": 4167,
                            "name": "Identifier",
                            "src": "8309:10:12"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4128,
                              "type": "address",
                              "value": "_from"
                            },
                            "id": 4168,
                            "name": "Identifier",
                            "src": "8320:5:12"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4130,
                              "type": "address",
                              "value": "_to"
                            },
                            "id": 4169,
                            "name": "Identifier",
                            "src": "8327:3:12"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4132,
                              "type": "uint256",
                              "value": "_amount"
                            },
                            "id": 4170,
                            "name": "Identifier",
                            "src": "8332:7:12"
                          }
                        ],
                        "id": 4171,
                        "name": "FunctionCall",
                        "src": "8309:31:12"
                      }
                    ],
                    "id": 4172,
                    "name": "Return",
                    "src": "8302:38:12"
                  }
                ],
                "id": 4173,
                "name": "Block",
                "src": "7744:603:12"
              }
            ],
            "id": 4174,
            "name": "FunctionDefinition",
            "src": "7642:705:12"
          },
          {
            "attributes": {
              "constant": false,
              "implemented": true,
              "isConstructor": false,
              "modifiers": [
                null
              ],
              "name": "doTransfer",
              "payable": false,
              "scope": 4821,
              "stateMutability": "nonpayable",
              "superFunction": null,
              "visibility": "internal"
            },
            "children": [
              {
                "children": [
                  {
                    "attributes": {
                      "constant": false,
                      "name": "_from",
                      "scope": 4262,
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
                        "id": 4175,
                        "name": "ElementaryTypeName",
                        "src": "8746:7:12"
                      }
                    ],
                    "id": 4176,
                    "name": "VariableDeclaration",
                    "src": "8746:13:12"
                  },
                  {
                    "attributes": {
                      "constant": false,
                      "name": "_to",
                      "scope": 4262,
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
                        "id": 4177,
                        "name": "ElementaryTypeName",
                        "src": "8761:7:12"
                      }
                    ],
                    "id": 4178,
                    "name": "VariableDeclaration",
                    "src": "8761:11:12"
                  },
                  {
                    "attributes": {
                      "constant": false,
                      "name": "_amount",
                      "scope": 4262,
                      "stateVariable": false,
                      "storageLocation": "default",
                      "type": "uint256",
                      "value": null,
                      "visibility": "internal"
                    },
                    "children": [
                      {
                        "attributes": {
                          "name": "uint",
                          "type": "uint256"
                        },
                        "id": 4179,
                        "name": "ElementaryTypeName",
                        "src": "8774:4:12"
                      }
                    ],
                    "id": 4180,
                    "name": "VariableDeclaration",
                    "src": "8774:12:12"
                  }
                ],
                "id": 4181,
                "name": "ParameterList",
                "src": "8745:47:12"
              },
              {
                "children": [
                  {
                    "attributes": {
                      "constant": false,
                      "name": "",
                      "scope": 4262,
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
                        "id": 4182,
                        "name": "ElementaryTypeName",
                        "src": "8810:4:12"
                      }
                    ],
                    "id": 4183,
                    "name": "VariableDeclaration",
                    "src": "8810:4:12"
                  }
                ],
                "id": 4184,
                "name": "ParameterList",
                "src": "8809:6:12"
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
                              "referencedDeclaration": 4180,
                              "type": "uint256",
                              "value": "_amount"
                            },
                            "id": 4185,
                            "name": "Identifier",
                            "src": "8834:7:12"
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
                            "id": 4186,
                            "name": "Literal",
                            "src": "8845:1:12"
                          }
                        ],
                        "id": 4187,
                        "name": "BinaryOperation",
                        "src": "8834:12:12"
                      },
                      {
                        "children": [
                          {
                            "attributes": {
                              "functionReturnParameters": 4184
                            },
                            "children": [
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "hexvalue": "74727565",
                                  "isConstant": false,
                                  "isLValue": false,
                                  "isPure": true,
                                  "lValueRequested": false,
                                  "subdenomination": null,
                                  "token": "bool",
                                  "type": "bool",
                                  "value": "true"
                                },
                                "id": 4188,
                                "name": "Literal",
                                "src": "8872:4:12"
                              }
                            ],
                            "id": 4189,
                            "name": "Return",
                            "src": "8865:11:12"
                          }
                        ],
                        "id": 4190,
                        "name": "Block",
                        "src": "8848:42:12"
                      }
                    ],
                    "id": 4191,
                    "name": "IfStatement",
                    "src": "8830:60:12"
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
                              "referencedDeclaration": 11810,
                              "type": "function (bool) pure",
                              "value": "require"
                            },
                            "id": 4192,
                            "name": "Identifier",
                            "src": "8975:7:12"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "commonType": {
                                "typeIdentifier": "t_bool",
                                "typeString": "bool"
                              },
                              "isConstant": false,
                              "isLValue": false,
                              "isPure": false,
                              "lValueRequested": false,
                              "operator": "&&",
                              "type": "bool"
                            },
                            "children": [
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "isConstant": false,
                                  "isInlineArray": false,
                                  "isLValue": false,
                                  "isPure": false,
                                  "lValueRequested": false,
                                  "type": "bool"
                                },
                                "children": [
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "commonType": {
                                        "typeIdentifier": "t_address",
                                        "typeString": "address"
                                      },
                                      "isConstant": false,
                                      "isLValue": false,
                                      "isPure": false,
                                      "lValueRequested": false,
                                      "operator": "!=",
                                      "type": "bool"
                                    },
                                    "children": [
                                      {
                                        "attributes": {
                                          "argumentTypes": null,
                                          "overloadedDeclarations": [
                                            null
                                          ],
                                          "referencedDeclaration": 4178,
                                          "type": "address",
                                          "value": "_to"
                                        },
                                        "id": 4193,
                                        "name": "Identifier",
                                        "src": "8984:3:12"
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
                                        "id": 4194,
                                        "name": "Literal",
                                        "src": "8991:1:12"
                                      }
                                    ],
                                    "id": 4195,
                                    "name": "BinaryOperation",
                                    "src": "8984:8:12"
                                  }
                                ],
                                "id": 4196,
                                "name": "TupleExpression",
                                "src": "8983:10:12"
                              },
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "isConstant": false,
                                  "isInlineArray": false,
                                  "isLValue": false,
                                  "isPure": false,
                                  "lValueRequested": false,
                                  "type": "bool"
                                },
                                "children": [
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "commonType": {
                                        "typeIdentifier": "t_address",
                                        "typeString": "address"
                                      },
                                      "isConstant": false,
                                      "isLValue": false,
                                      "isPure": false,
                                      "lValueRequested": false,
                                      "operator": "!=",
                                      "type": "bool"
                                    },
                                    "children": [
                                      {
                                        "attributes": {
                                          "argumentTypes": null,
                                          "overloadedDeclarations": [
                                            null
                                          ],
                                          "referencedDeclaration": 4178,
                                          "type": "address",
                                          "value": "_to"
                                        },
                                        "id": 4197,
                                        "name": "Identifier",
                                        "src": "8998:3:12"
                                      },
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
                                          "type": "address",
                                          "type_conversion": true
                                        },
                                        "children": [
                                          {
                                            "attributes": {
                                              "argumentTypes": [
                                                {
                                                  "typeIdentifier": "t_contract$_CrowdfundingToken_$4821",
                                                  "typeString": "contract CrowdfundingToken"
                                                }
                                              ],
                                              "isConstant": false,
                                              "isLValue": false,
                                              "isPure": true,
                                              "lValueRequested": false,
                                              "type": "type(address)",
                                              "value": "address"
                                            },
                                            "id": 4198,
                                            "name": "ElementaryTypeNameExpression",
                                            "src": "9005:7:12"
                                          },
                                          {
                                            "attributes": {
                                              "argumentTypes": null,
                                              "overloadedDeclarations": [
                                                null
                                              ],
                                              "referencedDeclaration": 11876,
                                              "type": "contract CrowdfundingToken",
                                              "value": "this"
                                            },
                                            "id": 4199,
                                            "name": "Identifier",
                                            "src": "9013:4:12"
                                          }
                                        ],
                                        "id": 4200,
                                        "name": "FunctionCall",
                                        "src": "9005:13:12"
                                      }
                                    ],
                                    "id": 4201,
                                    "name": "BinaryOperation",
                                    "src": "8998:20:12"
                                  }
                                ],
                                "id": 4202,
                                "name": "TupleExpression",
                                "src": "8997:22:12"
                              }
                            ],
                            "id": 4203,
                            "name": "BinaryOperation",
                            "src": "8983:36:12"
                          }
                        ],
                        "id": 4204,
                        "name": "FunctionCall",
                        "src": "8975:45:12"
                      }
                    ],
                    "id": 4205,
                    "name": "ExpressionStatement",
                    "src": "8975:45:12"
                  },
                  {
                    "attributes": {
                      "assignments": [
                        4206
                      ]
                    },
                    "children": [
                      {
                        "attributes": {
                          "constant": false,
                          "name": "previousBalanceFrom",
                          "scope": 4262,
                          "stateVariable": false,
                          "storageLocation": "default",
                          "type": "uint256",
                          "typeName": null,
                          "value": null,
                          "visibility": "internal"
                        },
                        "children": [],
                        "id": 4206,
                        "name": "VariableDeclaration",
                        "src": "9161:23:12"
                      },
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
                          "type": "uint256",
                          "type_conversion": false
                        },
                        "children": [
                          {
                            "attributes": {
                              "argumentTypes": [
                                {
                                  "typeIdentifier": "t_address",
                                  "typeString": "address"
                                },
                                {
                                  "typeIdentifier": "t_uint256",
                                  "typeString": "uint256"
                                }
                              ],
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4423,
                              "type": "function (address,uint256) view returns (uint256)",
                              "value": "balanceOfAt"
                            },
                            "id": 4207,
                            "name": "Identifier",
                            "src": "9187:11:12"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4176,
                              "type": "address",
                              "value": "_from"
                            },
                            "id": 4208,
                            "name": "Identifier",
                            "src": "9199:5:12"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "isConstant": false,
                              "isLValue": false,
                              "isPure": false,
                              "lValueRequested": false,
                              "member_name": "number",
                              "referencedDeclaration": null,
                              "type": "uint256"
                            },
                            "children": [
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "overloadedDeclarations": [
                                    null
                                  ],
                                  "referencedDeclaration": 11799,
                                  "type": "block",
                                  "value": "block"
                                },
                                "id": 4209,
                                "name": "Identifier",
                                "src": "9206:5:12"
                              }
                            ],
                            "id": 4210,
                            "name": "MemberAccess",
                            "src": "9206:12:12"
                          }
                        ],
                        "id": 4211,
                        "name": "FunctionCall",
                        "src": "9187:32:12"
                      }
                    ],
                    "id": 4212,
                    "name": "VariableDeclarationStatement",
                    "src": "9161:58:12"
                  },
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
                          "operator": "<",
                          "type": "bool"
                        },
                        "children": [
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4206,
                              "type": "uint256",
                              "value": "previousBalanceFrom"
                            },
                            "id": 4213,
                            "name": "Identifier",
                            "src": "9236:19:12"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4180,
                              "type": "uint256",
                              "value": "_amount"
                            },
                            "id": 4214,
                            "name": "Identifier",
                            "src": "9258:7:12"
                          }
                        ],
                        "id": 4215,
                        "name": "BinaryOperation",
                        "src": "9236:29:12"
                      },
                      {
                        "children": [
                          {
                            "attributes": {
                              "functionReturnParameters": 4184
                            },
                            "children": [
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "hexvalue": "66616c7365",
                                  "isConstant": false,
                                  "isLValue": false,
                                  "isPure": true,
                                  "lValueRequested": false,
                                  "subdenomination": null,
                                  "token": "bool",
                                  "type": "bool",
                                  "value": "false"
                                },
                                "id": 4216,
                                "name": "Literal",
                                "src": "9291:5:12"
                              }
                            ],
                            "id": 4217,
                            "name": "Return",
                            "src": "9284:12:12"
                          }
                        ],
                        "id": 4218,
                        "name": "Block",
                        "src": "9267:43:12"
                      }
                    ],
                    "id": 4219,
                    "name": "IfStatement",
                    "src": "9232:78:12"
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
                                  "typeIdentifier": "t_array$_t_struct$_Checkpoint_$3800_storage_$dyn_storage",
                                  "typeString": "struct CrowdfundingToken.Checkpoint storage ref[] storage ref"
                                },
                                {
                                  "typeIdentifier": "t_uint256",
                                  "typeString": "uint256"
                                }
                              ],
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4696,
                              "type": "function (struct CrowdfundingToken.Checkpoint storage ref[] storage pointer,uint256)",
                              "value": "updateValueAtNow"
                            },
                            "id": 4220,
                            "name": "Identifier",
                            "src": "9437:16:12"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "isConstant": false,
                              "isLValue": true,
                              "isPure": false,
                              "lValueRequested": false,
                              "type": "struct CrowdfundingToken.Checkpoint storage ref[] storage ref"
                            },
                            "children": [
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "overloadedDeclarations": [
                                    null
                                  ],
                                  "referencedDeclaration": 3828,
                                  "type": "mapping(address => struct CrowdfundingToken.Checkpoint storage ref[] storage ref)",
                                  "value": "balances"
                                },
                                "id": 4221,
                                "name": "Identifier",
                                "src": "9454:8:12"
                              },
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "overloadedDeclarations": [
                                    null
                                  ],
                                  "referencedDeclaration": 4176,
                                  "type": "address",
                                  "value": "_from"
                                },
                                "id": 4222,
                                "name": "Identifier",
                                "src": "9463:5:12"
                              }
                            ],
                            "id": 4223,
                            "name": "IndexAccess",
                            "src": "9454:15:12"
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
                                  "referencedDeclaration": 4206,
                                  "type": "uint256",
                                  "value": "previousBalanceFrom"
                                },
                                "id": 4224,
                                "name": "Identifier",
                                "src": "9471:19:12"
                              },
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "overloadedDeclarations": [
                                    null
                                  ],
                                  "referencedDeclaration": 4180,
                                  "type": "uint256",
                                  "value": "_amount"
                                },
                                "id": 4225,
                                "name": "Identifier",
                                "src": "9493:7:12"
                              }
                            ],
                            "id": 4226,
                            "name": "BinaryOperation",
                            "src": "9471:29:12"
                          }
                        ],
                        "id": 4227,
                        "name": "FunctionCall",
                        "src": "9437:64:12"
                      }
                    ],
                    "id": 4228,
                    "name": "ExpressionStatement",
                    "src": "9437:64:12"
                  },
                  {
                    "attributes": {
                      "assignments": [
                        4229
                      ]
                    },
                    "children": [
                      {
                        "attributes": {
                          "constant": false,
                          "name": "previousBalanceTo",
                          "scope": 4262,
                          "stateVariable": false,
                          "storageLocation": "default",
                          "type": "uint256",
                          "typeName": null,
                          "value": null,
                          "visibility": "internal"
                        },
                        "children": [],
                        "id": 4229,
                        "name": "VariableDeclaration",
                        "src": "9630:21:12"
                      },
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
                          "type": "uint256",
                          "type_conversion": false
                        },
                        "children": [
                          {
                            "attributes": {
                              "argumentTypes": [
                                {
                                  "typeIdentifier": "t_address",
                                  "typeString": "address"
                                },
                                {
                                  "typeIdentifier": "t_uint256",
                                  "typeString": "uint256"
                                }
                              ],
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4423,
                              "type": "function (address,uint256) view returns (uint256)",
                              "value": "balanceOfAt"
                            },
                            "id": 4230,
                            "name": "Identifier",
                            "src": "9654:11:12"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4178,
                              "type": "address",
                              "value": "_to"
                            },
                            "id": 4231,
                            "name": "Identifier",
                            "src": "9666:3:12"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "isConstant": false,
                              "isLValue": false,
                              "isPure": false,
                              "lValueRequested": false,
                              "member_name": "number",
                              "referencedDeclaration": null,
                              "type": "uint256"
                            },
                            "children": [
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "overloadedDeclarations": [
                                    null
                                  ],
                                  "referencedDeclaration": 11799,
                                  "type": "block",
                                  "value": "block"
                                },
                                "id": 4232,
                                "name": "Identifier",
                                "src": "9671:5:12"
                              }
                            ],
                            "id": 4233,
                            "name": "MemberAccess",
                            "src": "9671:12:12"
                          }
                        ],
                        "id": 4234,
                        "name": "FunctionCall",
                        "src": "9654:30:12"
                      }
                    ],
                    "id": 4235,
                    "name": "VariableDeclarationStatement",
                    "src": "9630:54:12"
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
                              "referencedDeclaration": 11810,
                              "type": "function (bool) pure",
                              "value": "require"
                            },
                            "id": 4236,
                            "name": "Identifier",
                            "src": "9697:7:12"
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
                                      "referencedDeclaration": 4229,
                                      "type": "uint256",
                                      "value": "previousBalanceTo"
                                    },
                                    "id": 4237,
                                    "name": "Identifier",
                                    "src": "9705:17:12"
                                  },
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "overloadedDeclarations": [
                                        null
                                      ],
                                      "referencedDeclaration": 4180,
                                      "type": "uint256",
                                      "value": "_amount"
                                    },
                                    "id": 4238,
                                    "name": "Identifier",
                                    "src": "9725:7:12"
                                  }
                                ],
                                "id": 4239,
                                "name": "BinaryOperation",
                                "src": "9705:27:12"
                              },
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "overloadedDeclarations": [
                                    null
                                  ],
                                  "referencedDeclaration": 4229,
                                  "type": "uint256",
                                  "value": "previousBalanceTo"
                                },
                                "id": 4240,
                                "name": "Identifier",
                                "src": "9736:17:12"
                              }
                            ],
                            "id": 4241,
                            "name": "BinaryOperation",
                            "src": "9705:48:12"
                          }
                        ],
                        "id": 4242,
                        "name": "FunctionCall",
                        "src": "9697:57:12"
                      }
                    ],
                    "id": 4243,
                    "name": "ExpressionStatement",
                    "src": "9697:57:12"
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
                                  "typeIdentifier": "t_array$_t_struct$_Checkpoint_$3800_storage_$dyn_storage",
                                  "typeString": "struct CrowdfundingToken.Checkpoint storage ref[] storage ref"
                                },
                                {
                                  "typeIdentifier": "t_uint256",
                                  "typeString": "uint256"
                                }
                              ],
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4696,
                              "type": "function (struct CrowdfundingToken.Checkpoint storage ref[] storage pointer,uint256)",
                              "value": "updateValueAtNow"
                            },
                            "id": 4244,
                            "name": "Identifier",
                            "src": "9789:16:12"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "isConstant": false,
                              "isLValue": true,
                              "isPure": false,
                              "lValueRequested": false,
                              "type": "struct CrowdfundingToken.Checkpoint storage ref[] storage ref"
                            },
                            "children": [
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "overloadedDeclarations": [
                                    null
                                  ],
                                  "referencedDeclaration": 3828,
                                  "type": "mapping(address => struct CrowdfundingToken.Checkpoint storage ref[] storage ref)",
                                  "value": "balances"
                                },
                                "id": 4245,
                                "name": "Identifier",
                                "src": "9806:8:12"
                              },
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "overloadedDeclarations": [
                                    null
                                  ],
                                  "referencedDeclaration": 4178,
                                  "type": "address",
                                  "value": "_to"
                                },
                                "id": 4246,
                                "name": "Identifier",
                                "src": "9815:3:12"
                              }
                            ],
                            "id": 4247,
                            "name": "IndexAccess",
                            "src": "9806:13:12"
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
                                  "referencedDeclaration": 4229,
                                  "type": "uint256",
                                  "value": "previousBalanceTo"
                                },
                                "id": 4248,
                                "name": "Identifier",
                                "src": "9821:17:12"
                              },
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "overloadedDeclarations": [
                                    null
                                  ],
                                  "referencedDeclaration": 4180,
                                  "type": "uint256",
                                  "value": "_amount"
                                },
                                "id": 4249,
                                "name": "Identifier",
                                "src": "9841:7:12"
                              }
                            ],
                            "id": 4250,
                            "name": "BinaryOperation",
                            "src": "9821:27:12"
                          }
                        ],
                        "id": 4251,
                        "name": "FunctionCall",
                        "src": "9789:60:12"
                      }
                    ],
                    "id": 4252,
                    "name": "ExpressionStatement",
                    "src": "9789:60:12"
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
                                  "typeIdentifier": "t_address",
                                  "typeString": "address"
                                },
                                {
                                  "typeIdentifier": "t_address",
                                  "typeString": "address"
                                },
                                {
                                  "typeIdentifier": "t_uint256",
                                  "typeString": "uint256"
                                }
                              ],
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4812,
                              "type": "function (address,address,uint256)",
                              "value": "Transfer"
                            },
                            "id": 4253,
                            "name": "Identifier",
                            "src": "9938:8:12"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4176,
                              "type": "address",
                              "value": "_from"
                            },
                            "id": 4254,
                            "name": "Identifier",
                            "src": "9947:5:12"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4178,
                              "type": "address",
                              "value": "_to"
                            },
                            "id": 4255,
                            "name": "Identifier",
                            "src": "9954:3:12"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4180,
                              "type": "uint256",
                              "value": "_amount"
                            },
                            "id": 4256,
                            "name": "Identifier",
                            "src": "9959:7:12"
                          }
                        ],
                        "id": 4257,
                        "name": "FunctionCall",
                        "src": "9938:29:12"
                      }
                    ],
                    "id": 4258,
                    "name": "ExpressionStatement",
                    "src": "9938:29:12"
                  },
                  {
                    "attributes": {
                      "functionReturnParameters": 4184
                    },
                    "children": [
                      {
                        "attributes": {
                          "argumentTypes": null,
                          "hexvalue": "74727565",
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": true,
                          "lValueRequested": false,
                          "subdenomination": null,
                          "token": "bool",
                          "type": "bool",
                          "value": "true"
                        },
                        "id": 4259,
                        "name": "Literal",
                        "src": "9988:4:12"
                      }
                    ],
                    "id": 4260,
                    "name": "Return",
                    "src": "9981:11:12"
                  }
                ],
                "id": 4261,
                "name": "Block",
                "src": "8816:1183:12"
              }
            ],
            "id": 4262,
            "name": "FunctionDefinition",
            "src": "8726:1273:12"
          },
          {
            "attributes": {
              "constant": true,
              "implemented": true,
              "isConstructor": false,
              "modifiers": [
                null
              ],
              "name": "balanceOf",
              "payable": false,
              "scope": 4821,
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
                      "name": "_owner",
                      "scope": 4276,
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
                        "id": 4263,
                        "name": "ElementaryTypeName",
                        "src": "10153:7:12"
                      }
                    ],
                    "id": 4264,
                    "name": "VariableDeclaration",
                    "src": "10153:14:12"
                  }
                ],
                "id": 4265,
                "name": "ParameterList",
                "src": "10152:16:12"
              },
              {
                "children": [
                  {
                    "attributes": {
                      "constant": false,
                      "name": "balance",
                      "scope": 4276,
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
                        "id": 4266,
                        "name": "ElementaryTypeName",
                        "src": "10194:7:12"
                      }
                    ],
                    "id": 4267,
                    "name": "VariableDeclaration",
                    "src": "10194:15:12"
                  }
                ],
                "id": 4268,
                "name": "ParameterList",
                "src": "10193:17:12"
              },
              {
                "children": [
                  {
                    "attributes": {
                      "functionReturnParameters": 4268
                    },
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
                          "type": "uint256",
                          "type_conversion": false
                        },
                        "children": [
                          {
                            "attributes": {
                              "argumentTypes": [
                                {
                                  "typeIdentifier": "t_address",
                                  "typeString": "address"
                                },
                                {
                                  "typeIdentifier": "t_uint256",
                                  "typeString": "uint256"
                                }
                              ],
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4423,
                              "type": "function (address,uint256) view returns (uint256)",
                              "value": "balanceOfAt"
                            },
                            "id": 4269,
                            "name": "Identifier",
                            "src": "10228:11:12"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4264,
                              "type": "address",
                              "value": "_owner"
                            },
                            "id": 4270,
                            "name": "Identifier",
                            "src": "10240:6:12"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "isConstant": false,
                              "isLValue": false,
                              "isPure": false,
                              "lValueRequested": false,
                              "member_name": "number",
                              "referencedDeclaration": null,
                              "type": "uint256"
                            },
                            "children": [
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "overloadedDeclarations": [
                                    null
                                  ],
                                  "referencedDeclaration": 11799,
                                  "type": "block",
                                  "value": "block"
                                },
                                "id": 4271,
                                "name": "Identifier",
                                "src": "10248:5:12"
                              }
                            ],
                            "id": 4272,
                            "name": "MemberAccess",
                            "src": "10248:12:12"
                          }
                        ],
                        "id": 4273,
                        "name": "FunctionCall",
                        "src": "10228:33:12"
                      }
                    ],
                    "id": 4274,
                    "name": "Return",
                    "src": "10221:40:12"
                  }
                ],
                "id": 4275,
                "name": "Block",
                "src": "10211:57:12"
              }
            ],
            "id": 4276,
            "name": "FunctionDefinition",
            "src": "10134:134:12"
          },
          {
            "attributes": {
              "constant": false,
              "implemented": true,
              "isConstructor": false,
              "modifiers": [
                null
              ],
              "name": "approve",
              "payable": false,
              "scope": 4821,
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
                      "name": "_spender",
                      "scope": 4325,
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
                        "id": 4277,
                        "name": "ElementaryTypeName",
                        "src": "10684:7:12"
                      }
                    ],
                    "id": 4278,
                    "name": "VariableDeclaration",
                    "src": "10684:16:12"
                  },
                  {
                    "attributes": {
                      "constant": false,
                      "name": "_amount",
                      "scope": 4325,
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
                        "id": 4279,
                        "name": "ElementaryTypeName",
                        "src": "10702:7:12"
                      }
                    ],
                    "id": 4280,
                    "name": "VariableDeclaration",
                    "src": "10702:15:12"
                  }
                ],
                "id": 4281,
                "name": "ParameterList",
                "src": "10683:35:12"
              },
              {
                "children": [
                  {
                    "attributes": {
                      "constant": false,
                      "name": "success",
                      "scope": 4325,
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
                        "id": 4282,
                        "name": "ElementaryTypeName",
                        "src": "10735:4:12"
                      }
                    ],
                    "id": 4283,
                    "name": "VariableDeclaration",
                    "src": "10735:12:12"
                  }
                ],
                "id": 4284,
                "name": "ParameterList",
                "src": "10734:14:12"
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
                              "referencedDeclaration": 11810,
                              "type": "function (bool) pure",
                              "value": "require"
                            },
                            "id": 4285,
                            "name": "Identifier",
                            "src": "10759:7:12"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 3839,
                              "type": "bool",
                              "value": "transfersEnabled"
                            },
                            "id": 4286,
                            "name": "Identifier",
                            "src": "10767:16:12"
                          }
                        ],
                        "id": 4287,
                        "name": "FunctionCall",
                        "src": "10759:25:12"
                      }
                    ],
                    "id": 4288,
                    "name": "ExpressionStatement",
                    "src": "10759:25:12"
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
                              "referencedDeclaration": 11810,
                              "type": "function (bool) pure",
                              "value": "require"
                            },
                            "id": 4289,
                            "name": "Identifier",
                            "src": "11098:7:12"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "commonType": {
                                "typeIdentifier": "t_bool",
                                "typeString": "bool"
                              },
                              "isConstant": false,
                              "isLValue": false,
                              "isPure": false,
                              "lValueRequested": false,
                              "operator": "||",
                              "type": "bool"
                            },
                            "children": [
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "isConstant": false,
                                  "isInlineArray": false,
                                  "isLValue": false,
                                  "isPure": false,
                                  "lValueRequested": false,
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
                                          "referencedDeclaration": 4280,
                                          "type": "uint256",
                                          "value": "_amount"
                                        },
                                        "id": 4290,
                                        "name": "Identifier",
                                        "src": "11107:7:12"
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
                                        "id": 4291,
                                        "name": "Literal",
                                        "src": "11118:1:12"
                                      }
                                    ],
                                    "id": 4292,
                                    "name": "BinaryOperation",
                                    "src": "11107:12:12"
                                  }
                                ],
                                "id": 4293,
                                "name": "TupleExpression",
                                "src": "11106:14:12"
                              },
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "isConstant": false,
                                  "isInlineArray": false,
                                  "isLValue": false,
                                  "isPure": false,
                                  "lValueRequested": false,
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
                                      "operator": "==",
                                      "type": "bool"
                                    },
                                    "children": [
                                      {
                                        "attributes": {
                                          "argumentTypes": null,
                                          "isConstant": false,
                                          "isLValue": true,
                                          "isPure": false,
                                          "lValueRequested": false,
                                          "type": "uint256"
                                        },
                                        "children": [
                                          {
                                            "attributes": {
                                              "argumentTypes": null,
                                              "isConstant": false,
                                              "isLValue": true,
                                              "isPure": false,
                                              "lValueRequested": false,
                                              "type": "mapping(address => uint256)"
                                            },
                                            "children": [
                                              {
                                                "attributes": {
                                                  "argumentTypes": null,
                                                  "overloadedDeclarations": [
                                                    null
                                                  ],
                                                  "referencedDeclaration": 3834,
                                                  "type": "mapping(address => mapping(address => uint256))",
                                                  "value": "allowed"
                                                },
                                                "id": 4294,
                                                "name": "Identifier",
                                                "src": "11125:7:12"
                                              },
                                              {
                                                "attributes": {
                                                  "argumentTypes": null,
                                                  "isConstant": false,
                                                  "isLValue": false,
                                                  "isPure": false,
                                                  "lValueRequested": false,
                                                  "member_name": "sender",
                                                  "referencedDeclaration": null,
                                                  "type": "address"
                                                },
                                                "children": [
                                                  {
                                                    "attributes": {
                                                      "argumentTypes": null,
                                                      "overloadedDeclarations": [
                                                        null
                                                      ],
                                                      "referencedDeclaration": 11807,
                                                      "type": "msg",
                                                      "value": "msg"
                                                    },
                                                    "id": 4295,
                                                    "name": "Identifier",
                                                    "src": "11133:3:12"
                                                  }
                                                ],
                                                "id": 4296,
                                                "name": "MemberAccess",
                                                "src": "11133:10:12"
                                              }
                                            ],
                                            "id": 4297,
                                            "name": "IndexAccess",
                                            "src": "11125:19:12"
                                          },
                                          {
                                            "attributes": {
                                              "argumentTypes": null,
                                              "overloadedDeclarations": [
                                                null
                                              ],
                                              "referencedDeclaration": 4278,
                                              "type": "address",
                                              "value": "_spender"
                                            },
                                            "id": 4298,
                                            "name": "Identifier",
                                            "src": "11145:8:12"
                                          }
                                        ],
                                        "id": 4299,
                                        "name": "IndexAccess",
                                        "src": "11125:29:12"
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
                                        "id": 4300,
                                        "name": "Literal",
                                        "src": "11158:1:12"
                                      }
                                    ],
                                    "id": 4301,
                                    "name": "BinaryOperation",
                                    "src": "11125:34:12"
                                  }
                                ],
                                "id": 4302,
                                "name": "TupleExpression",
                                "src": "11124:36:12"
                              }
                            ],
                            "id": 4303,
                            "name": "BinaryOperation",
                            "src": "11106:54:12"
                          }
                        ],
                        "id": 4304,
                        "name": "FunctionCall",
                        "src": "11098:63:12"
                      }
                    ],
                    "id": 4305,
                    "name": "ExpressionStatement",
                    "src": "11098:63:12"
                  },
                  {
                    "children": [
                      {
                        "attributes": {
                          "argumentTypes": null,
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": false,
                          "lValueRequested": false,
                          "operator": "=",
                          "type": "uint256"
                        },
                        "children": [
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "isConstant": false,
                              "isLValue": true,
                              "isPure": false,
                              "lValueRequested": true,
                              "type": "uint256"
                            },
                            "children": [
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "isConstant": false,
                                  "isLValue": true,
                                  "isPure": false,
                                  "lValueRequested": false,
                                  "type": "mapping(address => uint256)"
                                },
                                "children": [
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "overloadedDeclarations": [
                                        null
                                      ],
                                      "referencedDeclaration": 3834,
                                      "type": "mapping(address => mapping(address => uint256))",
                                      "value": "allowed"
                                    },
                                    "id": 4306,
                                    "name": "Identifier",
                                    "src": "11172:7:12"
                                  },
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "isConstant": false,
                                      "isLValue": false,
                                      "isPure": false,
                                      "lValueRequested": false,
                                      "member_name": "sender",
                                      "referencedDeclaration": null,
                                      "type": "address"
                                    },
                                    "children": [
                                      {
                                        "attributes": {
                                          "argumentTypes": null,
                                          "overloadedDeclarations": [
                                            null
                                          ],
                                          "referencedDeclaration": 11807,
                                          "type": "msg",
                                          "value": "msg"
                                        },
                                        "id": 4307,
                                        "name": "Identifier",
                                        "src": "11180:3:12"
                                      }
                                    ],
                                    "id": 4308,
                                    "name": "MemberAccess",
                                    "src": "11180:10:12"
                                  }
                                ],
                                "id": 4310,
                                "name": "IndexAccess",
                                "src": "11172:19:12"
                              },
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "overloadedDeclarations": [
                                    null
                                  ],
                                  "referencedDeclaration": 4278,
                                  "type": "address",
                                  "value": "_spender"
                                },
                                "id": 4309,
                                "name": "Identifier",
                                "src": "11192:8:12"
                              }
                            ],
                            "id": 4311,
                            "name": "IndexAccess",
                            "src": "11172:29:12"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4280,
                              "type": "uint256",
                              "value": "_amount"
                            },
                            "id": 4312,
                            "name": "Identifier",
                            "src": "11204:7:12"
                          }
                        ],
                        "id": 4313,
                        "name": "Assignment",
                        "src": "11172:39:12"
                      }
                    ],
                    "id": 4314,
                    "name": "ExpressionStatement",
                    "src": "11172:39:12"
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
                                  "typeIdentifier": "t_address",
                                  "typeString": "address"
                                },
                                {
                                  "typeIdentifier": "t_address",
                                  "typeString": "address"
                                },
                                {
                                  "typeIdentifier": "t_uint256",
                                  "typeString": "uint256"
                                }
                              ],
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4820,
                              "type": "function (address,address,uint256)",
                              "value": "Approval"
                            },
                            "id": 4315,
                            "name": "Identifier",
                            "src": "11221:8:12"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "isConstant": false,
                              "isLValue": false,
                              "isPure": false,
                              "lValueRequested": false,
                              "member_name": "sender",
                              "referencedDeclaration": null,
                              "type": "address"
                            },
                            "children": [
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "overloadedDeclarations": [
                                    null
                                  ],
                                  "referencedDeclaration": 11807,
                                  "type": "msg",
                                  "value": "msg"
                                },
                                "id": 4316,
                                "name": "Identifier",
                                "src": "11230:3:12"
                              }
                            ],
                            "id": 4317,
                            "name": "MemberAccess",
                            "src": "11230:10:12"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4278,
                              "type": "address",
                              "value": "_spender"
                            },
                            "id": 4318,
                            "name": "Identifier",
                            "src": "11242:8:12"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4280,
                              "type": "uint256",
                              "value": "_amount"
                            },
                            "id": 4319,
                            "name": "Identifier",
                            "src": "11252:7:12"
                          }
                        ],
                        "id": 4320,
                        "name": "FunctionCall",
                        "src": "11221:39:12"
                      }
                    ],
                    "id": 4321,
                    "name": "ExpressionStatement",
                    "src": "11221:39:12"
                  },
                  {
                    "attributes": {
                      "functionReturnParameters": 4284
                    },
                    "children": [
                      {
                        "attributes": {
                          "argumentTypes": null,
                          "hexvalue": "74727565",
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": true,
                          "lValueRequested": false,
                          "subdenomination": null,
                          "token": "bool",
                          "type": "bool",
                          "value": "true"
                        },
                        "id": 4322,
                        "name": "Literal",
                        "src": "11277:4:12"
                      }
                    ],
                    "id": 4323,
                    "name": "Return",
                    "src": "11270:11:12"
                  }
                ],
                "id": 4324,
                "name": "Block",
                "src": "10749:539:12"
              }
            ],
            "id": 4325,
            "name": "FunctionDefinition",
            "src": "10667:621:12"
          },
          {
            "attributes": {
              "constant": true,
              "implemented": true,
              "isConstructor": false,
              "modifiers": [
                null
              ],
              "name": "allowance",
              "payable": false,
              "scope": 4821,
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
                      "name": "_owner",
                      "scope": 4341,
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
                        "id": 4326,
                        "name": "ElementaryTypeName",
                        "src": "11626:7:12"
                      }
                    ],
                    "id": 4327,
                    "name": "VariableDeclaration",
                    "src": "11626:14:12"
                  },
                  {
                    "attributes": {
                      "constant": false,
                      "name": "_spender",
                      "scope": 4341,
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
                        "id": 4328,
                        "name": "ElementaryTypeName",
                        "src": "11642:7:12"
                      }
                    ],
                    "id": 4329,
                    "name": "VariableDeclaration",
                    "src": "11642:16:12"
                  }
                ],
                "id": 4330,
                "name": "ParameterList",
                "src": "11625:39:12"
              },
              {
                "children": [
                  {
                    "attributes": {
                      "constant": false,
                      "name": "remaining",
                      "scope": 4341,
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
                        "id": 4331,
                        "name": "ElementaryTypeName",
                        "src": "11690:7:12"
                      }
                    ],
                    "id": 4332,
                    "name": "VariableDeclaration",
                    "src": "11690:17:12"
                  }
                ],
                "id": 4333,
                "name": "ParameterList",
                "src": "11689:19:12"
              },
              {
                "children": [
                  {
                    "attributes": {
                      "functionReturnParameters": 4333
                    },
                    "children": [
                      {
                        "attributes": {
                          "argumentTypes": null,
                          "isConstant": false,
                          "isLValue": true,
                          "isPure": false,
                          "lValueRequested": false,
                          "type": "uint256"
                        },
                        "children": [
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "isConstant": false,
                              "isLValue": true,
                              "isPure": false,
                              "lValueRequested": false,
                              "type": "mapping(address => uint256)"
                            },
                            "children": [
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "overloadedDeclarations": [
                                    null
                                  ],
                                  "referencedDeclaration": 3834,
                                  "type": "mapping(address => mapping(address => uint256))",
                                  "value": "allowed"
                                },
                                "id": 4334,
                                "name": "Identifier",
                                "src": "11726:7:12"
                              },
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "overloadedDeclarations": [
                                    null
                                  ],
                                  "referencedDeclaration": 4327,
                                  "type": "address",
                                  "value": "_owner"
                                },
                                "id": 4335,
                                "name": "Identifier",
                                "src": "11734:6:12"
                              }
                            ],
                            "id": 4336,
                            "name": "IndexAccess",
                            "src": "11726:15:12"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4329,
                              "type": "address",
                              "value": "_spender"
                            },
                            "id": 4337,
                            "name": "Identifier",
                            "src": "11742:8:12"
                          }
                        ],
                        "id": 4338,
                        "name": "IndexAccess",
                        "src": "11726:25:12"
                      }
                    ],
                    "id": 4339,
                    "name": "Return",
                    "src": "11719:32:12"
                  }
                ],
                "id": 4340,
                "name": "Block",
                "src": "11709:49:12"
              }
            ],
            "id": 4341,
            "name": "FunctionDefinition",
            "src": "11607:151:12"
          },
          {
            "attributes": {
              "constant": false,
              "implemented": true,
              "isConstructor": false,
              "modifiers": [
                null
              ],
              "name": "approveAndCall",
              "payable": false,
              "scope": 4821,
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
                      "name": "_spender",
                      "scope": 4373,
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
                        "id": 4342,
                        "name": "ElementaryTypeName",
                        "src": "12299:7:12"
                      }
                    ],
                    "id": 4343,
                    "name": "VariableDeclaration",
                    "src": "12299:16:12"
                  },
                  {
                    "attributes": {
                      "constant": false,
                      "name": "_amount",
                      "scope": 4373,
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
                        "id": 4344,
                        "name": "ElementaryTypeName",
                        "src": "12317:7:12"
                      }
                    ],
                    "id": 4345,
                    "name": "VariableDeclaration",
                    "src": "12317:15:12"
                  },
                  {
                    "attributes": {
                      "constant": false,
                      "name": "_extraData",
                      "scope": 4373,
                      "stateVariable": false,
                      "storageLocation": "default",
                      "type": "bytes memory",
                      "value": null,
                      "visibility": "internal"
                    },
                    "children": [
                      {
                        "attributes": {
                          "name": "bytes",
                          "type": "bytes storage pointer"
                        },
                        "id": 4346,
                        "name": "ElementaryTypeName",
                        "src": "12334:5:12"
                      }
                    ],
                    "id": 4347,
                    "name": "VariableDeclaration",
                    "src": "12334:16:12"
                  }
                ],
                "id": 4348,
                "name": "ParameterList",
                "src": "12298:58:12"
              },
              {
                "children": [
                  {
                    "attributes": {
                      "constant": false,
                      "name": "success",
                      "scope": 4373,
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
                        "id": 4349,
                        "name": "ElementaryTypeName",
                        "src": "12373:4:12"
                      }
                    ],
                    "id": 4350,
                    "name": "VariableDeclaration",
                    "src": "12373:12:12"
                  }
                ],
                "id": 4351,
                "name": "ParameterList",
                "src": "12372:14:12"
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
                              "referencedDeclaration": 11810,
                              "type": "function (bool) pure",
                              "value": "require"
                            },
                            "id": 4352,
                            "name": "Identifier",
                            "src": "12397:7:12"
                          },
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
                              "type": "bool",
                              "type_conversion": false
                            },
                            "children": [
                              {
                                "attributes": {
                                  "argumentTypes": [
                                    {
                                      "typeIdentifier": "t_address",
                                      "typeString": "address"
                                    },
                                    {
                                      "typeIdentifier": "t_uint256",
                                      "typeString": "uint256"
                                    }
                                  ],
                                  "overloadedDeclarations": [
                                    null
                                  ],
                                  "referencedDeclaration": 4325,
                                  "type": "function (address,uint256) returns (bool)",
                                  "value": "approve"
                                },
                                "id": 4353,
                                "name": "Identifier",
                                "src": "12405:7:12"
                              },
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "overloadedDeclarations": [
                                    null
                                  ],
                                  "referencedDeclaration": 4343,
                                  "type": "address",
                                  "value": "_spender"
                                },
                                "id": 4354,
                                "name": "Identifier",
                                "src": "12413:8:12"
                              },
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "overloadedDeclarations": [
                                    null
                                  ],
                                  "referencedDeclaration": 4345,
                                  "type": "uint256",
                                  "value": "_amount"
                                },
                                "id": 4355,
                                "name": "Identifier",
                                "src": "12423:7:12"
                              }
                            ],
                            "id": 4356,
                            "name": "FunctionCall",
                            "src": "12405:26:12"
                          }
                        ],
                        "id": 4357,
                        "name": "FunctionCall",
                        "src": "12397:35:12"
                      }
                    ],
                    "id": 4358,
                    "name": "ExpressionStatement",
                    "src": "12397:35:12"
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
                                  "typeIdentifier": "t_address",
                                  "typeString": "address"
                                },
                                {
                                  "typeIdentifier": "t_uint256",
                                  "typeString": "uint256"
                                },
                                {
                                  "typeIdentifier": "t_contract$_CrowdfundingToken_$4821",
                                  "typeString": "contract CrowdfundingToken"
                                },
                                {
                                  "typeIdentifier": "t_bytes_memory_ptr",
                                  "typeString": "bytes memory"
                                }
                              ],
                              "isConstant": false,
                              "isLValue": false,
                              "isPure": false,
                              "lValueRequested": false,
                              "member_name": "receiveApproval",
                              "referencedDeclaration": 3787,
                              "type": "function (address,uint256,address,bytes memory) external"
                            },
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
                                  "type": "contract ApproveAndCallFallBack",
                                  "type_conversion": true
                                },
                                "children": [
                                  {
                                    "attributes": {
                                      "argumentTypes": [
                                        {
                                          "typeIdentifier": "t_address",
                                          "typeString": "address"
                                        }
                                      ],
                                      "overloadedDeclarations": [
                                        null
                                      ],
                                      "referencedDeclaration": 3788,
                                      "type": "type(contract ApproveAndCallFallBack)",
                                      "value": "ApproveAndCallFallBack"
                                    },
                                    "id": 4359,
                                    "name": "Identifier",
                                    "src": "12443:22:12"
                                  },
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "overloadedDeclarations": [
                                        null
                                      ],
                                      "referencedDeclaration": 4343,
                                      "type": "address",
                                      "value": "_spender"
                                    },
                                    "id": 4360,
                                    "name": "Identifier",
                                    "src": "12466:8:12"
                                  }
                                ],
                                "id": 4361,
                                "name": "FunctionCall",
                                "src": "12443:32:12"
                              }
                            ],
                            "id": 4362,
                            "name": "MemberAccess",
                            "src": "12443:48:12"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "isConstant": false,
                              "isLValue": false,
                              "isPure": false,
                              "lValueRequested": false,
                              "member_name": "sender",
                              "referencedDeclaration": null,
                              "type": "address"
                            },
                            "children": [
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "overloadedDeclarations": [
                                    null
                                  ],
                                  "referencedDeclaration": 11807,
                                  "type": "msg",
                                  "value": "msg"
                                },
                                "id": 4363,
                                "name": "Identifier",
                                "src": "12505:3:12"
                              }
                            ],
                            "id": 4364,
                            "name": "MemberAccess",
                            "src": "12505:10:12"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4345,
                              "type": "uint256",
                              "value": "_amount"
                            },
                            "id": 4365,
                            "name": "Identifier",
                            "src": "12529:7:12"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 11876,
                              "type": "contract CrowdfundingToken",
                              "value": "this"
                            },
                            "id": 4366,
                            "name": "Identifier",
                            "src": "12550:4:12"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4347,
                              "type": "bytes memory",
                              "value": "_extraData"
                            },
                            "id": 4367,
                            "name": "Identifier",
                            "src": "12568:10:12"
                          }
                        ],
                        "id": 4368,
                        "name": "FunctionCall",
                        "src": "12443:145:12"
                      }
                    ],
                    "id": 4369,
                    "name": "ExpressionStatement",
                    "src": "12443:145:12"
                  },
                  {
                    "attributes": {
                      "functionReturnParameters": 4351
                    },
                    "children": [
                      {
                        "attributes": {
                          "argumentTypes": null,
                          "hexvalue": "74727565",
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": true,
                          "lValueRequested": false,
                          "subdenomination": null,
                          "token": "bool",
                          "type": "bool",
                          "value": "true"
                        },
                        "id": 4370,
                        "name": "Literal",
                        "src": "12606:4:12"
                      }
                    ],
                    "id": 4371,
                    "name": "Return",
                    "src": "12599:11:12"
                  }
                ],
                "id": 4372,
                "name": "Block",
                "src": "12387:230:12"
              }
            ],
            "id": 4373,
            "name": "FunctionDefinition",
            "src": "12275:342:12"
          },
          {
            "attributes": {
              "constant": true,
              "implemented": true,
              "isConstructor": false,
              "modifiers": [
                null
              ],
              "name": "totalSupply",
              "payable": false,
              "scope": 4821,
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
                "id": 4374,
                "name": "ParameterList",
                "src": "12761:2:12"
              },
              {
                "children": [
                  {
                    "attributes": {
                      "constant": false,
                      "name": "",
                      "scope": 4384,
                      "stateVariable": false,
                      "storageLocation": "default",
                      "type": "uint256",
                      "value": null,
                      "visibility": "internal"
                    },
                    "children": [
                      {
                        "attributes": {
                          "name": "uint",
                          "type": "uint256"
                        },
                        "id": 4375,
                        "name": "ElementaryTypeName",
                        "src": "12789:4:12"
                      }
                    ],
                    "id": 4376,
                    "name": "VariableDeclaration",
                    "src": "12789:4:12"
                  }
                ],
                "id": 4377,
                "name": "ParameterList",
                "src": "12788:6:12"
              },
              {
                "children": [
                  {
                    "attributes": {
                      "functionReturnParameters": 4377
                    },
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
                          "type": "uint256",
                          "type_conversion": false
                        },
                        "children": [
                          {
                            "attributes": {
                              "argumentTypes": [
                                {
                                  "typeIdentifier": "t_uint256",
                                  "typeString": "uint256"
                                }
                              ],
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4454,
                              "type": "function (uint256) view returns (uint256)",
                              "value": "totalSupplyAt"
                            },
                            "id": 4378,
                            "name": "Identifier",
                            "src": "12812:13:12"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "isConstant": false,
                              "isLValue": false,
                              "isPure": false,
                              "lValueRequested": false,
                              "member_name": "number",
                              "referencedDeclaration": null,
                              "type": "uint256"
                            },
                            "children": [
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "overloadedDeclarations": [
                                    null
                                  ],
                                  "referencedDeclaration": 11799,
                                  "type": "block",
                                  "value": "block"
                                },
                                "id": 4379,
                                "name": "Identifier",
                                "src": "12826:5:12"
                              }
                            ],
                            "id": 4380,
                            "name": "MemberAccess",
                            "src": "12826:12:12"
                          }
                        ],
                        "id": 4381,
                        "name": "FunctionCall",
                        "src": "12812:27:12"
                      }
                    ],
                    "id": 4382,
                    "name": "Return",
                    "src": "12805:34:12"
                  }
                ],
                "id": 4383,
                "name": "Block",
                "src": "12795:51:12"
              }
            ],
            "id": 4384,
            "name": "FunctionDefinition",
            "src": "12741:105:12"
          },
          {
            "attributes": {
              "constant": true,
              "implemented": true,
              "isConstructor": false,
              "modifiers": [
                null
              ],
              "name": "balanceOfAt",
              "payable": false,
              "scope": 4821,
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
                      "name": "_owner",
                      "scope": 4423,
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
                        "id": 4385,
                        "name": "ElementaryTypeName",
                        "src": "13220:7:12"
                      }
                    ],
                    "id": 4386,
                    "name": "VariableDeclaration",
                    "src": "13220:14:12"
                  },
                  {
                    "attributes": {
                      "constant": false,
                      "name": "_blockNumber",
                      "scope": 4423,
                      "stateVariable": false,
                      "storageLocation": "default",
                      "type": "uint256",
                      "value": null,
                      "visibility": "internal"
                    },
                    "children": [
                      {
                        "attributes": {
                          "name": "uint",
                          "type": "uint256"
                        },
                        "id": 4387,
                        "name": "ElementaryTypeName",
                        "src": "13236:4:12"
                      }
                    ],
                    "id": 4388,
                    "name": "VariableDeclaration",
                    "src": "13236:17:12"
                  }
                ],
                "id": 4389,
                "name": "ParameterList",
                "src": "13219:35:12"
              },
              {
                "children": [
                  {
                    "attributes": {
                      "constant": false,
                      "name": "",
                      "scope": 4423,
                      "stateVariable": false,
                      "storageLocation": "default",
                      "type": "uint256",
                      "value": null,
                      "visibility": "internal"
                    },
                    "children": [
                      {
                        "attributes": {
                          "name": "uint",
                          "type": "uint256"
                        },
                        "id": 4390,
                        "name": "ElementaryTypeName",
                        "src": "13288:4:12"
                      }
                    ],
                    "id": 4391,
                    "name": "VariableDeclaration",
                    "src": "13288:4:12"
                  }
                ],
                "id": 4392,
                "name": "ParameterList",
                "src": "13287:6:12"
              },
              {
                "children": [
                  {
                    "children": [
                      {
                        "attributes": {
                          "argumentTypes": null,
                          "commonType": {
                            "typeIdentifier": "t_bool",
                            "typeString": "bool"
                          },
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": false,
                          "lValueRequested": false,
                          "operator": "||",
                          "type": "bool"
                        },
                        "children": [
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "isConstant": false,
                              "isInlineArray": false,
                              "isLValue": false,
                              "isPure": false,
                              "lValueRequested": false,
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
                                  "operator": "==",
                                  "type": "bool"
                                },
                                "children": [
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "isConstant": false,
                                      "isLValue": true,
                                      "isPure": false,
                                      "lValueRequested": false,
                                      "member_name": "length",
                                      "referencedDeclaration": null,
                                      "type": "uint256"
                                    },
                                    "children": [
                                      {
                                        "attributes": {
                                          "argumentTypes": null,
                                          "isConstant": false,
                                          "isLValue": true,
                                          "isPure": false,
                                          "lValueRequested": false,
                                          "type": "struct CrowdfundingToken.Checkpoint storage ref[] storage ref"
                                        },
                                        "children": [
                                          {
                                            "attributes": {
                                              "argumentTypes": null,
                                              "overloadedDeclarations": [
                                                null
                                              ],
                                              "referencedDeclaration": 3828,
                                              "type": "mapping(address => struct CrowdfundingToken.Checkpoint storage ref[] storage ref)",
                                              "value": "balances"
                                            },
                                            "id": 4393,
                                            "name": "Identifier",
                                            "src": "13310:8:12"
                                          },
                                          {
                                            "attributes": {
                                              "argumentTypes": null,
                                              "overloadedDeclarations": [
                                                null
                                              ],
                                              "referencedDeclaration": 4386,
                                              "type": "address",
                                              "value": "_owner"
                                            },
                                            "id": 4394,
                                            "name": "Identifier",
                                            "src": "13319:6:12"
                                          }
                                        ],
                                        "id": 4395,
                                        "name": "IndexAccess",
                                        "src": "13310:16:12"
                                      }
                                    ],
                                    "id": 4396,
                                    "name": "MemberAccess",
                                    "src": "13310:23:12"
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
                                    "id": 4397,
                                    "name": "Literal",
                                    "src": "13337:1:12"
                                  }
                                ],
                                "id": 4398,
                                "name": "BinaryOperation",
                                "src": "13310:28:12"
                              }
                            ],
                            "id": 4399,
                            "name": "TupleExpression",
                            "src": "13309:30:12"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "isConstant": false,
                              "isInlineArray": false,
                              "isLValue": false,
                              "isPure": false,
                              "lValueRequested": false,
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
                                  "operator": ">",
                                  "type": "bool"
                                },
                                "children": [
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "isConstant": false,
                                      "isLValue": true,
                                      "isPure": false,
                                      "lValueRequested": false,
                                      "member_name": "fromBlock",
                                      "referencedDeclaration": 3797,
                                      "type": "uint256"
                                    },
                                    "children": [
                                      {
                                        "attributes": {
                                          "argumentTypes": null,
                                          "isConstant": false,
                                          "isLValue": true,
                                          "isPure": false,
                                          "lValueRequested": false,
                                          "type": "struct CrowdfundingToken.Checkpoint storage ref"
                                        },
                                        "children": [
                                          {
                                            "attributes": {
                                              "argumentTypes": null,
                                              "isConstant": false,
                                              "isLValue": true,
                                              "isPure": false,
                                              "lValueRequested": false,
                                              "type": "struct CrowdfundingToken.Checkpoint storage ref[] storage ref"
                                            },
                                            "children": [
                                              {
                                                "attributes": {
                                                  "argumentTypes": null,
                                                  "overloadedDeclarations": [
                                                    null
                                                  ],
                                                  "referencedDeclaration": 3828,
                                                  "type": "mapping(address => struct CrowdfundingToken.Checkpoint storage ref[] storage ref)",
                                                  "value": "balances"
                                                },
                                                "id": 4400,
                                                "name": "Identifier",
                                                "src": "13344:8:12"
                                              },
                                              {
                                                "attributes": {
                                                  "argumentTypes": null,
                                                  "overloadedDeclarations": [
                                                    null
                                                  ],
                                                  "referencedDeclaration": 4386,
                                                  "type": "address",
                                                  "value": "_owner"
                                                },
                                                "id": 4401,
                                                "name": "Identifier",
                                                "src": "13353:6:12"
                                              }
                                            ],
                                            "id": 4402,
                                            "name": "IndexAccess",
                                            "src": "13344:16:12"
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
                                            "id": 4403,
                                            "name": "Literal",
                                            "src": "13361:1:12"
                                          }
                                        ],
                                        "id": 4404,
                                        "name": "IndexAccess",
                                        "src": "13344:19:12"
                                      }
                                    ],
                                    "id": 4405,
                                    "name": "MemberAccess",
                                    "src": "13344:29:12"
                                  },
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "overloadedDeclarations": [
                                        null
                                      ],
                                      "referencedDeclaration": 4388,
                                      "type": "uint256",
                                      "value": "_blockNumber"
                                    },
                                    "id": 4406,
                                    "name": "Identifier",
                                    "src": "13376:12:12"
                                  }
                                ],
                                "id": 4407,
                                "name": "BinaryOperation",
                                "src": "13344:44:12"
                              }
                            ],
                            "id": 4408,
                            "name": "TupleExpression",
                            "src": "13343:46:12"
                          }
                        ],
                        "id": 4409,
                        "name": "BinaryOperation",
                        "src": "13309:80:12"
                      },
                      {
                        "children": [
                          {
                            "attributes": {
                              "functionReturnParameters": 4392
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
                                "id": 4410,
                                "name": "Literal",
                                "src": "13412:1:12"
                              }
                            ],
                            "id": 4411,
                            "name": "Return",
                            "src": "13405:8:12"
                          }
                        ],
                        "id": 4412,
                        "name": "Block",
                        "src": "13391:108:12"
                      },
                      {
                        "children": [
                          {
                            "attributes": {
                              "functionReturnParameters": 4392
                            },
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
                                  "type": "uint256",
                                  "type_conversion": false
                                },
                                "children": [
                                  {
                                    "attributes": {
                                      "argumentTypes": [
                                        {
                                          "typeIdentifier": "t_array$_t_struct$_Checkpoint_$3800_storage_$dyn_storage",
                                          "typeString": "struct CrowdfundingToken.Checkpoint storage ref[] storage ref"
                                        },
                                        {
                                          "typeIdentifier": "t_uint256",
                                          "typeString": "uint256"
                                        }
                                      ],
                                      "overloadedDeclarations": [
                                        null
                                      ],
                                      "referencedDeclaration": 4625,
                                      "type": "function (struct CrowdfundingToken.Checkpoint storage ref[] storage pointer,uint256) view returns (uint256)",
                                      "value": "getValueAt"
                                    },
                                    "id": 4413,
                                    "name": "Identifier",
                                    "src": "13526:10:12"
                                  },
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "isConstant": false,
                                      "isLValue": true,
                                      "isPure": false,
                                      "lValueRequested": false,
                                      "type": "struct CrowdfundingToken.Checkpoint storage ref[] storage ref"
                                    },
                                    "children": [
                                      {
                                        "attributes": {
                                          "argumentTypes": null,
                                          "overloadedDeclarations": [
                                            null
                                          ],
                                          "referencedDeclaration": 3828,
                                          "type": "mapping(address => struct CrowdfundingToken.Checkpoint storage ref[] storage ref)",
                                          "value": "balances"
                                        },
                                        "id": 4414,
                                        "name": "Identifier",
                                        "src": "13537:8:12"
                                      },
                                      {
                                        "attributes": {
                                          "argumentTypes": null,
                                          "overloadedDeclarations": [
                                            null
                                          ],
                                          "referencedDeclaration": 4386,
                                          "type": "address",
                                          "value": "_owner"
                                        },
                                        "id": 4415,
                                        "name": "Identifier",
                                        "src": "13546:6:12"
                                      }
                                    ],
                                    "id": 4416,
                                    "name": "IndexAccess",
                                    "src": "13537:16:12"
                                  },
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "overloadedDeclarations": [
                                        null
                                      ],
                                      "referencedDeclaration": 4388,
                                      "type": "uint256",
                                      "value": "_blockNumber"
                                    },
                                    "id": 4417,
                                    "name": "Identifier",
                                    "src": "13555:12:12"
                                  }
                                ],
                                "id": 4418,
                                "name": "FunctionCall",
                                "src": "13526:42:12"
                              }
                            ],
                            "id": 4419,
                            "name": "Return",
                            "src": "13519:49:12"
                          }
                        ],
                        "id": 4420,
                        "name": "Block",
                        "src": "13505:74:12"
                      }
                    ],
                    "id": 4421,
                    "name": "IfStatement",
                    "src": "13305:274:12"
                  }
                ],
                "id": 4422,
                "name": "Block",
                "src": "13294:291:12"
              }
            ],
            "id": 4423,
            "name": "FunctionDefinition",
            "src": "13199:386:12"
          },
          {
            "attributes": {
              "constant": true,
              "implemented": true,
              "isConstructor": false,
              "modifiers": [
                null
              ],
              "name": "totalSupplyAt",
              "payable": false,
              "scope": 4821,
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
                      "name": "_blockNumber",
                      "scope": 4454,
                      "stateVariable": false,
                      "storageLocation": "default",
                      "type": "uint256",
                      "value": null,
                      "visibility": "internal"
                    },
                    "children": [
                      {
                        "attributes": {
                          "name": "uint",
                          "type": "uint256"
                        },
                        "id": 4424,
                        "name": "ElementaryTypeName",
                        "src": "13821:4:12"
                      }
                    ],
                    "id": 4425,
                    "name": "VariableDeclaration",
                    "src": "13821:17:12"
                  }
                ],
                "id": 4426,
                "name": "ParameterList",
                "src": "13820:19:12"
              },
              {
                "children": [
                  {
                    "attributes": {
                      "constant": false,
                      "name": "",
                      "scope": 4454,
                      "stateVariable": false,
                      "storageLocation": "default",
                      "type": "uint256",
                      "value": null,
                      "visibility": "internal"
                    },
                    "children": [
                      {
                        "attributes": {
                          "name": "uint",
                          "type": "uint256"
                        },
                        "id": 4427,
                        "name": "ElementaryTypeName",
                        "src": "13864:4:12"
                      }
                    ],
                    "id": 4428,
                    "name": "VariableDeclaration",
                    "src": "13864:4:12"
                  }
                ],
                "id": 4429,
                "name": "ParameterList",
                "src": "13863:6:12"
              },
              {
                "children": [
                  {
                    "children": [
                      {
                        "attributes": {
                          "argumentTypes": null,
                          "commonType": {
                            "typeIdentifier": "t_bool",
                            "typeString": "bool"
                          },
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": false,
                          "lValueRequested": false,
                          "operator": "||",
                          "type": "bool"
                        },
                        "children": [
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "isConstant": false,
                              "isInlineArray": false,
                              "isLValue": false,
                              "isPure": false,
                              "lValueRequested": false,
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
                                  "operator": "==",
                                  "type": "bool"
                                },
                                "children": [
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "isConstant": false,
                                      "isLValue": true,
                                      "isPure": false,
                                      "lValueRequested": false,
                                      "member_name": "length",
                                      "referencedDeclaration": null,
                                      "type": "uint256"
                                    },
                                    "children": [
                                      {
                                        "attributes": {
                                          "argumentTypes": null,
                                          "overloadedDeclarations": [
                                            null
                                          ],
                                          "referencedDeclaration": 3837,
                                          "type": "struct CrowdfundingToken.Checkpoint storage ref[] storage ref",
                                          "value": "totalSupplyHistory"
                                        },
                                        "id": 4430,
                                        "name": "Identifier",
                                        "src": "13886:18:12"
                                      }
                                    ],
                                    "id": 4431,
                                    "name": "MemberAccess",
                                    "src": "13886:25:12"
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
                                    "id": 4432,
                                    "name": "Literal",
                                    "src": "13915:1:12"
                                  }
                                ],
                                "id": 4433,
                                "name": "BinaryOperation",
                                "src": "13886:30:12"
                              }
                            ],
                            "id": 4434,
                            "name": "TupleExpression",
                            "src": "13885:32:12"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "isConstant": false,
                              "isInlineArray": false,
                              "isLValue": false,
                              "isPure": false,
                              "lValueRequested": false,
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
                                  "operator": ">",
                                  "type": "bool"
                                },
                                "children": [
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "isConstant": false,
                                      "isLValue": true,
                                      "isPure": false,
                                      "lValueRequested": false,
                                      "member_name": "fromBlock",
                                      "referencedDeclaration": 3797,
                                      "type": "uint256"
                                    },
                                    "children": [
                                      {
                                        "attributes": {
                                          "argumentTypes": null,
                                          "isConstant": false,
                                          "isLValue": true,
                                          "isPure": false,
                                          "lValueRequested": false,
                                          "type": "struct CrowdfundingToken.Checkpoint storage ref"
                                        },
                                        "children": [
                                          {
                                            "attributes": {
                                              "argumentTypes": null,
                                              "overloadedDeclarations": [
                                                null
                                              ],
                                              "referencedDeclaration": 3837,
                                              "type": "struct CrowdfundingToken.Checkpoint storage ref[] storage ref",
                                              "value": "totalSupplyHistory"
                                            },
                                            "id": 4435,
                                            "name": "Identifier",
                                            "src": "13922:18:12"
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
                                            "id": 4436,
                                            "name": "Literal",
                                            "src": "13941:1:12"
                                          }
                                        ],
                                        "id": 4437,
                                        "name": "IndexAccess",
                                        "src": "13922:21:12"
                                      }
                                    ],
                                    "id": 4438,
                                    "name": "MemberAccess",
                                    "src": "13922:31:12"
                                  },
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "overloadedDeclarations": [
                                        null
                                      ],
                                      "referencedDeclaration": 4425,
                                      "type": "uint256",
                                      "value": "_blockNumber"
                                    },
                                    "id": 4439,
                                    "name": "Identifier",
                                    "src": "13956:12:12"
                                  }
                                ],
                                "id": 4440,
                                "name": "BinaryOperation",
                                "src": "13922:46:12"
                              }
                            ],
                            "id": 4441,
                            "name": "TupleExpression",
                            "src": "13921:48:12"
                          }
                        ],
                        "id": 4442,
                        "name": "BinaryOperation",
                        "src": "13885:84:12"
                      },
                      {
                        "children": [
                          {
                            "attributes": {
                              "functionReturnParameters": 4429
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
                                "id": 4443,
                                "name": "Literal",
                                "src": "13992:1:12"
                              }
                            ],
                            "id": 4444,
                            "name": "Return",
                            "src": "13985:8:12"
                          }
                        ],
                        "id": 4445,
                        "name": "Block",
                        "src": "13971:112:12"
                      },
                      {
                        "children": [
                          {
                            "attributes": {
                              "functionReturnParameters": 4429
                            },
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
                                  "type": "uint256",
                                  "type_conversion": false
                                },
                                "children": [
                                  {
                                    "attributes": {
                                      "argumentTypes": [
                                        {
                                          "typeIdentifier": "t_array$_t_struct$_Checkpoint_$3800_storage_$dyn_storage",
                                          "typeString": "struct CrowdfundingToken.Checkpoint storage ref[] storage ref"
                                        },
                                        {
                                          "typeIdentifier": "t_uint256",
                                          "typeString": "uint256"
                                        }
                                      ],
                                      "overloadedDeclarations": [
                                        null
                                      ],
                                      "referencedDeclaration": 4625,
                                      "type": "function (struct CrowdfundingToken.Checkpoint storage ref[] storage pointer,uint256) view returns (uint256)",
                                      "value": "getValueAt"
                                    },
                                    "id": 4446,
                                    "name": "Identifier",
                                    "src": "14110:10:12"
                                  },
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "overloadedDeclarations": [
                                        null
                                      ],
                                      "referencedDeclaration": 3837,
                                      "type": "struct CrowdfundingToken.Checkpoint storage ref[] storage ref",
                                      "value": "totalSupplyHistory"
                                    },
                                    "id": 4447,
                                    "name": "Identifier",
                                    "src": "14121:18:12"
                                  },
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "overloadedDeclarations": [
                                        null
                                      ],
                                      "referencedDeclaration": 4425,
                                      "type": "uint256",
                                      "value": "_blockNumber"
                                    },
                                    "id": 4448,
                                    "name": "Identifier",
                                    "src": "14141:12:12"
                                  }
                                ],
                                "id": 4449,
                                "name": "FunctionCall",
                                "src": "14110:44:12"
                              }
                            ],
                            "id": 4450,
                            "name": "Return",
                            "src": "14103:51:12"
                          }
                        ],
                        "id": 4451,
                        "name": "Block",
                        "src": "14089:76:12"
                      }
                    ],
                    "id": 4452,
                    "name": "IfStatement",
                    "src": "13881:284:12"
                  }
                ],
                "id": 4453,
                "name": "Block",
                "src": "13870:301:12"
              }
            ],
            "id": 4454,
            "name": "FunctionDefinition",
            "src": "13798:373:12"
          },
          {
            "attributes": {
              "constant": false,
              "implemented": true,
              "isConstructor": false,
              "name": "generateTokens",
              "payable": false,
              "scope": 4821,
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
                      "name": "_owner",
                      "scope": 4517,
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
                        "id": 4455,
                        "name": "ElementaryTypeName",
                        "src": "14526:7:12"
                      }
                    ],
                    "id": 4456,
                    "name": "VariableDeclaration",
                    "src": "14526:14:12"
                  },
                  {
                    "attributes": {
                      "constant": false,
                      "name": "_amount",
                      "scope": 4517,
                      "stateVariable": false,
                      "storageLocation": "default",
                      "type": "uint256",
                      "value": null,
                      "visibility": "internal"
                    },
                    "children": [
                      {
                        "attributes": {
                          "name": "uint",
                          "type": "uint256"
                        },
                        "id": 4457,
                        "name": "ElementaryTypeName",
                        "src": "14542:4:12"
                      }
                    ],
                    "id": 4458,
                    "name": "VariableDeclaration",
                    "src": "14542:12:12"
                  }
                ],
                "id": 4459,
                "name": "ParameterList",
                "src": "14525:35:12"
              },
              {
                "children": [
                  {
                    "attributes": {
                      "constant": false,
                      "name": "",
                      "scope": 4517,
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
                        "id": 4462,
                        "name": "ElementaryTypeName",
                        "src": "14592:4:12"
                      }
                    ],
                    "id": 4463,
                    "name": "VariableDeclaration",
                    "src": "14592:4:12"
                  }
                ],
                "id": 4464,
                "name": "ParameterList",
                "src": "14591:6:12"
              },
              {
                "attributes": {
                  "arguments": [
                    null
                  ]
                },
                "children": [
                  {
                    "attributes": {
                      "argumentTypes": null,
                      "overloadedDeclarations": [
                        null
                      ],
                      "referencedDeclaration": 3744,
                      "type": "modifier ()",
                      "value": "onlyController"
                    },
                    "id": 4460,
                    "name": "Identifier",
                    "src": "14568:14:12"
                  }
                ],
                "id": 4461,
                "name": "ModifierInvocation",
                "src": "14568:14:12"
              },
              {
                "children": [
                  {
                    "attributes": {
                      "assignments": [
                        4466
                      ]
                    },
                    "children": [
                      {
                        "attributes": {
                          "constant": false,
                          "name": "curTotalSupply",
                          "scope": 4517,
                          "stateVariable": false,
                          "storageLocation": "default",
                          "type": "uint256",
                          "value": null,
                          "visibility": "internal"
                        },
                        "children": [
                          {
                            "attributes": {
                              "name": "uint",
                              "type": "uint256"
                            },
                            "id": 4465,
                            "name": "ElementaryTypeName",
                            "src": "14608:4:12"
                          }
                        ],
                        "id": 4466,
                        "name": "VariableDeclaration",
                        "src": "14608:19:12"
                      },
                      {
                        "attributes": {
                          "argumentTypes": null,
                          "arguments": [
                            null
                          ],
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": false,
                          "isStructConstructorCall": false,
                          "lValueRequested": false,
                          "names": [
                            null
                          ],
                          "type": "uint256",
                          "type_conversion": false
                        },
                        "children": [
                          {
                            "attributes": {
                              "argumentTypes": [
                                null
                              ],
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4384,
                              "type": "function () view returns (uint256)",
                              "value": "totalSupply"
                            },
                            "id": 4467,
                            "name": "Identifier",
                            "src": "14630:11:12"
                          }
                        ],
                        "id": 4468,
                        "name": "FunctionCall",
                        "src": "14630:13:12"
                      }
                    ],
                    "id": 4469,
                    "name": "VariableDeclarationStatement",
                    "src": "14608:35:12"
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
                              "referencedDeclaration": 11810,
                              "type": "function (bool) pure",
                              "value": "require"
                            },
                            "id": 4470,
                            "name": "Identifier",
                            "src": "14653:7:12"
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
                                      "referencedDeclaration": 4466,
                                      "type": "uint256",
                                      "value": "curTotalSupply"
                                    },
                                    "id": 4471,
                                    "name": "Identifier",
                                    "src": "14661:14:12"
                                  },
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "overloadedDeclarations": [
                                        null
                                      ],
                                      "referencedDeclaration": 4458,
                                      "type": "uint256",
                                      "value": "_amount"
                                    },
                                    "id": 4472,
                                    "name": "Identifier",
                                    "src": "14678:7:12"
                                  }
                                ],
                                "id": 4473,
                                "name": "BinaryOperation",
                                "src": "14661:24:12"
                              },
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "overloadedDeclarations": [
                                    null
                                  ],
                                  "referencedDeclaration": 4466,
                                  "type": "uint256",
                                  "value": "curTotalSupply"
                                },
                                "id": 4474,
                                "name": "Identifier",
                                "src": "14689:14:12"
                              }
                            ],
                            "id": 4475,
                            "name": "BinaryOperation",
                            "src": "14661:42:12"
                          }
                        ],
                        "id": 4476,
                        "name": "FunctionCall",
                        "src": "14653:51:12"
                      }
                    ],
                    "id": 4477,
                    "name": "ExpressionStatement",
                    "src": "14653:51:12"
                  },
                  {
                    "attributes": {
                      "assignments": [
                        4479
                      ]
                    },
                    "children": [
                      {
                        "attributes": {
                          "constant": false,
                          "name": "previousBalanceTo",
                          "scope": 4517,
                          "stateVariable": false,
                          "storageLocation": "default",
                          "type": "uint256",
                          "value": null,
                          "visibility": "internal"
                        },
                        "children": [
                          {
                            "attributes": {
                              "name": "uint",
                              "type": "uint256"
                            },
                            "id": 4478,
                            "name": "ElementaryTypeName",
                            "src": "14736:4:12"
                          }
                        ],
                        "id": 4479,
                        "name": "VariableDeclaration",
                        "src": "14736:22:12"
                      },
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
                          "type": "uint256",
                          "type_conversion": false
                        },
                        "children": [
                          {
                            "attributes": {
                              "argumentTypes": [
                                {
                                  "typeIdentifier": "t_address",
                                  "typeString": "address"
                                }
                              ],
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4276,
                              "type": "function (address) view returns (uint256)",
                              "value": "balanceOf"
                            },
                            "id": 4480,
                            "name": "Identifier",
                            "src": "14761:9:12"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4456,
                              "type": "address",
                              "value": "_owner"
                            },
                            "id": 4481,
                            "name": "Identifier",
                            "src": "14771:6:12"
                          }
                        ],
                        "id": 4482,
                        "name": "FunctionCall",
                        "src": "14761:17:12"
                      }
                    ],
                    "id": 4483,
                    "name": "VariableDeclarationStatement",
                    "src": "14736:42:12"
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
                              "referencedDeclaration": 11810,
                              "type": "function (bool) pure",
                              "value": "require"
                            },
                            "id": 4484,
                            "name": "Identifier",
                            "src": "14788:7:12"
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
                                      "referencedDeclaration": 4479,
                                      "type": "uint256",
                                      "value": "previousBalanceTo"
                                    },
                                    "id": 4485,
                                    "name": "Identifier",
                                    "src": "14796:17:12"
                                  },
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "overloadedDeclarations": [
                                        null
                                      ],
                                      "referencedDeclaration": 4458,
                                      "type": "uint256",
                                      "value": "_amount"
                                    },
                                    "id": 4486,
                                    "name": "Identifier",
                                    "src": "14816:7:12"
                                  }
                                ],
                                "id": 4487,
                                "name": "BinaryOperation",
                                "src": "14796:27:12"
                              },
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "overloadedDeclarations": [
                                    null
                                  ],
                                  "referencedDeclaration": 4479,
                                  "type": "uint256",
                                  "value": "previousBalanceTo"
                                },
                                "id": 4488,
                                "name": "Identifier",
                                "src": "14827:17:12"
                              }
                            ],
                            "id": 4489,
                            "name": "BinaryOperation",
                            "src": "14796:48:12"
                          }
                        ],
                        "id": 4490,
                        "name": "FunctionCall",
                        "src": "14788:57:12"
                      }
                    ],
                    "id": 4491,
                    "name": "ExpressionStatement",
                    "src": "14788:57:12"
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
                                  "typeIdentifier": "t_array$_t_struct$_Checkpoint_$3800_storage_$dyn_storage",
                                  "typeString": "struct CrowdfundingToken.Checkpoint storage ref[] storage ref"
                                },
                                {
                                  "typeIdentifier": "t_uint256",
                                  "typeString": "uint256"
                                }
                              ],
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4696,
                              "type": "function (struct CrowdfundingToken.Checkpoint storage ref[] storage pointer,uint256)",
                              "value": "updateValueAtNow"
                            },
                            "id": 4492,
                            "name": "Identifier",
                            "src": "14877:16:12"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 3837,
                              "type": "struct CrowdfundingToken.Checkpoint storage ref[] storage ref",
                              "value": "totalSupplyHistory"
                            },
                            "id": 4493,
                            "name": "Identifier",
                            "src": "14894:18:12"
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
                                  "referencedDeclaration": 4466,
                                  "type": "uint256",
                                  "value": "curTotalSupply"
                                },
                                "id": 4494,
                                "name": "Identifier",
                                "src": "14914:14:12"
                              },
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "overloadedDeclarations": [
                                    null
                                  ],
                                  "referencedDeclaration": 4458,
                                  "type": "uint256",
                                  "value": "_amount"
                                },
                                "id": 4495,
                                "name": "Identifier",
                                "src": "14931:7:12"
                              }
                            ],
                            "id": 4496,
                            "name": "BinaryOperation",
                            "src": "14914:24:12"
                          }
                        ],
                        "id": 4497,
                        "name": "FunctionCall",
                        "src": "14877:62:12"
                      }
                    ],
                    "id": 4498,
                    "name": "ExpressionStatement",
                    "src": "14877:62:12"
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
                                  "typeIdentifier": "t_array$_t_struct$_Checkpoint_$3800_storage_$dyn_storage",
                                  "typeString": "struct CrowdfundingToken.Checkpoint storage ref[] storage ref"
                                },
                                {
                                  "typeIdentifier": "t_uint256",
                                  "typeString": "uint256"
                                }
                              ],
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4696,
                              "type": "function (struct CrowdfundingToken.Checkpoint storage ref[] storage pointer,uint256)",
                              "value": "updateValueAtNow"
                            },
                            "id": 4499,
                            "name": "Identifier",
                            "src": "14949:16:12"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "isConstant": false,
                              "isLValue": true,
                              "isPure": false,
                              "lValueRequested": false,
                              "type": "struct CrowdfundingToken.Checkpoint storage ref[] storage ref"
                            },
                            "children": [
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "overloadedDeclarations": [
                                    null
                                  ],
                                  "referencedDeclaration": 3828,
                                  "type": "mapping(address => struct CrowdfundingToken.Checkpoint storage ref[] storage ref)",
                                  "value": "balances"
                                },
                                "id": 4500,
                                "name": "Identifier",
                                "src": "14966:8:12"
                              },
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "overloadedDeclarations": [
                                    null
                                  ],
                                  "referencedDeclaration": 4456,
                                  "type": "address",
                                  "value": "_owner"
                                },
                                "id": 4501,
                                "name": "Identifier",
                                "src": "14975:6:12"
                              }
                            ],
                            "id": 4502,
                            "name": "IndexAccess",
                            "src": "14966:16:12"
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
                                  "referencedDeclaration": 4479,
                                  "type": "uint256",
                                  "value": "previousBalanceTo"
                                },
                                "id": 4503,
                                "name": "Identifier",
                                "src": "14984:17:12"
                              },
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "overloadedDeclarations": [
                                    null
                                  ],
                                  "referencedDeclaration": 4458,
                                  "type": "uint256",
                                  "value": "_amount"
                                },
                                "id": 4504,
                                "name": "Identifier",
                                "src": "15004:7:12"
                              }
                            ],
                            "id": 4505,
                            "name": "BinaryOperation",
                            "src": "14984:27:12"
                          }
                        ],
                        "id": 4506,
                        "name": "FunctionCall",
                        "src": "14949:63:12"
                      }
                    ],
                    "id": 4507,
                    "name": "ExpressionStatement",
                    "src": "14949:63:12"
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
                                  "typeIdentifier": "t_rational_0_by_1",
                                  "typeString": "int_const 0"
                                },
                                {
                                  "typeIdentifier": "t_address",
                                  "typeString": "address"
                                },
                                {
                                  "typeIdentifier": "t_uint256",
                                  "typeString": "uint256"
                                }
                              ],
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4812,
                              "type": "function (address,address,uint256)",
                              "value": "Transfer"
                            },
                            "id": 4508,
                            "name": "Identifier",
                            "src": "15022:8:12"
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
                            "id": 4509,
                            "name": "Literal",
                            "src": "15031:1:12"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4456,
                              "type": "address",
                              "value": "_owner"
                            },
                            "id": 4510,
                            "name": "Identifier",
                            "src": "15034:6:12"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4458,
                              "type": "uint256",
                              "value": "_amount"
                            },
                            "id": 4511,
                            "name": "Identifier",
                            "src": "15042:7:12"
                          }
                        ],
                        "id": 4512,
                        "name": "FunctionCall",
                        "src": "15022:28:12"
                      }
                    ],
                    "id": 4513,
                    "name": "ExpressionStatement",
                    "src": "15022:28:12"
                  },
                  {
                    "attributes": {
                      "functionReturnParameters": 4464
                    },
                    "children": [
                      {
                        "attributes": {
                          "argumentTypes": null,
                          "hexvalue": "74727565",
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": true,
                          "lValueRequested": false,
                          "subdenomination": null,
                          "token": "bool",
                          "type": "bool",
                          "value": "true"
                        },
                        "id": 4514,
                        "name": "Literal",
                        "src": "15067:4:12"
                      }
                    ],
                    "id": 4515,
                    "name": "Return",
                    "src": "15060:11:12"
                  }
                ],
                "id": 4516,
                "name": "Block",
                "src": "14598:480:12"
              }
            ],
            "id": 4517,
            "name": "FunctionDefinition",
            "src": "14502:576:12"
          },
          {
            "attributes": {
              "constant": false,
              "implemented": true,
              "isConstructor": false,
              "name": "enableTransfers",
              "payable": false,
              "scope": 4821,
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
                      "name": "_transfersEnabled",
                      "scope": 4529,
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
                        "id": 4518,
                        "name": "ElementaryTypeName",
                        "src": "15325:4:12"
                      }
                    ],
                    "id": 4519,
                    "name": "VariableDeclaration",
                    "src": "15325:22:12"
                  }
                ],
                "id": 4520,
                "name": "ParameterList",
                "src": "15324:24:12"
              },
              {
                "attributes": {
                  "parameters": [
                    null
                  ]
                },
                "children": [],
                "id": 4523,
                "name": "ParameterList",
                "src": "15371:0:12"
              },
              {
                "attributes": {
                  "arguments": [
                    null
                  ]
                },
                "children": [
                  {
                    "attributes": {
                      "argumentTypes": null,
                      "overloadedDeclarations": [
                        null
                      ],
                      "referencedDeclaration": 3744,
                      "type": "modifier ()",
                      "value": "onlyController"
                    },
                    "id": 4521,
                    "name": "Identifier",
                    "src": "15356:14:12"
                  }
                ],
                "id": 4522,
                "name": "ModifierInvocation",
                "src": "15356:14:12"
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
                          "lValueRequested": false,
                          "operator": "=",
                          "type": "bool"
                        },
                        "children": [
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 3839,
                              "type": "bool",
                              "value": "transfersEnabled"
                            },
                            "id": 4524,
                            "name": "Identifier",
                            "src": "15381:16:12"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4519,
                              "type": "bool",
                              "value": "_transfersEnabled"
                            },
                            "id": 4525,
                            "name": "Identifier",
                            "src": "15400:17:12"
                          }
                        ],
                        "id": 4526,
                        "name": "Assignment",
                        "src": "15381:36:12"
                      }
                    ],
                    "id": 4527,
                    "name": "ExpressionStatement",
                    "src": "15381:36:12"
                  }
                ],
                "id": 4528,
                "name": "Block",
                "src": "15371:53:12"
              }
            ],
            "id": 4529,
            "name": "FunctionDefinition",
            "src": "15300:124:12"
          },
          {
            "attributes": {
              "constant": true,
              "implemented": true,
              "isConstructor": false,
              "modifiers": [
                null
              ],
              "name": "getValueAt",
              "payable": false,
              "scope": 4821,
              "stateMutability": "view",
              "superFunction": null,
              "visibility": "internal"
            },
            "children": [
              {
                "children": [
                  {
                    "attributes": {
                      "constant": false,
                      "name": "checkpoints",
                      "scope": 4625,
                      "stateVariable": false,
                      "storageLocation": "storage",
                      "type": "struct CrowdfundingToken.Checkpoint storage ref[] storage pointer",
                      "value": null,
                      "visibility": "internal"
                    },
                    "children": [
                      {
                        "attributes": {
                          "length": null,
                          "type": "struct CrowdfundingToken.Checkpoint storage ref[] storage pointer"
                        },
                        "children": [
                          {
                            "attributes": {
                              "contractScope": null,
                              "name": "Checkpoint",
                              "referencedDeclaration": 3800,
                              "type": "struct CrowdfundingToken.Checkpoint storage pointer"
                            },
                            "id": 4530,
                            "name": "UserDefinedTypeName",
                            "src": "15818:10:12"
                          }
                        ],
                        "id": 4531,
                        "name": "ArrayTypeName",
                        "src": "15818:12:12"
                      }
                    ],
                    "id": 4532,
                    "name": "VariableDeclaration",
                    "src": "15818:32:12"
                  },
                  {
                    "attributes": {
                      "constant": false,
                      "name": "_block",
                      "scope": 4625,
                      "stateVariable": false,
                      "storageLocation": "default",
                      "type": "uint256",
                      "value": null,
                      "visibility": "internal"
                    },
                    "children": [
                      {
                        "attributes": {
                          "name": "uint",
                          "type": "uint256"
                        },
                        "id": 4533,
                        "name": "ElementaryTypeName",
                        "src": "15852:4:12"
                      }
                    ],
                    "id": 4534,
                    "name": "VariableDeclaration",
                    "src": "15852:11:12"
                  }
                ],
                "id": 4535,
                "name": "ParameterList",
                "src": "15817:52:12"
              },
              {
                "children": [
                  {
                    "attributes": {
                      "constant": false,
                      "name": "",
                      "scope": 4625,
                      "stateVariable": false,
                      "storageLocation": "default",
                      "type": "uint256",
                      "value": null,
                      "visibility": "internal"
                    },
                    "children": [
                      {
                        "attributes": {
                          "name": "uint",
                          "type": "uint256"
                        },
                        "id": 4536,
                        "name": "ElementaryTypeName",
                        "src": "15897:4:12"
                      }
                    ],
                    "id": 4537,
                    "name": "VariableDeclaration",
                    "src": "15897:4:12"
                  }
                ],
                "id": 4538,
                "name": "ParameterList",
                "src": "15896:6:12"
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
                              "isConstant": false,
                              "isLValue": true,
                              "isPure": false,
                              "lValueRequested": false,
                              "member_name": "length",
                              "referencedDeclaration": null,
                              "type": "uint256"
                            },
                            "children": [
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "overloadedDeclarations": [
                                    null
                                  ],
                                  "referencedDeclaration": 4532,
                                  "type": "struct CrowdfundingToken.Checkpoint storage ref[] storage pointer",
                                  "value": "checkpoints"
                                },
                                "id": 4539,
                                "name": "Identifier",
                                "src": "15917:11:12"
                              }
                            ],
                            "id": 4540,
                            "name": "MemberAccess",
                            "src": "15917:18:12"
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
                            "id": 4541,
                            "name": "Literal",
                            "src": "15939:1:12"
                          }
                        ],
                        "id": 4542,
                        "name": "BinaryOperation",
                        "src": "15917:23:12"
                      },
                      {
                        "attributes": {
                          "functionReturnParameters": 4538
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
                            "id": 4543,
                            "name": "Literal",
                            "src": "15949:1:12"
                          }
                        ],
                        "id": 4544,
                        "name": "Return",
                        "src": "15942:8:12"
                      }
                    ],
                    "id": 4545,
                    "name": "IfStatement",
                    "src": "15913:37:12"
                  },
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
                              "referencedDeclaration": 4534,
                              "type": "uint256",
                              "value": "_block"
                            },
                            "id": 4546,
                            "name": "Identifier",
                            "src": "16006:6:12"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "isConstant": false,
                              "isLValue": true,
                              "isPure": false,
                              "lValueRequested": false,
                              "member_name": "fromBlock",
                              "referencedDeclaration": 3797,
                              "type": "uint256"
                            },
                            "children": [
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "isConstant": false,
                                  "isLValue": true,
                                  "isPure": false,
                                  "lValueRequested": false,
                                  "type": "struct CrowdfundingToken.Checkpoint storage ref"
                                },
                                "children": [
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "overloadedDeclarations": [
                                        null
                                      ],
                                      "referencedDeclaration": 4532,
                                      "type": "struct CrowdfundingToken.Checkpoint storage ref[] storage pointer",
                                      "value": "checkpoints"
                                    },
                                    "id": 4547,
                                    "name": "Identifier",
                                    "src": "16016:11:12"
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
                                      "operator": "-",
                                      "type": "uint256"
                                    },
                                    "children": [
                                      {
                                        "attributes": {
                                          "argumentTypes": null,
                                          "isConstant": false,
                                          "isLValue": true,
                                          "isPure": false,
                                          "lValueRequested": false,
                                          "member_name": "length",
                                          "referencedDeclaration": null,
                                          "type": "uint256"
                                        },
                                        "children": [
                                          {
                                            "attributes": {
                                              "argumentTypes": null,
                                              "overloadedDeclarations": [
                                                null
                                              ],
                                              "referencedDeclaration": 4532,
                                              "type": "struct CrowdfundingToken.Checkpoint storage ref[] storage pointer",
                                              "value": "checkpoints"
                                            },
                                            "id": 4548,
                                            "name": "Identifier",
                                            "src": "16028:11:12"
                                          }
                                        ],
                                        "id": 4549,
                                        "name": "MemberAccess",
                                        "src": "16028:18:12"
                                      },
                                      {
                                        "attributes": {
                                          "argumentTypes": null,
                                          "hexvalue": "31",
                                          "isConstant": false,
                                          "isLValue": false,
                                          "isPure": true,
                                          "lValueRequested": false,
                                          "subdenomination": null,
                                          "token": "number",
                                          "type": "int_const 1",
                                          "value": "1"
                                        },
                                        "id": 4550,
                                        "name": "Literal",
                                        "src": "16047:1:12"
                                      }
                                    ],
                                    "id": 4551,
                                    "name": "BinaryOperation",
                                    "src": "16028:20:12"
                                  }
                                ],
                                "id": 4552,
                                "name": "IndexAccess",
                                "src": "16016:33:12"
                              }
                            ],
                            "id": 4553,
                            "name": "MemberAccess",
                            "src": "16016:43:12"
                          }
                        ],
                        "id": 4554,
                        "name": "BinaryOperation",
                        "src": "16006:53:12"
                      },
                      {
                        "attributes": {
                          "functionReturnParameters": 4538
                        },
                        "children": [
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "isConstant": false,
                              "isLValue": true,
                              "isPure": false,
                              "lValueRequested": false,
                              "member_name": "value",
                              "referencedDeclaration": 3799,
                              "type": "uint256"
                            },
                            "children": [
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "isConstant": false,
                                  "isLValue": true,
                                  "isPure": false,
                                  "lValueRequested": false,
                                  "type": "struct CrowdfundingToken.Checkpoint storage ref"
                                },
                                "children": [
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "overloadedDeclarations": [
                                        null
                                      ],
                                      "referencedDeclaration": 4532,
                                      "type": "struct CrowdfundingToken.Checkpoint storage ref[] storage pointer",
                                      "value": "checkpoints"
                                    },
                                    "id": 4555,
                                    "name": "Identifier",
                                    "src": "16080:11:12"
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
                                      "operator": "-",
                                      "type": "uint256"
                                    },
                                    "children": [
                                      {
                                        "attributes": {
                                          "argumentTypes": null,
                                          "isConstant": false,
                                          "isLValue": true,
                                          "isPure": false,
                                          "lValueRequested": false,
                                          "member_name": "length",
                                          "referencedDeclaration": null,
                                          "type": "uint256"
                                        },
                                        "children": [
                                          {
                                            "attributes": {
                                              "argumentTypes": null,
                                              "overloadedDeclarations": [
                                                null
                                              ],
                                              "referencedDeclaration": 4532,
                                              "type": "struct CrowdfundingToken.Checkpoint storage ref[] storage pointer",
                                              "value": "checkpoints"
                                            },
                                            "id": 4556,
                                            "name": "Identifier",
                                            "src": "16092:11:12"
                                          }
                                        ],
                                        "id": 4557,
                                        "name": "MemberAccess",
                                        "src": "16092:18:12"
                                      },
                                      {
                                        "attributes": {
                                          "argumentTypes": null,
                                          "hexvalue": "31",
                                          "isConstant": false,
                                          "isLValue": false,
                                          "isPure": true,
                                          "lValueRequested": false,
                                          "subdenomination": null,
                                          "token": "number",
                                          "type": "int_const 1",
                                          "value": "1"
                                        },
                                        "id": 4558,
                                        "name": "Literal",
                                        "src": "16111:1:12"
                                      }
                                    ],
                                    "id": 4559,
                                    "name": "BinaryOperation",
                                    "src": "16092:20:12"
                                  }
                                ],
                                "id": 4560,
                                "name": "IndexAccess",
                                "src": "16080:33:12"
                              }
                            ],
                            "id": 4561,
                            "name": "MemberAccess",
                            "src": "16080:39:12"
                          }
                        ],
                        "id": 4562,
                        "name": "Return",
                        "src": "16073:46:12"
                      }
                    ],
                    "id": 4563,
                    "name": "IfStatement",
                    "src": "16002:117:12"
                  },
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
                          "operator": "<",
                          "type": "bool"
                        },
                        "children": [
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4534,
                              "type": "uint256",
                              "value": "_block"
                            },
                            "id": 4564,
                            "name": "Identifier",
                            "src": "16133:6:12"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "isConstant": false,
                              "isLValue": true,
                              "isPure": false,
                              "lValueRequested": false,
                              "member_name": "fromBlock",
                              "referencedDeclaration": 3797,
                              "type": "uint256"
                            },
                            "children": [
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "isConstant": false,
                                  "isLValue": true,
                                  "isPure": false,
                                  "lValueRequested": false,
                                  "type": "struct CrowdfundingToken.Checkpoint storage ref"
                                },
                                "children": [
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "overloadedDeclarations": [
                                        null
                                      ],
                                      "referencedDeclaration": 4532,
                                      "type": "struct CrowdfundingToken.Checkpoint storage ref[] storage pointer",
                                      "value": "checkpoints"
                                    },
                                    "id": 4565,
                                    "name": "Identifier",
                                    "src": "16142:11:12"
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
                                    "id": 4566,
                                    "name": "Literal",
                                    "src": "16154:1:12"
                                  }
                                ],
                                "id": 4567,
                                "name": "IndexAccess",
                                "src": "16142:14:12"
                              }
                            ],
                            "id": 4568,
                            "name": "MemberAccess",
                            "src": "16142:24:12"
                          }
                        ],
                        "id": 4569,
                        "name": "BinaryOperation",
                        "src": "16133:33:12"
                      },
                      {
                        "attributes": {
                          "functionReturnParameters": 4538
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
                            "id": 4570,
                            "name": "Literal",
                            "src": "16175:1:12"
                          }
                        ],
                        "id": 4571,
                        "name": "Return",
                        "src": "16168:8:12"
                      }
                    ],
                    "id": 4572,
                    "name": "IfStatement",
                    "src": "16129:47:12"
                  },
                  {
                    "attributes": {
                      "assignments": [
                        4574
                      ]
                    },
                    "children": [
                      {
                        "attributes": {
                          "constant": false,
                          "name": "min",
                          "scope": 4625,
                          "stateVariable": false,
                          "storageLocation": "default",
                          "type": "uint256",
                          "value": null,
                          "visibility": "internal"
                        },
                        "children": [
                          {
                            "attributes": {
                              "name": "uint",
                              "type": "uint256"
                            },
                            "id": 4573,
                            "name": "ElementaryTypeName",
                            "src": "16238:4:12"
                          }
                        ],
                        "id": 4574,
                        "name": "VariableDeclaration",
                        "src": "16238:8:12"
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
                        "id": 4575,
                        "name": "Literal",
                        "src": "16249:1:12"
                      }
                    ],
                    "id": 4576,
                    "name": "VariableDeclarationStatement",
                    "src": "16238:12:12"
                  },
                  {
                    "attributes": {
                      "assignments": [
                        4578
                      ]
                    },
                    "children": [
                      {
                        "attributes": {
                          "constant": false,
                          "name": "max",
                          "scope": 4625,
                          "stateVariable": false,
                          "storageLocation": "default",
                          "type": "uint256",
                          "value": null,
                          "visibility": "internal"
                        },
                        "children": [
                          {
                            "attributes": {
                              "name": "uint",
                              "type": "uint256"
                            },
                            "id": 4577,
                            "name": "ElementaryTypeName",
                            "src": "16260:4:12"
                          }
                        ],
                        "id": 4578,
                        "name": "VariableDeclaration",
                        "src": "16260:8:12"
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
                          "operator": "-",
                          "type": "uint256"
                        },
                        "children": [
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "isConstant": false,
                              "isLValue": true,
                              "isPure": false,
                              "lValueRequested": false,
                              "member_name": "length",
                              "referencedDeclaration": null,
                              "type": "uint256"
                            },
                            "children": [
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "overloadedDeclarations": [
                                    null
                                  ],
                                  "referencedDeclaration": 4532,
                                  "type": "struct CrowdfundingToken.Checkpoint storage ref[] storage pointer",
                                  "value": "checkpoints"
                                },
                                "id": 4579,
                                "name": "Identifier",
                                "src": "16271:11:12"
                              }
                            ],
                            "id": 4580,
                            "name": "MemberAccess",
                            "src": "16271:18:12"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "hexvalue": "31",
                              "isConstant": false,
                              "isLValue": false,
                              "isPure": true,
                              "lValueRequested": false,
                              "subdenomination": null,
                              "token": "number",
                              "type": "int_const 1",
                              "value": "1"
                            },
                            "id": 4581,
                            "name": "Literal",
                            "src": "16290:1:12"
                          }
                        ],
                        "id": 4582,
                        "name": "BinaryOperation",
                        "src": "16271:20:12"
                      }
                    ],
                    "id": 4583,
                    "name": "VariableDeclarationStatement",
                    "src": "16260:31:12"
                  },
                  {
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
                          "operator": ">",
                          "type": "bool"
                        },
                        "children": [
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4578,
                              "type": "uint256",
                              "value": "max"
                            },
                            "id": 4584,
                            "name": "Identifier",
                            "src": "16308:3:12"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4574,
                              "type": "uint256",
                              "value": "min"
                            },
                            "id": 4585,
                            "name": "Identifier",
                            "src": "16314:3:12"
                          }
                        ],
                        "id": 4586,
                        "name": "BinaryOperation",
                        "src": "16308:9:12"
                      },
                      {
                        "children": [
                          {
                            "attributes": {
                              "assignments": [
                                4588
                              ]
                            },
                            "children": [
                              {
                                "attributes": {
                                  "constant": false,
                                  "name": "mid",
                                  "scope": 4625,
                                  "stateVariable": false,
                                  "storageLocation": "default",
                                  "type": "uint256",
                                  "value": null,
                                  "visibility": "internal"
                                },
                                "children": [
                                  {
                                    "attributes": {
                                      "name": "uint",
                                      "type": "uint256"
                                    },
                                    "id": 4587,
                                    "name": "ElementaryTypeName",
                                    "src": "16333:4:12"
                                  }
                                ],
                                "id": 4588,
                                "name": "VariableDeclaration",
                                "src": "16333:8:12"
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
                                      "isConstant": false,
                                      "isInlineArray": false,
                                      "isLValue": false,
                                      "isPure": false,
                                      "lValueRequested": false,
                                      "type": "uint256"
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
                                          "operator": "+",
                                          "type": "uint256"
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
                                                  "referencedDeclaration": 4578,
                                                  "type": "uint256",
                                                  "value": "max"
                                                },
                                                "id": 4589,
                                                "name": "Identifier",
                                                "src": "16345:3:12"
                                              },
                                              {
                                                "attributes": {
                                                  "argumentTypes": null,
                                                  "overloadedDeclarations": [
                                                    null
                                                  ],
                                                  "referencedDeclaration": 4574,
                                                  "type": "uint256",
                                                  "value": "min"
                                                },
                                                "id": 4590,
                                                "name": "Identifier",
                                                "src": "16351:3:12"
                                              }
                                            ],
                                            "id": 4591,
                                            "name": "BinaryOperation",
                                            "src": "16345:9:12"
                                          },
                                          {
                                            "attributes": {
                                              "argumentTypes": null,
                                              "hexvalue": "31",
                                              "isConstant": false,
                                              "isLValue": false,
                                              "isPure": true,
                                              "lValueRequested": false,
                                              "subdenomination": null,
                                              "token": "number",
                                              "type": "int_const 1",
                                              "value": "1"
                                            },
                                            "id": 4592,
                                            "name": "Literal",
                                            "src": "16357:1:12"
                                          }
                                        ],
                                        "id": 4593,
                                        "name": "BinaryOperation",
                                        "src": "16345:13:12"
                                      }
                                    ],
                                    "id": 4594,
                                    "name": "TupleExpression",
                                    "src": "16344:15:12"
                                  },
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "hexvalue": "32",
                                      "isConstant": false,
                                      "isLValue": false,
                                      "isPure": true,
                                      "lValueRequested": false,
                                      "subdenomination": null,
                                      "token": "number",
                                      "type": "int_const 2",
                                      "value": "2"
                                    },
                                    "id": 4595,
                                    "name": "Literal",
                                    "src": "16361:1:12"
                                  }
                                ],
                                "id": 4596,
                                "name": "BinaryOperation",
                                "src": "16344:18:12"
                              }
                            ],
                            "id": 4597,
                            "name": "VariableDeclarationStatement",
                            "src": "16333:29:12"
                          },
                          {
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
                                  "operator": "<=",
                                  "type": "bool"
                                },
                                "children": [
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "isConstant": false,
                                      "isLValue": true,
                                      "isPure": false,
                                      "lValueRequested": false,
                                      "member_name": "fromBlock",
                                      "referencedDeclaration": 3797,
                                      "type": "uint256"
                                    },
                                    "children": [
                                      {
                                        "attributes": {
                                          "argumentTypes": null,
                                          "isConstant": false,
                                          "isLValue": true,
                                          "isPure": false,
                                          "lValueRequested": false,
                                          "type": "struct CrowdfundingToken.Checkpoint storage ref"
                                        },
                                        "children": [
                                          {
                                            "attributes": {
                                              "argumentTypes": null,
                                              "overloadedDeclarations": [
                                                null
                                              ],
                                              "referencedDeclaration": 4532,
                                              "type": "struct CrowdfundingToken.Checkpoint storage ref[] storage pointer",
                                              "value": "checkpoints"
                                            },
                                            "id": 4598,
                                            "name": "Identifier",
                                            "src": "16380:11:12"
                                          },
                                          {
                                            "attributes": {
                                              "argumentTypes": null,
                                              "overloadedDeclarations": [
                                                null
                                              ],
                                              "referencedDeclaration": 4588,
                                              "type": "uint256",
                                              "value": "mid"
                                            },
                                            "id": 4599,
                                            "name": "Identifier",
                                            "src": "16392:3:12"
                                          }
                                        ],
                                        "id": 4600,
                                        "name": "IndexAccess",
                                        "src": "16380:16:12"
                                      }
                                    ],
                                    "id": 4601,
                                    "name": "MemberAccess",
                                    "src": "16380:26:12"
                                  },
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "overloadedDeclarations": [
                                        null
                                      ],
                                      "referencedDeclaration": 4534,
                                      "type": "uint256",
                                      "value": "_block"
                                    },
                                    "id": 4602,
                                    "name": "Identifier",
                                    "src": "16408:6:12"
                                  }
                                ],
                                "id": 4603,
                                "name": "BinaryOperation",
                                "src": "16380:34:12"
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
                                          "lValueRequested": false,
                                          "operator": "=",
                                          "type": "uint256"
                                        },
                                        "children": [
                                          {
                                            "attributes": {
                                              "argumentTypes": null,
                                              "overloadedDeclarations": [
                                                null
                                              ],
                                              "referencedDeclaration": 4574,
                                              "type": "uint256",
                                              "value": "min"
                                            },
                                            "id": 4604,
                                            "name": "Identifier",
                                            "src": "16434:3:12"
                                          },
                                          {
                                            "attributes": {
                                              "argumentTypes": null,
                                              "overloadedDeclarations": [
                                                null
                                              ],
                                              "referencedDeclaration": 4588,
                                              "type": "uint256",
                                              "value": "mid"
                                            },
                                            "id": 4605,
                                            "name": "Identifier",
                                            "src": "16440:3:12"
                                          }
                                        ],
                                        "id": 4606,
                                        "name": "Assignment",
                                        "src": "16434:9:12"
                                      }
                                    ],
                                    "id": 4607,
                                    "name": "ExpressionStatement",
                                    "src": "16434:9:12"
                                  }
                                ],
                                "id": 4608,
                                "name": "Block",
                                "src": "16416:42:12"
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
                                          "lValueRequested": false,
                                          "operator": "=",
                                          "type": "uint256"
                                        },
                                        "children": [
                                          {
                                            "attributes": {
                                              "argumentTypes": null,
                                              "overloadedDeclarations": [
                                                null
                                              ],
                                              "referencedDeclaration": 4578,
                                              "type": "uint256",
                                              "value": "max"
                                            },
                                            "id": 4609,
                                            "name": "Identifier",
                                            "src": "16482:3:12"
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
                                                  "referencedDeclaration": 4588,
                                                  "type": "uint256",
                                                  "value": "mid"
                                                },
                                                "id": 4610,
                                                "name": "Identifier",
                                                "src": "16488:3:12"
                                              },
                                              {
                                                "attributes": {
                                                  "argumentTypes": null,
                                                  "hexvalue": "31",
                                                  "isConstant": false,
                                                  "isLValue": false,
                                                  "isPure": true,
                                                  "lValueRequested": false,
                                                  "subdenomination": null,
                                                  "token": "number",
                                                  "type": "int_const 1",
                                                  "value": "1"
                                                },
                                                "id": 4611,
                                                "name": "Literal",
                                                "src": "16492:1:12"
                                              }
                                            ],
                                            "id": 4612,
                                            "name": "BinaryOperation",
                                            "src": "16488:5:12"
                                          }
                                        ],
                                        "id": 4613,
                                        "name": "Assignment",
                                        "src": "16482:11:12"
                                      }
                                    ],
                                    "id": 4614,
                                    "name": "ExpressionStatement",
                                    "src": "16482:11:12"
                                  }
                                ],
                                "id": 4615,
                                "name": "Block",
                                "src": "16464:44:12"
                              }
                            ],
                            "id": 4616,
                            "name": "IfStatement",
                            "src": "16376:132:12"
                          }
                        ],
                        "id": 4617,
                        "name": "Block",
                        "src": "16319:199:12"
                      }
                    ],
                    "id": 4618,
                    "name": "WhileStatement",
                    "src": "16301:217:12"
                  },
                  {
                    "attributes": {
                      "functionReturnParameters": 4538
                    },
                    "children": [
                      {
                        "attributes": {
                          "argumentTypes": null,
                          "isConstant": false,
                          "isLValue": true,
                          "isPure": false,
                          "lValueRequested": false,
                          "member_name": "value",
                          "referencedDeclaration": 3799,
                          "type": "uint256"
                        },
                        "children": [
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "isConstant": false,
                              "isLValue": true,
                              "isPure": false,
                              "lValueRequested": false,
                              "type": "struct CrowdfundingToken.Checkpoint storage ref"
                            },
                            "children": [
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "overloadedDeclarations": [
                                    null
                                  ],
                                  "referencedDeclaration": 4532,
                                  "type": "struct CrowdfundingToken.Checkpoint storage ref[] storage pointer",
                                  "value": "checkpoints"
                                },
                                "id": 4619,
                                "name": "Identifier",
                                "src": "16534:11:12"
                              },
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "overloadedDeclarations": [
                                    null
                                  ],
                                  "referencedDeclaration": 4574,
                                  "type": "uint256",
                                  "value": "min"
                                },
                                "id": 4620,
                                "name": "Identifier",
                                "src": "16546:3:12"
                              }
                            ],
                            "id": 4621,
                            "name": "IndexAccess",
                            "src": "16534:16:12"
                          }
                        ],
                        "id": 4622,
                        "name": "MemberAccess",
                        "src": "16534:22:12"
                      }
                    ],
                    "id": 4623,
                    "name": "Return",
                    "src": "16527:29:12"
                  }
                ],
                "id": 4624,
                "name": "Block",
                "src": "15903:660:12"
              }
            ],
            "id": 4625,
            "name": "FunctionDefinition",
            "src": "15798:765:12"
          },
          {
            "attributes": {
              "constant": false,
              "implemented": true,
              "isConstructor": false,
              "modifiers": [
                null
              ],
              "name": "updateValueAtNow",
              "payable": false,
              "scope": 4821,
              "stateMutability": "nonpayable",
              "superFunction": null,
              "visibility": "internal"
            },
            "children": [
              {
                "children": [
                  {
                    "attributes": {
                      "constant": false,
                      "name": "checkpoints",
                      "scope": 4696,
                      "stateVariable": false,
                      "storageLocation": "storage",
                      "type": "struct CrowdfundingToken.Checkpoint storage ref[] storage pointer",
                      "value": null,
                      "visibility": "internal"
                    },
                    "children": [
                      {
                        "attributes": {
                          "length": null,
                          "type": "struct CrowdfundingToken.Checkpoint storage ref[] storage pointer"
                        },
                        "children": [
                          {
                            "attributes": {
                              "contractScope": null,
                              "name": "Checkpoint",
                              "referencedDeclaration": 3800,
                              "type": "struct CrowdfundingToken.Checkpoint storage pointer"
                            },
                            "id": 4626,
                            "name": "UserDefinedTypeName",
                            "src": "16774:10:12"
                          }
                        ],
                        "id": 4627,
                        "name": "ArrayTypeName",
                        "src": "16774:12:12"
                      }
                    ],
                    "id": 4628,
                    "name": "VariableDeclaration",
                    "src": "16774:32:12"
                  },
                  {
                    "attributes": {
                      "constant": false,
                      "name": "_value",
                      "scope": 4696,
                      "stateVariable": false,
                      "storageLocation": "default",
                      "type": "uint256",
                      "value": null,
                      "visibility": "internal"
                    },
                    "children": [
                      {
                        "attributes": {
                          "name": "uint",
                          "type": "uint256"
                        },
                        "id": 4629,
                        "name": "ElementaryTypeName",
                        "src": "16808:4:12"
                      }
                    ],
                    "id": 4630,
                    "name": "VariableDeclaration",
                    "src": "16808:11:12"
                  }
                ],
                "id": 4631,
                "name": "ParameterList",
                "src": "16773:52:12"
              },
              {
                "attributes": {
                  "parameters": [
                    null
                  ]
                },
                "children": [],
                "id": 4632,
                "name": "ParameterList",
                "src": "16836:0:12"
              },
              {
                "children": [
                  {
                    "children": [
                      {
                        "attributes": {
                          "argumentTypes": null,
                          "commonType": {
                            "typeIdentifier": "t_bool",
                            "typeString": "bool"
                          },
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": false,
                          "lValueRequested": false,
                          "operator": "||",
                          "type": "bool"
                        },
                        "children": [
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "isConstant": false,
                              "isInlineArray": false,
                              "isLValue": false,
                              "isPure": false,
                              "lValueRequested": false,
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
                                  "operator": "==",
                                  "type": "bool"
                                },
                                "children": [
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "isConstant": false,
                                      "isLValue": true,
                                      "isPure": false,
                                      "lValueRequested": false,
                                      "member_name": "length",
                                      "referencedDeclaration": null,
                                      "type": "uint256"
                                    },
                                    "children": [
                                      {
                                        "attributes": {
                                          "argumentTypes": null,
                                          "overloadedDeclarations": [
                                            null
                                          ],
                                          "referencedDeclaration": 4628,
                                          "type": "struct CrowdfundingToken.Checkpoint storage ref[] storage pointer",
                                          "value": "checkpoints"
                                        },
                                        "id": 4633,
                                        "name": "Identifier",
                                        "src": "16851:11:12"
                                      }
                                    ],
                                    "id": 4634,
                                    "name": "MemberAccess",
                                    "src": "16851:18:12"
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
                                    "id": 4635,
                                    "name": "Literal",
                                    "src": "16873:1:12"
                                  }
                                ],
                                "id": 4636,
                                "name": "BinaryOperation",
                                "src": "16851:23:12"
                              }
                            ],
                            "id": 4637,
                            "name": "TupleExpression",
                            "src": "16850:25:12"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "isConstant": false,
                              "isInlineArray": false,
                              "isLValue": false,
                              "isPure": false,
                              "lValueRequested": false,
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
                                  "operator": "<",
                                  "type": "bool"
                                },
                                "children": [
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "isConstant": false,
                                      "isLValue": true,
                                      "isPure": false,
                                      "lValueRequested": false,
                                      "member_name": "fromBlock",
                                      "referencedDeclaration": 3797,
                                      "type": "uint256"
                                    },
                                    "children": [
                                      {
                                        "attributes": {
                                          "argumentTypes": null,
                                          "isConstant": false,
                                          "isLValue": true,
                                          "isPure": false,
                                          "lValueRequested": false,
                                          "type": "struct CrowdfundingToken.Checkpoint storage ref"
                                        },
                                        "children": [
                                          {
                                            "attributes": {
                                              "argumentTypes": null,
                                              "overloadedDeclarations": [
                                                null
                                              ],
                                              "referencedDeclaration": 4628,
                                              "type": "struct CrowdfundingToken.Checkpoint storage ref[] storage pointer",
                                              "value": "checkpoints"
                                            },
                                            "id": 4638,
                                            "name": "Identifier",
                                            "src": "16888:11:12"
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
                                              "operator": "-",
                                              "type": "uint256"
                                            },
                                            "children": [
                                              {
                                                "attributes": {
                                                  "argumentTypes": null,
                                                  "isConstant": false,
                                                  "isLValue": true,
                                                  "isPure": false,
                                                  "lValueRequested": false,
                                                  "member_name": "length",
                                                  "referencedDeclaration": null,
                                                  "type": "uint256"
                                                },
                                                "children": [
                                                  {
                                                    "attributes": {
                                                      "argumentTypes": null,
                                                      "overloadedDeclarations": [
                                                        null
                                                      ],
                                                      "referencedDeclaration": 4628,
                                                      "type": "struct CrowdfundingToken.Checkpoint storage ref[] storage pointer",
                                                      "value": "checkpoints"
                                                    },
                                                    "id": 4639,
                                                    "name": "Identifier",
                                                    "src": "16900:11:12"
                                                  }
                                                ],
                                                "id": 4640,
                                                "name": "MemberAccess",
                                                "src": "16900:18:12"
                                              },
                                              {
                                                "attributes": {
                                                  "argumentTypes": null,
                                                  "hexvalue": "31",
                                                  "isConstant": false,
                                                  "isLValue": false,
                                                  "isPure": true,
                                                  "lValueRequested": false,
                                                  "subdenomination": null,
                                                  "token": "number",
                                                  "type": "int_const 1",
                                                  "value": "1"
                                                },
                                                "id": 4641,
                                                "name": "Literal",
                                                "src": "16920:1:12"
                                              }
                                            ],
                                            "id": 4642,
                                            "name": "BinaryOperation",
                                            "src": "16900:21:12"
                                          }
                                        ],
                                        "id": 4643,
                                        "name": "IndexAccess",
                                        "src": "16888:34:12"
                                      }
                                    ],
                                    "id": 4644,
                                    "name": "MemberAccess",
                                    "src": "16888:44:12"
                                  },
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "isConstant": false,
                                      "isLValue": false,
                                      "isPure": false,
                                      "lValueRequested": false,
                                      "member_name": "number",
                                      "referencedDeclaration": null,
                                      "type": "uint256"
                                    },
                                    "children": [
                                      {
                                        "attributes": {
                                          "argumentTypes": null,
                                          "overloadedDeclarations": [
                                            null
                                          ],
                                          "referencedDeclaration": 11799,
                                          "type": "block",
                                          "value": "block"
                                        },
                                        "id": 4645,
                                        "name": "Identifier",
                                        "src": "16935:5:12"
                                      }
                                    ],
                                    "id": 4646,
                                    "name": "MemberAccess",
                                    "src": "16935:12:12"
                                  }
                                ],
                                "id": 4647,
                                "name": "BinaryOperation",
                                "src": "16888:59:12"
                              }
                            ],
                            "id": 4648,
                            "name": "TupleExpression",
                            "src": "16887:61:12"
                          }
                        ],
                        "id": 4649,
                        "name": "BinaryOperation",
                        "src": "16850:98:12"
                      },
                      {
                        "children": [
                          {
                            "attributes": {
                              "assignments": [
                                4651
                              ]
                            },
                            "children": [
                              {
                                "attributes": {
                                  "constant": false,
                                  "name": "newCheckPoint",
                                  "scope": 4696,
                                  "stateVariable": false,
                                  "storageLocation": "storage",
                                  "type": "struct CrowdfundingToken.Checkpoint storage pointer",
                                  "value": null,
                                  "visibility": "internal"
                                },
                                "children": [
                                  {
                                    "attributes": {
                                      "contractScope": null,
                                      "name": "Checkpoint",
                                      "referencedDeclaration": 3800,
                                      "type": "struct CrowdfundingToken.Checkpoint storage pointer"
                                    },
                                    "id": 4650,
                                    "name": "UserDefinedTypeName",
                                    "src": "16967:10:12"
                                  }
                                ],
                                "id": 4651,
                                "name": "VariableDeclaration",
                                "src": "16967:32:12"
                              },
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "isConstant": false,
                                  "isLValue": true,
                                  "isPure": false,
                                  "lValueRequested": false,
                                  "type": "struct CrowdfundingToken.Checkpoint storage ref"
                                },
                                "children": [
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "overloadedDeclarations": [
                                        null
                                      ],
                                      "referencedDeclaration": 4628,
                                      "type": "struct CrowdfundingToken.Checkpoint storage ref[] storage pointer",
                                      "value": "checkpoints"
                                    },
                                    "id": 4652,
                                    "name": "Identifier",
                                    "src": "17002:11:12"
                                  },
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "isConstant": false,
                                      "isLValue": false,
                                      "isPure": false,
                                      "lValueRequested": false,
                                      "operator": "++",
                                      "prefix": false,
                                      "type": "uint256"
                                    },
                                    "children": [
                                      {
                                        "attributes": {
                                          "argumentTypes": null,
                                          "isConstant": false,
                                          "isLValue": true,
                                          "isPure": false,
                                          "lValueRequested": true,
                                          "member_name": "length",
                                          "referencedDeclaration": null,
                                          "type": "uint256"
                                        },
                                        "children": [
                                          {
                                            "attributes": {
                                              "argumentTypes": null,
                                              "overloadedDeclarations": [
                                                null
                                              ],
                                              "referencedDeclaration": 4628,
                                              "type": "struct CrowdfundingToken.Checkpoint storage ref[] storage pointer",
                                              "value": "checkpoints"
                                            },
                                            "id": 4653,
                                            "name": "Identifier",
                                            "src": "17015:11:12"
                                          }
                                        ],
                                        "id": 4654,
                                        "name": "MemberAccess",
                                        "src": "17015:18:12"
                                      }
                                    ],
                                    "id": 4655,
                                    "name": "UnaryOperation",
                                    "src": "17015:20:12"
                                  }
                                ],
                                "id": 4656,
                                "name": "IndexAccess",
                                "src": "17002:35:12"
                              }
                            ],
                            "id": 4657,
                            "name": "VariableDeclarationStatement",
                            "src": "16967:70:12"
                          },
                          {
                            "children": [
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "isConstant": false,
                                  "isLValue": false,
                                  "isPure": false,
                                  "lValueRequested": false,
                                  "operator": "=",
                                  "type": "uint256"
                                },
                                "children": [
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "isConstant": false,
                                      "isLValue": true,
                                      "isPure": false,
                                      "lValueRequested": true,
                                      "member_name": "fromBlock",
                                      "referencedDeclaration": 3797,
                                      "type": "uint256"
                                    },
                                    "children": [
                                      {
                                        "attributes": {
                                          "argumentTypes": null,
                                          "overloadedDeclarations": [
                                            null
                                          ],
                                          "referencedDeclaration": 4651,
                                          "type": "struct CrowdfundingToken.Checkpoint storage pointer",
                                          "value": "newCheckPoint"
                                        },
                                        "id": 4658,
                                        "name": "Identifier",
                                        "src": "17054:13:12"
                                      }
                                    ],
                                    "id": 4660,
                                    "name": "MemberAccess",
                                    "src": "17054:23:12"
                                  },
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
                                      "type": "uint256",
                                      "type_conversion": true
                                    },
                                    "children": [
                                      {
                                        "attributes": {
                                          "argumentTypes": [
                                            {
                                              "typeIdentifier": "t_uint256",
                                              "typeString": "uint256"
                                            }
                                          ],
                                          "isConstant": false,
                                          "isLValue": false,
                                          "isPure": true,
                                          "lValueRequested": false,
                                          "type": "type(uint256)",
                                          "value": "uint"
                                        },
                                        "id": 4661,
                                        "name": "ElementaryTypeNameExpression",
                                        "src": "17081:4:12"
                                      },
                                      {
                                        "attributes": {
                                          "argumentTypes": null,
                                          "isConstant": false,
                                          "isLValue": false,
                                          "isPure": false,
                                          "lValueRequested": false,
                                          "member_name": "number",
                                          "referencedDeclaration": null,
                                          "type": "uint256"
                                        },
                                        "children": [
                                          {
                                            "attributes": {
                                              "argumentTypes": null,
                                              "overloadedDeclarations": [
                                                null
                                              ],
                                              "referencedDeclaration": 11799,
                                              "type": "block",
                                              "value": "block"
                                            },
                                            "id": 4662,
                                            "name": "Identifier",
                                            "src": "17086:5:12"
                                          }
                                        ],
                                        "id": 4663,
                                        "name": "MemberAccess",
                                        "src": "17086:12:12"
                                      }
                                    ],
                                    "id": 4664,
                                    "name": "FunctionCall",
                                    "src": "17081:18:12"
                                  }
                                ],
                                "id": 4665,
                                "name": "Assignment",
                                "src": "17054:45:12"
                              }
                            ],
                            "id": 4666,
                            "name": "ExpressionStatement",
                            "src": "17054:45:12"
                          },
                          {
                            "children": [
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "isConstant": false,
                                  "isLValue": false,
                                  "isPure": false,
                                  "lValueRequested": false,
                                  "operator": "=",
                                  "type": "uint256"
                                },
                                "children": [
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "isConstant": false,
                                      "isLValue": true,
                                      "isPure": false,
                                      "lValueRequested": true,
                                      "member_name": "value",
                                      "referencedDeclaration": 3799,
                                      "type": "uint256"
                                    },
                                    "children": [
                                      {
                                        "attributes": {
                                          "argumentTypes": null,
                                          "overloadedDeclarations": [
                                            null
                                          ],
                                          "referencedDeclaration": 4651,
                                          "type": "struct CrowdfundingToken.Checkpoint storage pointer",
                                          "value": "newCheckPoint"
                                        },
                                        "id": 4667,
                                        "name": "Identifier",
                                        "src": "17116:13:12"
                                      }
                                    ],
                                    "id": 4669,
                                    "name": "MemberAccess",
                                    "src": "17116:19:12"
                                  },
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
                                      "type": "uint256",
                                      "type_conversion": true
                                    },
                                    "children": [
                                      {
                                        "attributes": {
                                          "argumentTypes": [
                                            {
                                              "typeIdentifier": "t_uint256",
                                              "typeString": "uint256"
                                            }
                                          ],
                                          "isConstant": false,
                                          "isLValue": false,
                                          "isPure": true,
                                          "lValueRequested": false,
                                          "type": "type(uint256)",
                                          "value": "uint"
                                        },
                                        "id": 4670,
                                        "name": "ElementaryTypeNameExpression",
                                        "src": "17138:4:12"
                                      },
                                      {
                                        "attributes": {
                                          "argumentTypes": null,
                                          "overloadedDeclarations": [
                                            null
                                          ],
                                          "referencedDeclaration": 4630,
                                          "type": "uint256",
                                          "value": "_value"
                                        },
                                        "id": 4671,
                                        "name": "Identifier",
                                        "src": "17143:6:12"
                                      }
                                    ],
                                    "id": 4672,
                                    "name": "FunctionCall",
                                    "src": "17138:12:12"
                                  }
                                ],
                                "id": 4673,
                                "name": "Assignment",
                                "src": "17116:34:12"
                              }
                            ],
                            "id": 4674,
                            "name": "ExpressionStatement",
                            "src": "17116:34:12"
                          }
                        ],
                        "id": 4675,
                        "name": "Block",
                        "src": "16950:214:12"
                      },
                      {
                        "children": [
                          {
                            "attributes": {
                              "assignments": [
                                4677
                              ]
                            },
                            "children": [
                              {
                                "attributes": {
                                  "constant": false,
                                  "name": "oldCheckPoint",
                                  "scope": 4696,
                                  "stateVariable": false,
                                  "storageLocation": "storage",
                                  "type": "struct CrowdfundingToken.Checkpoint storage pointer",
                                  "value": null,
                                  "visibility": "internal"
                                },
                                "children": [
                                  {
                                    "attributes": {
                                      "contractScope": null,
                                      "name": "Checkpoint",
                                      "referencedDeclaration": 3800,
                                      "type": "struct CrowdfundingToken.Checkpoint storage pointer"
                                    },
                                    "id": 4676,
                                    "name": "UserDefinedTypeName",
                                    "src": "17187:10:12"
                                  }
                                ],
                                "id": 4677,
                                "name": "VariableDeclaration",
                                "src": "17187:32:12"
                              },
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "isConstant": false,
                                  "isLValue": true,
                                  "isPure": false,
                                  "lValueRequested": false,
                                  "type": "struct CrowdfundingToken.Checkpoint storage ref"
                                },
                                "children": [
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "overloadedDeclarations": [
                                        null
                                      ],
                                      "referencedDeclaration": 4628,
                                      "type": "struct CrowdfundingToken.Checkpoint storage ref[] storage pointer",
                                      "value": "checkpoints"
                                    },
                                    "id": 4678,
                                    "name": "Identifier",
                                    "src": "17222:11:12"
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
                                      "operator": "-",
                                      "type": "uint256"
                                    },
                                    "children": [
                                      {
                                        "attributes": {
                                          "argumentTypes": null,
                                          "isConstant": false,
                                          "isLValue": true,
                                          "isPure": false,
                                          "lValueRequested": false,
                                          "member_name": "length",
                                          "referencedDeclaration": null,
                                          "type": "uint256"
                                        },
                                        "children": [
                                          {
                                            "attributes": {
                                              "argumentTypes": null,
                                              "overloadedDeclarations": [
                                                null
                                              ],
                                              "referencedDeclaration": 4628,
                                              "type": "struct CrowdfundingToken.Checkpoint storage ref[] storage pointer",
                                              "value": "checkpoints"
                                            },
                                            "id": 4679,
                                            "name": "Identifier",
                                            "src": "17234:11:12"
                                          }
                                        ],
                                        "id": 4680,
                                        "name": "MemberAccess",
                                        "src": "17234:18:12"
                                      },
                                      {
                                        "attributes": {
                                          "argumentTypes": null,
                                          "hexvalue": "31",
                                          "isConstant": false,
                                          "isLValue": false,
                                          "isPure": true,
                                          "lValueRequested": false,
                                          "subdenomination": null,
                                          "token": "number",
                                          "type": "int_const 1",
                                          "value": "1"
                                        },
                                        "id": 4681,
                                        "name": "Literal",
                                        "src": "17253:1:12"
                                      }
                                    ],
                                    "id": 4682,
                                    "name": "BinaryOperation",
                                    "src": "17234:20:12"
                                  }
                                ],
                                "id": 4683,
                                "name": "IndexAccess",
                                "src": "17222:33:12"
                              }
                            ],
                            "id": 4684,
                            "name": "VariableDeclarationStatement",
                            "src": "17187:68:12"
                          },
                          {
                            "children": [
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "isConstant": false,
                                  "isLValue": false,
                                  "isPure": false,
                                  "lValueRequested": false,
                                  "operator": "=",
                                  "type": "uint256"
                                },
                                "children": [
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "isConstant": false,
                                      "isLValue": true,
                                      "isPure": false,
                                      "lValueRequested": true,
                                      "member_name": "value",
                                      "referencedDeclaration": 3799,
                                      "type": "uint256"
                                    },
                                    "children": [
                                      {
                                        "attributes": {
                                          "argumentTypes": null,
                                          "overloadedDeclarations": [
                                            null
                                          ],
                                          "referencedDeclaration": 4677,
                                          "type": "struct CrowdfundingToken.Checkpoint storage pointer",
                                          "value": "oldCheckPoint"
                                        },
                                        "id": 4685,
                                        "name": "Identifier",
                                        "src": "17272:13:12"
                                      }
                                    ],
                                    "id": 4687,
                                    "name": "MemberAccess",
                                    "src": "17272:19:12"
                                  },
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
                                      "type": "uint256",
                                      "type_conversion": true
                                    },
                                    "children": [
                                      {
                                        "attributes": {
                                          "argumentTypes": [
                                            {
                                              "typeIdentifier": "t_uint256",
                                              "typeString": "uint256"
                                            }
                                          ],
                                          "isConstant": false,
                                          "isLValue": false,
                                          "isPure": true,
                                          "lValueRequested": false,
                                          "type": "type(uint256)",
                                          "value": "uint"
                                        },
                                        "id": 4688,
                                        "name": "ElementaryTypeNameExpression",
                                        "src": "17294:4:12"
                                      },
                                      {
                                        "attributes": {
                                          "argumentTypes": null,
                                          "overloadedDeclarations": [
                                            null
                                          ],
                                          "referencedDeclaration": 4630,
                                          "type": "uint256",
                                          "value": "_value"
                                        },
                                        "id": 4689,
                                        "name": "Identifier",
                                        "src": "17299:6:12"
                                      }
                                    ],
                                    "id": 4690,
                                    "name": "FunctionCall",
                                    "src": "17294:12:12"
                                  }
                                ],
                                "id": 4691,
                                "name": "Assignment",
                                "src": "17272:34:12"
                              }
                            ],
                            "id": 4692,
                            "name": "ExpressionStatement",
                            "src": "17272:34:12"
                          }
                        ],
                        "id": 4693,
                        "name": "Block",
                        "src": "17170:150:12"
                      }
                    ],
                    "id": 4694,
                    "name": "IfStatement",
                    "src": "16846:474:12"
                  }
                ],
                "id": 4695,
                "name": "Block",
                "src": "16836:490:12"
              }
            ],
            "id": 4696,
            "name": "FunctionDefinition",
            "src": "16748:578:12"
          },
          {
            "attributes": {
              "constant": true,
              "implemented": true,
              "isConstructor": false,
              "modifiers": [
                null
              ],
              "name": "isContract",
              "payable": false,
              "scope": 4821,
              "stateMutability": "view",
              "superFunction": null,
              "visibility": "internal"
            },
            "children": [
              {
                "children": [
                  {
                    "attributes": {
                      "constant": false,
                      "name": "_addr",
                      "scope": 4718,
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
                        "id": 4697,
                        "name": "ElementaryTypeName",
                        "src": "17517:7:12"
                      }
                    ],
                    "id": 4698,
                    "name": "VariableDeclaration",
                    "src": "17517:13:12"
                  }
                ],
                "id": 4699,
                "name": "ParameterList",
                "src": "17516:15:12"
              },
              {
                "children": [
                  {
                    "attributes": {
                      "constant": false,
                      "name": "",
                      "scope": 4718,
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
                        "id": 4700,
                        "name": "ElementaryTypeName",
                        "src": "17558:4:12"
                      }
                    ],
                    "id": 4701,
                    "name": "VariableDeclaration",
                    "src": "17558:4:12"
                  }
                ],
                "id": 4702,
                "name": "ParameterList",
                "src": "17557:6:12"
              },
              {
                "children": [
                  {
                    "attributes": {
                      "assignments": [
                        null
                      ],
                      "initialValue": null
                    },
                    "children": [
                      {
                        "attributes": {
                          "constant": false,
                          "name": "size",
                          "scope": 4718,
                          "stateVariable": false,
                          "storageLocation": "default",
                          "type": "uint256",
                          "value": null,
                          "visibility": "internal"
                        },
                        "children": [
                          {
                            "attributes": {
                              "name": "uint",
                              "type": "uint256"
                            },
                            "id": 4703,
                            "name": "ElementaryTypeName",
                            "src": "17574:4:12"
                          }
                        ],
                        "id": 4704,
                        "name": "VariableDeclaration",
                        "src": "17574:9:12"
                      }
                    ],
                    "id": 4705,
                    "name": "VariableDeclarationStatement",
                    "src": "17574:9:12"
                  },
                  {
                    "attributes": {
                      "falseBody": null
                    },
                    "children": [
                      {
                        "attributes": {
                          "argumentTypes": null,
                          "commonType": {
                            "typeIdentifier": "t_address",
                            "typeString": "address"
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
                              "referencedDeclaration": 4698,
                              "type": "address",
                              "value": "_addr"
                            },
                            "id": 4706,
                            "name": "Identifier",
                            "src": "17597:5:12"
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
                            "id": 4707,
                            "name": "Literal",
                            "src": "17606:1:12"
                          }
                        ],
                        "id": 4708,
                        "name": "BinaryOperation",
                        "src": "17597:10:12"
                      },
                      {
                        "attributes": {
                          "functionReturnParameters": 4702
                        },
                        "children": [
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "hexvalue": "66616c7365",
                              "isConstant": false,
                              "isLValue": false,
                              "isPure": true,
                              "lValueRequested": false,
                              "subdenomination": null,
                              "token": "bool",
                              "type": "bool",
                              "value": "false"
                            },
                            "id": 4709,
                            "name": "Literal",
                            "src": "17616:5:12"
                          }
                        ],
                        "id": 4710,
                        "name": "Return",
                        "src": "17609:12:12"
                      }
                    ],
                    "id": 4711,
                    "name": "IfStatement",
                    "src": "17593:28:12"
                  },
                  {
                    "attributes": {
                      "externalReferences": [
                        {
                          "size": {
                            "declaration": 4704,
                            "isOffset": false,
                            "isSlot": false,
                            "src": "17654:4:12",
                            "valueSize": 1
                          }
                        },
                        {
                          "_addr": {
                            "declaration": 4698,
                            "isOffset": false,
                            "isSlot": false,
                            "src": "17674:5:12",
                            "valueSize": 1
                          }
                        }
                      ],
                      "operations": "{\n    size := extcodesize(_addr)\n}"
                    },
                    "children": [],
                    "id": 4712,
                    "name": "InlineAssembly",
                    "src": "17631:74:12"
                  },
                  {
                    "attributes": {
                      "functionReturnParameters": 4702
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
                          "operator": ">",
                          "type": "bool"
                        },
                        "children": [
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4704,
                              "type": "uint256",
                              "value": "size"
                            },
                            "id": 4713,
                            "name": "Identifier",
                            "src": "17706:4:12"
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
                            "id": 4714,
                            "name": "Literal",
                            "src": "17711:1:12"
                          }
                        ],
                        "id": 4715,
                        "name": "BinaryOperation",
                        "src": "17706:6:12"
                      }
                    ],
                    "id": 4716,
                    "name": "Return",
                    "src": "17699:13:12"
                  }
                ],
                "id": 4717,
                "name": "Block",
                "src": "17564:155:12"
              }
            ],
            "id": 4718,
            "name": "FunctionDefinition",
            "src": "17497:222:12"
          },
          {
            "attributes": {
              "constant": true,
              "implemented": true,
              "isConstructor": false,
              "modifiers": [
                null
              ],
              "name": "min",
              "payable": false,
              "scope": 4821,
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
                      "scope": 4735,
                      "stateVariable": false,
                      "storageLocation": "default",
                      "type": "uint256",
                      "value": null,
                      "visibility": "internal"
                    },
                    "children": [
                      {
                        "attributes": {
                          "name": "uint",
                          "type": "uint256"
                        },
                        "id": 4719,
                        "name": "ElementaryTypeName",
                        "src": "17804:4:12"
                      }
                    ],
                    "id": 4720,
                    "name": "VariableDeclaration",
                    "src": "17804:6:12"
                  },
                  {
                    "attributes": {
                      "constant": false,
                      "name": "b",
                      "scope": 4735,
                      "stateVariable": false,
                      "storageLocation": "default",
                      "type": "uint256",
                      "value": null,
                      "visibility": "internal"
                    },
                    "children": [
                      {
                        "attributes": {
                          "name": "uint",
                          "type": "uint256"
                        },
                        "id": 4721,
                        "name": "ElementaryTypeName",
                        "src": "17812:4:12"
                      }
                    ],
                    "id": 4722,
                    "name": "VariableDeclaration",
                    "src": "17812:6:12"
                  }
                ],
                "id": 4723,
                "name": "ParameterList",
                "src": "17803:16:12"
              },
              {
                "children": [
                  {
                    "attributes": {
                      "constant": false,
                      "name": "",
                      "scope": 4735,
                      "stateVariable": false,
                      "storageLocation": "default",
                      "type": "uint256",
                      "value": null,
                      "visibility": "internal"
                    },
                    "children": [
                      {
                        "attributes": {
                          "name": "uint",
                          "type": "uint256"
                        },
                        "id": 4724,
                        "name": "ElementaryTypeName",
                        "src": "17843:4:12"
                      }
                    ],
                    "id": 4725,
                    "name": "VariableDeclaration",
                    "src": "17843:4:12"
                  }
                ],
                "id": 4726,
                "name": "ParameterList",
                "src": "17842:6:12"
              },
              {
                "children": [
                  {
                    "attributes": {
                      "functionReturnParameters": 4726
                    },
                    "children": [
                      {
                        "attributes": {
                          "argumentTypes": null,
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": false,
                          "lValueRequested": false,
                          "type": "uint256"
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
                              "operator": "<",
                              "type": "bool"
                            },
                            "children": [
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "overloadedDeclarations": [
                                    null
                                  ],
                                  "referencedDeclaration": 4720,
                                  "type": "uint256",
                                  "value": "a"
                                },
                                "id": 4727,
                                "name": "Identifier",
                                "src": "17866:1:12"
                              },
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "overloadedDeclarations": [
                                    null
                                  ],
                                  "referencedDeclaration": 4722,
                                  "type": "uint256",
                                  "value": "b"
                                },
                                "id": 4728,
                                "name": "Identifier",
                                "src": "17870:1:12"
                              }
                            ],
                            "id": 4729,
                            "name": "BinaryOperation",
                            "src": "17866:5:12"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4720,
                              "type": "uint256",
                              "value": "a"
                            },
                            "id": 4730,
                            "name": "Identifier",
                            "src": "17874:1:12"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4722,
                              "type": "uint256",
                              "value": "b"
                            },
                            "id": 4731,
                            "name": "Identifier",
                            "src": "17878:1:12"
                          }
                        ],
                        "id": 4732,
                        "name": "Conditional",
                        "src": "17866:13:12"
                      }
                    ],
                    "id": 4733,
                    "name": "Return",
                    "src": "17859:20:12"
                  }
                ],
                "id": 4734,
                "name": "Block",
                "src": "17849:37:12"
              }
            ],
            "id": 4735,
            "name": "FunctionDefinition",
            "src": "17791:95:12"
          },
          {
            "attributes": {
              "constant": false,
              "implemented": true,
              "isConstructor": false,
              "name": "claimTokens",
              "payable": false,
              "scope": 4821,
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
                      "name": "_token",
                      "scope": 4782,
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
                        "id": 4736,
                        "name": "ElementaryTypeName",
                        "src": "18207:7:12"
                      }
                    ],
                    "id": 4737,
                    "name": "VariableDeclaration",
                    "src": "18207:14:12"
                  }
                ],
                "id": 4738,
                "name": "ParameterList",
                "src": "18206:16:12"
              },
              {
                "attributes": {
                  "parameters": [
                    null
                  ]
                },
                "children": [],
                "id": 4741,
                "name": "ParameterList",
                "src": "18245:0:12"
              },
              {
                "attributes": {
                  "arguments": [
                    null
                  ]
                },
                "children": [
                  {
                    "attributes": {
                      "argumentTypes": null,
                      "overloadedDeclarations": [
                        null
                      ],
                      "referencedDeclaration": 3744,
                      "type": "modifier ()",
                      "value": "onlyController"
                    },
                    "id": 4739,
                    "name": "Identifier",
                    "src": "18230:14:12"
                  }
                ],
                "id": 4740,
                "name": "ModifierInvocation",
                "src": "18230:14:12"
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
                            "typeIdentifier": "t_address",
                            "typeString": "address"
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
                              "referencedDeclaration": 4737,
                              "type": "address",
                              "value": "_token"
                            },
                            "id": 4742,
                            "name": "Identifier",
                            "src": "18259:6:12"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "hexvalue": "307830",
                              "isConstant": false,
                              "isLValue": false,
                              "isPure": true,
                              "lValueRequested": false,
                              "subdenomination": null,
                              "token": "number",
                              "type": "int_const 0",
                              "value": "0x0"
                            },
                            "id": 4743,
                            "name": "Literal",
                            "src": "18269:3:12"
                          }
                        ],
                        "id": 4744,
                        "name": "BinaryOperation",
                        "src": "18259:13:12"
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
                                          "typeIdentifier": "t_uint256",
                                          "typeString": "uint256"
                                        }
                                      ],
                                      "isConstant": false,
                                      "isLValue": false,
                                      "isPure": false,
                                      "lValueRequested": false,
                                      "member_name": "transfer",
                                      "referencedDeclaration": null,
                                      "type": "function (uint256)"
                                    },
                                    "children": [
                                      {
                                        "attributes": {
                                          "argumentTypes": null,
                                          "overloadedDeclarations": [
                                            null
                                          ],
                                          "referencedDeclaration": 3746,
                                          "type": "address",
                                          "value": "controller"
                                        },
                                        "id": 4745,
                                        "name": "Identifier",
                                        "src": "18288:10:12"
                                      }
                                    ],
                                    "id": 4747,
                                    "name": "MemberAccess",
                                    "src": "18288:19:12"
                                  },
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "isConstant": false,
                                      "isLValue": false,
                                      "isPure": false,
                                      "lValueRequested": false,
                                      "member_name": "balance",
                                      "referencedDeclaration": null,
                                      "type": "uint256"
                                    },
                                    "children": [
                                      {
                                        "attributes": {
                                          "argumentTypes": null,
                                          "overloadedDeclarations": [
                                            null
                                          ],
                                          "referencedDeclaration": 11876,
                                          "type": "contract CrowdfundingToken",
                                          "value": "this"
                                        },
                                        "id": 4748,
                                        "name": "Identifier",
                                        "src": "18308:4:12"
                                      }
                                    ],
                                    "id": 4749,
                                    "name": "MemberAccess",
                                    "src": "18308:12:12"
                                  }
                                ],
                                "id": 4750,
                                "name": "FunctionCall",
                                "src": "18288:33:12"
                              }
                            ],
                            "id": 4751,
                            "name": "ExpressionStatement",
                            "src": "18288:33:12"
                          },
                          {
                            "attributes": {
                              "expression": null,
                              "functionReturnParameters": 4741
                            },
                            "id": 4752,
                            "name": "Return",
                            "src": "18335:7:12"
                          }
                        ],
                        "id": 4753,
                        "name": "Block",
                        "src": "18274:78:12"
                      }
                    ],
                    "id": 4754,
                    "name": "IfStatement",
                    "src": "18255:97:12"
                  },
                  {
                    "attributes": {
                      "assignments": [
                        4756
                      ]
                    },
                    "children": [
                      {
                        "attributes": {
                          "constant": false,
                          "name": "token",
                          "scope": 4782,
                          "stateVariable": false,
                          "storageLocation": "default",
                          "type": "contract CrowdfundingToken",
                          "value": null,
                          "visibility": "internal"
                        },
                        "children": [
                          {
                            "attributes": {
                              "contractScope": null,
                              "name": "CrowdfundingToken",
                              "referencedDeclaration": 4821,
                              "type": "contract CrowdfundingToken"
                            },
                            "id": 4755,
                            "name": "UserDefinedTypeName",
                            "src": "18362:17:12"
                          }
                        ],
                        "id": 4756,
                        "name": "VariableDeclaration",
                        "src": "18362:23:12"
                      },
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
                          "type": "contract CrowdfundingToken",
                          "type_conversion": true
                        },
                        "children": [
                          {
                            "attributes": {
                              "argumentTypes": [
                                {
                                  "typeIdentifier": "t_address",
                                  "typeString": "address"
                                }
                              ],
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4821,
                              "type": "type(contract CrowdfundingToken)",
                              "value": "CrowdfundingToken"
                            },
                            "id": 4757,
                            "name": "Identifier",
                            "src": "18388:17:12"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4737,
                              "type": "address",
                              "value": "_token"
                            },
                            "id": 4758,
                            "name": "Identifier",
                            "src": "18406:6:12"
                          }
                        ],
                        "id": 4759,
                        "name": "FunctionCall",
                        "src": "18388:25:12"
                      }
                    ],
                    "id": 4760,
                    "name": "VariableDeclarationStatement",
                    "src": "18362:51:12"
                  },
                  {
                    "attributes": {
                      "assignments": [
                        4762
                      ]
                    },
                    "children": [
                      {
                        "attributes": {
                          "constant": false,
                          "name": "balance",
                          "scope": 4782,
                          "stateVariable": false,
                          "storageLocation": "default",
                          "type": "uint256",
                          "value": null,
                          "visibility": "internal"
                        },
                        "children": [
                          {
                            "attributes": {
                              "name": "uint",
                              "type": "uint256"
                            },
                            "id": 4761,
                            "name": "ElementaryTypeName",
                            "src": "18423:4:12"
                          }
                        ],
                        "id": 4762,
                        "name": "VariableDeclaration",
                        "src": "18423:12:12"
                      },
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
                          "type": "uint256",
                          "type_conversion": false
                        },
                        "children": [
                          {
                            "attributes": {
                              "argumentTypes": [
                                {
                                  "typeIdentifier": "t_contract$_CrowdfundingToken_$4821",
                                  "typeString": "contract CrowdfundingToken"
                                }
                              ],
                              "isConstant": false,
                              "isLValue": false,
                              "isPure": false,
                              "lValueRequested": false,
                              "member_name": "balanceOf",
                              "referencedDeclaration": 4276,
                              "type": "function (address) view external returns (uint256)"
                            },
                            "children": [
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "overloadedDeclarations": [
                                    null
                                  ],
                                  "referencedDeclaration": 4756,
                                  "type": "contract CrowdfundingToken",
                                  "value": "token"
                                },
                                "id": 4763,
                                "name": "Identifier",
                                "src": "18438:5:12"
                              }
                            ],
                            "id": 4764,
                            "name": "MemberAccess",
                            "src": "18438:15:12"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 11876,
                              "type": "contract CrowdfundingToken",
                              "value": "this"
                            },
                            "id": 4765,
                            "name": "Identifier",
                            "src": "18454:4:12"
                          }
                        ],
                        "id": 4766,
                        "name": "FunctionCall",
                        "src": "18438:21:12"
                      }
                    ],
                    "id": 4767,
                    "name": "VariableDeclarationStatement",
                    "src": "18423:36:12"
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
                          "type": "bool",
                          "type_conversion": false
                        },
                        "children": [
                          {
                            "attributes": {
                              "argumentTypes": [
                                {
                                  "typeIdentifier": "t_address",
                                  "typeString": "address"
                                },
                                {
                                  "typeIdentifier": "t_uint256",
                                  "typeString": "uint256"
                                }
                              ],
                              "isConstant": false,
                              "isLValue": false,
                              "isPure": false,
                              "lValueRequested": false,
                              "member_name": "transfer",
                              "referencedDeclaration": 4126,
                              "type": "function (address,uint256) external returns (bool)"
                            },
                            "children": [
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "overloadedDeclarations": [
                                    null
                                  ],
                                  "referencedDeclaration": 4756,
                                  "type": "contract CrowdfundingToken",
                                  "value": "token"
                                },
                                "id": 4768,
                                "name": "Identifier",
                                "src": "18469:5:12"
                              }
                            ],
                            "id": 4770,
                            "name": "MemberAccess",
                            "src": "18469:14:12"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 3746,
                              "type": "address",
                              "value": "controller"
                            },
                            "id": 4771,
                            "name": "Identifier",
                            "src": "18484:10:12"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4762,
                              "type": "uint256",
                              "value": "balance"
                            },
                            "id": 4772,
                            "name": "Identifier",
                            "src": "18496:7:12"
                          }
                        ],
                        "id": 4773,
                        "name": "FunctionCall",
                        "src": "18469:35:12"
                      }
                    ],
                    "id": 4774,
                    "name": "ExpressionStatement",
                    "src": "18469:35:12"
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
                                  "typeIdentifier": "t_address",
                                  "typeString": "address"
                                },
                                {
                                  "typeIdentifier": "t_address",
                                  "typeString": "address"
                                },
                                {
                                  "typeIdentifier": "t_uint256",
                                  "typeString": "uint256"
                                }
                              ],
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4804,
                              "type": "function (address,address,uint256)",
                              "value": "ClaimedTokens"
                            },
                            "id": 4775,
                            "name": "Identifier",
                            "src": "18514:13:12"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4737,
                              "type": "address",
                              "value": "_token"
                            },
                            "id": 4776,
                            "name": "Identifier",
                            "src": "18528:6:12"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 3746,
                              "type": "address",
                              "value": "controller"
                            },
                            "id": 4777,
                            "name": "Identifier",
                            "src": "18536:10:12"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4762,
                              "type": "uint256",
                              "value": "balance"
                            },
                            "id": 4778,
                            "name": "Identifier",
                            "src": "18548:7:12"
                          }
                        ],
                        "id": 4779,
                        "name": "FunctionCall",
                        "src": "18514:42:12"
                      }
                    ],
                    "id": 4780,
                    "name": "ExpressionStatement",
                    "src": "18514:42:12"
                  }
                ],
                "id": 4781,
                "name": "Block",
                "src": "18245:318:12"
              }
            ],
            "id": 4782,
            "name": "FunctionDefinition",
            "src": "18186:377:12"
          },
          {
            "attributes": {
              "constant": false,
              "implemented": true,
              "isConstructor": false,
              "modifiers": [
                null
              ],
              "name": "onERC721Received",
              "payable": false,
              "scope": 4821,
              "stateMutability": "nonpayable",
              "superFunction": 11423,
              "visibility": "public"
            },
            "children": [
              {
                "children": [
                  {
                    "attributes": {
                      "constant": false,
                      "name": "",
                      "scope": 4796,
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
                        "id": 4783,
                        "name": "ElementaryTypeName",
                        "src": "18652:7:12"
                      }
                    ],
                    "id": 4784,
                    "name": "VariableDeclaration",
                    "src": "18652:7:12"
                  },
                  {
                    "attributes": {
                      "constant": false,
                      "name": "",
                      "scope": 4796,
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
                        "id": 4785,
                        "name": "ElementaryTypeName",
                        "src": "18669:7:12"
                      }
                    ],
                    "id": 4786,
                    "name": "VariableDeclaration",
                    "src": "18669:7:12"
                  },
                  {
                    "attributes": {
                      "constant": false,
                      "name": "",
                      "scope": 4796,
                      "stateVariable": false,
                      "storageLocation": "default",
                      "type": "bytes memory",
                      "value": null,
                      "visibility": "internal"
                    },
                    "children": [
                      {
                        "attributes": {
                          "name": "bytes",
                          "type": "bytes storage pointer"
                        },
                        "id": 4787,
                        "name": "ElementaryTypeName",
                        "src": "18686:5:12"
                      }
                    ],
                    "id": 4788,
                    "name": "VariableDeclaration",
                    "src": "18686:5:12"
                  }
                ],
                "id": 4789,
                "name": "ParameterList",
                "src": "18642:55:12"
              },
              {
                "children": [
                  {
                    "attributes": {
                      "constant": false,
                      "name": "",
                      "scope": 4796,
                      "stateVariable": false,
                      "storageLocation": "default",
                      "type": "bytes4",
                      "value": null,
                      "visibility": "internal"
                    },
                    "children": [
                      {
                        "attributes": {
                          "name": "bytes4",
                          "type": "bytes4"
                        },
                        "id": 4790,
                        "name": "ElementaryTypeName",
                        "src": "18729:6:12"
                      }
                    ],
                    "id": 4791,
                    "name": "VariableDeclaration",
                    "src": "18729:6:12"
                  }
                ],
                "id": 4792,
                "name": "ParameterList",
                "src": "18728:8:12"
              },
              {
                "children": [
                  {
                    "attributes": {
                      "functionReturnParameters": 4792
                    },
                    "children": [
                      {
                        "attributes": {
                          "argumentTypes": null,
                          "overloadedDeclarations": [
                            null
                          ],
                          "referencedDeclaration": 11412,
                          "type": "bytes4",
                          "value": "ERC721_RECEIVED"
                        },
                        "id": 4793,
                        "name": "Identifier",
                        "src": "18758:15:12"
                      }
                    ],
                    "id": 4794,
                    "name": "Return",
                    "src": "18751:22:12"
                  }
                ],
                "id": 4795,
                "name": "Block",
                "src": "18741:39:12"
              }
            ],
            "id": 4796,
            "name": "FunctionDefinition",
            "src": "18617:163:12"
          },
          {
            "attributes": {
              "anonymous": false,
              "name": "ClaimedTokens"
            },
            "children": [
              {
                "children": [
                  {
                    "attributes": {
                      "constant": false,
                      "indexed": true,
                      "name": "_token",
                      "scope": 4804,
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
                        "id": 4797,
                        "name": "ElementaryTypeName",
                        "src": "18850:7:12"
                      }
                    ],
                    "id": 4798,
                    "name": "VariableDeclaration",
                    "src": "18850:22:12"
                  },
                  {
                    "attributes": {
                      "constant": false,
                      "indexed": true,
                      "name": "_controller",
                      "scope": 4804,
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
                        "id": 4799,
                        "name": "ElementaryTypeName",
                        "src": "18874:7:12"
                      }
                    ],
                    "id": 4800,
                    "name": "VariableDeclaration",
                    "src": "18874:27:12"
                  },
                  {
                    "attributes": {
                      "constant": false,
                      "indexed": false,
                      "name": "_amount",
                      "scope": 4804,
                      "stateVariable": false,
                      "storageLocation": "default",
                      "type": "uint256",
                      "value": null,
                      "visibility": "internal"
                    },
                    "children": [
                      {
                        "attributes": {
                          "name": "uint",
                          "type": "uint256"
                        },
                        "id": 4801,
                        "name": "ElementaryTypeName",
                        "src": "18903:4:12"
                      }
                    ],
                    "id": 4802,
                    "name": "VariableDeclaration",
                    "src": "18903:12:12"
                  }
                ],
                "id": 4803,
                "name": "ParameterList",
                "src": "18849:67:12"
              }
            ],
            "id": 4804,
            "name": "EventDefinition",
            "src": "18830:87:12"
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
                      "name": "_from",
                      "scope": 4812,
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
                        "id": 4805,
                        "name": "ElementaryTypeName",
                        "src": "18937:7:12"
                      }
                    ],
                    "id": 4806,
                    "name": "VariableDeclaration",
                    "src": "18937:21:12"
                  },
                  {
                    "attributes": {
                      "constant": false,
                      "indexed": true,
                      "name": "_to",
                      "scope": 4812,
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
                        "id": 4807,
                        "name": "ElementaryTypeName",
                        "src": "18960:7:12"
                      }
                    ],
                    "id": 4808,
                    "name": "VariableDeclaration",
                    "src": "18960:19:12"
                  },
                  {
                    "attributes": {
                      "constant": false,
                      "indexed": false,
                      "name": "_amount",
                      "scope": 4812,
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
                        "id": 4809,
                        "name": "ElementaryTypeName",
                        "src": "18981:7:12"
                      }
                    ],
                    "id": 4810,
                    "name": "VariableDeclaration",
                    "src": "18981:15:12"
                  }
                ],
                "id": 4811,
                "name": "ParameterList",
                "src": "18936:61:12"
              }
            ],
            "id": 4812,
            "name": "EventDefinition",
            "src": "18922:76:12"
          },
          {
            "attributes": {
              "anonymous": false,
              "name": "Approval"
            },
            "children": [
              {
                "children": [
                  {
                    "attributes": {
                      "constant": false,
                      "indexed": true,
                      "name": "_owner",
                      "scope": 4820,
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
                        "id": 4813,
                        "name": "ElementaryTypeName",
                        "src": "19027:7:12"
                      }
                    ],
                    "id": 4814,
                    "name": "VariableDeclaration",
                    "src": "19027:22:12"
                  },
                  {
                    "attributes": {
                      "constant": false,
                      "indexed": true,
                      "name": "_spender",
                      "scope": 4820,
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
                        "id": 4815,
                        "name": "ElementaryTypeName",
                        "src": "19059:7:12"
                      }
                    ],
                    "id": 4816,
                    "name": "VariableDeclaration",
                    "src": "19059:24:12"
                  },
                  {
                    "attributes": {
                      "constant": false,
                      "indexed": false,
                      "name": "_amount",
                      "scope": 4820,
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
                        "id": 4817,
                        "name": "ElementaryTypeName",
                        "src": "19093:7:12"
                      }
                    ],
                    "id": 4818,
                    "name": "VariableDeclaration",
                    "src": "19093:15:12"
                  }
                ],
                "id": 4819,
                "name": "ParameterList",
                "src": "19017:101:12"
              }
            ],
            "id": 4820,
            "name": "EventDefinition",
            "src": "19003:116:12"
          }
        ],
        "id": 4821,
        "name": "ContractDefinition",
        "src": "520:18602:12"
      }
    ],
    "id": 4822,
    "name": "SourceUnit",
    "src": "0:19123:12"
  },
  "compiler": {
    "name": "solc",
    "version": "0.4.18+commit.9cf6e910.Emscripten.clang"
  },
  "networks": {},
  "schemaVersion": "1.0.1",
  "updatedAt": "2018-07-24T01:55:44.948Z"
}