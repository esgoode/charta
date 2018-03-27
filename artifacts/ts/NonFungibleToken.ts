export const NonFungibleToken = 
{
  "contractName": "NonFungibleToken",
  "abi": [
    {
      "constant": true,
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "name": "_name",
          "type": "string"
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
          "name": "_tokenId",
          "type": "uint256"
        }
      ],
      "name": "getApproved",
      "outputs": [
        {
          "name": "_approved",
          "type": "address"
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
          "name": "_to",
          "type": "address"
        },
        {
          "name": "_tokenId",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "implementsERC721",
      "outputs": [
        {
          "name": "_implementsERC721",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "name": "_totalSupply",
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
          "name": "_from",
          "type": "address"
        },
        {
          "name": "_to",
          "type": "address"
        },
        {
          "name": "_tokenId",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "_owner",
          "type": "address"
        },
        {
          "name": "_index",
          "type": "uint256"
        }
      ],
      "name": "tokenOfOwnerByIndex",
      "outputs": [
        {
          "name": "_tokenId",
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
          "name": "_tokenId",
          "type": "uint256"
        }
      ],
      "name": "ownerOf",
      "outputs": [
        {
          "name": "_owner",
          "type": "address"
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
          "name": "_tokenId",
          "type": "uint256"
        }
      ],
      "name": "tokenMetadata",
      "outputs": [
        {
          "name": "_infoUrl",
          "type": "string"
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
          "name": "_owner",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "name": "_balance",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "name": "_symbol",
          "type": "string"
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
          "name": "_to",
          "type": "address"
        },
        {
          "name": "_tokenId",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "numTokensTotal",
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
          "name": "_owner",
          "type": "address"
        }
      ],
      "name": "getOwnerTokens",
      "outputs": [
        {
          "name": "_tokenIds",
          "type": "uint256[]"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "_from",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "_to",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "_tokenId",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "_owner",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "_approved",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "_tokenId",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    }
  ],
  "bytecode": "0x6060604052341561000f57600080fd5b6113d08061001e6000396000f3006060604052600436106100d0576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806306fdde03146100d5578063081812fc14610163578063095ea7b3146101c65780631051db341461020857806318160ddd1461023557806323b872dd1461025e5780632f745c59146102bf5780636352211e146103155780636914db601461037857806370a082311461041457806395d89b4114610461578063a9059cbb146104ef578063af129dc214610531578063d63d4af01461055a575b600080fd5b34156100e057600080fd5b6100e86105e8565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561012857808201518184015260208101905061010d565b50505050905090810190601f1680156101555780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b341561016e57600080fd5b6101846004808035906020019091905050610690565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34156101d157600080fd5b610206600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919080359060200190919050506106a2565b005b341561021357600080fd5b61021b61084f565b604051808215151515815260200191505060405180910390f35b341561024057600080fd5b610248610858565b6040518082815260200191505060405180910390f35b341561026957600080fd5b6102bd600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803573ffffffffffffffffffffffffffffffffffffffff16906020019091908035906020019091905050610862565b005b34156102ca57600080fd5b6102ff600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091908035906020019091905050610a2d565b6040518082815260200191505060405180910390f35b341561032057600080fd5b6103366004808035906020019091905050610a41565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b341561038357600080fd5b6103996004808035906020019091905050610a53565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156103d95780820151818401526020810190506103be565b50505050905090810190601f1680156104065780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b341561041f57600080fd5b61044b600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050610b0e565b6040518082815260200191505060405180910390f35b341561046c57600080fd5b610474610b5a565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156104b4578082015181840152602081019050610499565b50505050905090810190601f1680156104e15780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34156104fa57600080fd5b61052f600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091908035906020019091905050610c02565b005b341561053c57600080fd5b610544610d8a565b6040518082815260200191505060405180910390f35b341561056557600080fd5b610591600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050610d90565b6040518080602001828103825283818151815260200191508051906020019060200280838360005b838110156105d45780820151818401526020810190506105b9565b505050509050019250505060405180910390f35b6105f06112ff565b60008054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156106865780601f1061065b57610100808354040283529160200191610686565b820191906000526020600020905b81548152906001019060200180831161066957829003601f168201915b5050505050905090565b600061069b82610da8565b9050919050565b80600073ffffffffffffffffffffffffffffffffffffffff166106c482610a41565b73ffffffffffffffffffffffffffffffffffffffff16141515156106e757600080fd5b6106f082610a41565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561072957600080fd5b8273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415151561076457600080fd5b600073ffffffffffffffffffffffffffffffffffffffff1661078583610da8565b73ffffffffffffffffffffffffffffffffffffffff161415806107d55750600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1614155b1561084a576107e48383610de5565b8273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925846040518082815260200191505060405180910390a35b505050565b60006001905090565b6000600254905090565b80600073ffffffffffffffffffffffffffffffffffffffff1661088482610a41565b73ffffffffffffffffffffffffffffffffffffffff16141515156108a757600080fd5b3373ffffffffffffffffffffffffffffffffffffffff166108c783610690565b73ffffffffffffffffffffffffffffffffffffffff161415156108e957600080fd5b8373ffffffffffffffffffffffffffffffffffffffff1661090983610a41565b73ffffffffffffffffffffffffffffffffffffffff1614151561092b57600080fd5b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415151561096757600080fd5b610972848484610e3b565b60008473ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925846040518082815260200191505060405180910390a38273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a350505050565b6000610a398383610e67565b905092915050565b6000610a4c82610ec9565b9050919050565b610a5b6112ff565b600560008381526020019081526020016000208054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610b025780601f10610ad757610100808354040283529160200191610b02565b820191906000526020600020905b815481529060010190602001808311610ae557829003601f168201915b50505050509050919050565b6000600660008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020805490509050919050565b610b626112ff565b60018054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610bf85780601f10610bcd57610100808354040283529160200191610bf8565b820191906000526020600020905b815481529060010190602001808311610bdb57829003601f168201915b5050505050905090565b80600073ffffffffffffffffffffffffffffffffffffffff16610c2482610a41565b73ffffffffffffffffffffffffffffffffffffffff1614151515610c4757600080fd5b3373ffffffffffffffffffffffffffffffffffffffff16610c6783610a41565b73ffffffffffffffffffffffffffffffffffffffff16141515610c8957600080fd5b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1614151515610cc557600080fd5b610cd0338484610e3b565b60003373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925846040518082815260200191505060405180910390a38273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a3505050565b60025481565b610d98611313565b610da182610f06565b9050919050565b60006004600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b816004600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505050565b610e4481610fa3565b610e4e8382610ff9565b610e5881836111e2565b610e628282611238565b505050565b6000600660008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002082815481101515610eb557fe5b906000526020600020900154905092915050565b60006003600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b610f0e611313565b600660008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020805480602002602001604051908101604052809291908181526020018280548015610f9757602002820191906000526020600020905b815481526020019060010190808311610f83575b50505050509050919050565b60006004600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b6000806000600660008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002080549050925060076000858152602001908152602001600020549150600660008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600184038154811015156110a857fe5b906000526020600020900154905080600660008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208381548110151561110357fe5b906000526020600020900181905550816007600083815260200190815260200160002081905550600660008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206001840381548110151561117957fe5b906000526020600020900160009055600660008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208054809190600190036111da9190611327565b505050505050565b806003600084815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505050565b600660008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002080548060010182816112899190611353565b9160005260206000209001600083909190915055506001600660008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020805490500360076000838152602001908152602001600020819055505050565b602060405190810160405280600081525090565b602060405190810160405280600081525090565b81548183558181151161134e5781836000526020600020918201910161134d919061137f565b5b505050565b81548183558181151161137a57818360005260206000209182019101611379919061137f565b5b505050565b6113a191905b8082111561139d576000816000905550600101611385565b5090565b905600a165627a7a72305820b171a81aa98f6dadfe84ee7c2cebc2e93c54f3c2af036be668b92646784d773b0029",
  "deployedBytecode": "0x6060604052600436106100d0576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806306fdde03146100d5578063081812fc14610163578063095ea7b3146101c65780631051db341461020857806318160ddd1461023557806323b872dd1461025e5780632f745c59146102bf5780636352211e146103155780636914db601461037857806370a082311461041457806395d89b4114610461578063a9059cbb146104ef578063af129dc214610531578063d63d4af01461055a575b600080fd5b34156100e057600080fd5b6100e86105e8565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561012857808201518184015260208101905061010d565b50505050905090810190601f1680156101555780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b341561016e57600080fd5b6101846004808035906020019091905050610690565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34156101d157600080fd5b610206600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919080359060200190919050506106a2565b005b341561021357600080fd5b61021b61084f565b604051808215151515815260200191505060405180910390f35b341561024057600080fd5b610248610858565b6040518082815260200191505060405180910390f35b341561026957600080fd5b6102bd600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803573ffffffffffffffffffffffffffffffffffffffff16906020019091908035906020019091905050610862565b005b34156102ca57600080fd5b6102ff600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091908035906020019091905050610a2d565b6040518082815260200191505060405180910390f35b341561032057600080fd5b6103366004808035906020019091905050610a41565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b341561038357600080fd5b6103996004808035906020019091905050610a53565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156103d95780820151818401526020810190506103be565b50505050905090810190601f1680156104065780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b341561041f57600080fd5b61044b600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050610b0e565b6040518082815260200191505060405180910390f35b341561046c57600080fd5b610474610b5a565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156104b4578082015181840152602081019050610499565b50505050905090810190601f1680156104e15780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34156104fa57600080fd5b61052f600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091908035906020019091905050610c02565b005b341561053c57600080fd5b610544610d8a565b6040518082815260200191505060405180910390f35b341561056557600080fd5b610591600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050610d90565b6040518080602001828103825283818151815260200191508051906020019060200280838360005b838110156105d45780820151818401526020810190506105b9565b505050509050019250505060405180910390f35b6105f06112ff565b60008054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156106865780601f1061065b57610100808354040283529160200191610686565b820191906000526020600020905b81548152906001019060200180831161066957829003601f168201915b5050505050905090565b600061069b82610da8565b9050919050565b80600073ffffffffffffffffffffffffffffffffffffffff166106c482610a41565b73ffffffffffffffffffffffffffffffffffffffff16141515156106e757600080fd5b6106f082610a41565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561072957600080fd5b8273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415151561076457600080fd5b600073ffffffffffffffffffffffffffffffffffffffff1661078583610da8565b73ffffffffffffffffffffffffffffffffffffffff161415806107d55750600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1614155b1561084a576107e48383610de5565b8273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925846040518082815260200191505060405180910390a35b505050565b60006001905090565b6000600254905090565b80600073ffffffffffffffffffffffffffffffffffffffff1661088482610a41565b73ffffffffffffffffffffffffffffffffffffffff16141515156108a757600080fd5b3373ffffffffffffffffffffffffffffffffffffffff166108c783610690565b73ffffffffffffffffffffffffffffffffffffffff161415156108e957600080fd5b8373ffffffffffffffffffffffffffffffffffffffff1661090983610a41565b73ffffffffffffffffffffffffffffffffffffffff1614151561092b57600080fd5b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415151561096757600080fd5b610972848484610e3b565b60008473ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925846040518082815260200191505060405180910390a38273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a350505050565b6000610a398383610e67565b905092915050565b6000610a4c82610ec9565b9050919050565b610a5b6112ff565b600560008381526020019081526020016000208054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610b025780601f10610ad757610100808354040283529160200191610b02565b820191906000526020600020905b815481529060010190602001808311610ae557829003601f168201915b50505050509050919050565b6000600660008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020805490509050919050565b610b626112ff565b60018054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610bf85780601f10610bcd57610100808354040283529160200191610bf8565b820191906000526020600020905b815481529060010190602001808311610bdb57829003601f168201915b5050505050905090565b80600073ffffffffffffffffffffffffffffffffffffffff16610c2482610a41565b73ffffffffffffffffffffffffffffffffffffffff1614151515610c4757600080fd5b3373ffffffffffffffffffffffffffffffffffffffff16610c6783610a41565b73ffffffffffffffffffffffffffffffffffffffff16141515610c8957600080fd5b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1614151515610cc557600080fd5b610cd0338484610e3b565b60003373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925846040518082815260200191505060405180910390a38273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a3505050565b60025481565b610d98611313565b610da182610f06565b9050919050565b60006004600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b816004600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505050565b610e4481610fa3565b610e4e8382610ff9565b610e5881836111e2565b610e628282611238565b505050565b6000600660008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002082815481101515610eb557fe5b906000526020600020900154905092915050565b60006003600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b610f0e611313565b600660008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020805480602002602001604051908101604052809291908181526020018280548015610f9757602002820191906000526020600020905b815481526020019060010190808311610f83575b50505050509050919050565b60006004600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b6000806000600660008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002080549050925060076000858152602001908152602001600020549150600660008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600184038154811015156110a857fe5b906000526020600020900154905080600660008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208381548110151561110357fe5b906000526020600020900181905550816007600083815260200190815260200160002081905550600660008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206001840381548110151561117957fe5b906000526020600020900160009055600660008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208054809190600190036111da9190611327565b505050505050565b806003600084815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505050565b600660008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002080548060010182816112899190611353565b9160005260206000209001600083909190915055506001600660008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020805490500360076000838152602001908152602001600020819055505050565b602060405190810160405280600081525090565b602060405190810160405280600081525090565b81548183558181151161134e5781836000526020600020918201910161134d919061137f565b5b505050565b81548183558181151161137a57818360005260206000209182019101611379919061137f565b5b505050565b6113a191905b8082111561139d576000816000905550600101611385565b5090565b905600a165627a7a72305820b171a81aa98f6dadfe84ee7c2cebc2e93c54f3c2af036be668b92646784d773b0029",
  "sourceMap": "449:5630:19:-;;;;;;;;;;;;;;;;;",
  "deployedSourceMap": "449:5630:19:-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;1226:107;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;23:1:-1;8:100;33:3;30:1;27:2;8:100;;;99:1;94:3;90;84:5;80:1;75:3;71;64:6;52:2;49:1;45:3;40:15;;8:100;;;12:14;3:109;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;3684:150:19;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;2064:377;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;3549:129;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;1458:132;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;2447:397;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;3200:183;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;1758:139;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;1903:155;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;23:1:-1;8:100;33:3;30:1;27:2;8:100;;;99:1;94:3;90;84:5;80:1;75:3;71;64:6;52:2;49:1;45:3;40:15;;8:100;;;12:14;3:109;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;1596:156:19;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;1339:113;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;23:1:-1;8:100;33:3;30:1;27:2;8:100;;;99:1;94:3;90;84:5;80:1;75:3;71;64:6;52:2;49:1;45:3;40:15;;8:100;;;12:14;3:109;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;2850:344:19;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;550:26;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;3389:154;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;23:1:-1;8:100;33:3;30:1;27:2;8:100;;;99:1;94:3;90;84:5;80:1;75:3;71;64:6;52:2;49:1;45:3;40:15;;8:100;;;12:14;3:109;;;;;;;;;;;;;;;;;1226:107:19;1287:12;;:::i;:::-;1322:4;1315:11;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;1226:107;:::o;3684:150::-;3765:17;3805:22;3818:8;3805:12;:22::i;:::-;3798:29;;3684:150;;;:::o;2064:377::-;2148:8;1199:1;1170:31;;:17;1178:8;1170:7;:17::i;:::-;:31;;;;1162:40;;;;;;;;2194:17;2202:8;2194:7;:17::i;:::-;2180:31;;:10;:31;;;2172:40;;;;;;;;2244:3;2230:17;;:10;:17;;;;2222:26;;;;;;;;2297:1;2263:36;;:22;2276:8;2263:12;:22::i;:::-;:36;;;;:73;;;;2334:1;2319:17;;:3;:17;;;;2263:73;2259:176;;;2352:23;2361:3;2366:8;2352;:23::i;:::-;2410:3;2389:35;;2398:10;2389:35;;;2415:8;2389:35;;;;;;;;;;;;;;;;;;2259:176;2064:377;;;:::o;3549:129::-;3622:22;3667:4;3660:11;;3549:129;:::o;1458:132::-;1526:20;1569:14;;1562:21;;1458:132;:::o;2447:397::-;2551:8;1199:1;1170:31;;:17;1178:8;1170:7;:17::i;:::-;:31;;;;1162:40;;;;;;;;2608:10;2583:35;;:21;2595:8;2583:11;:21::i;:::-;:35;;;2575:44;;;;;;;;2658:5;2637:26;;:17;2645:8;2637:7;:17::i;:::-;:26;;;2629:35;;;;;;;;2697:1;2682:17;;:3;:17;;;;2674:26;;;;;;;;2711:47;2737:5;2744:3;2749:8;2711:25;:47::i;:::-;2785:1;2778:5;2769:28;;;2788:8;2769:28;;;;;;;;;;;;;;;;;;2823:3;2807:30;;2816:5;2807:30;;;2828:8;2807:30;;;;;;;;;;;;;;;;;;2447:397;;;;:::o;3200:183::-;3303:13;3339:37;3361:6;3369;3339:21;:37::i;:::-;3332:44;;3200:183;;;;:::o;1758:139::-;1835:14;1872:18;1881:8;1872;:18::i;:::-;1865:25;;1758:139;;;:::o;1903:155::-;1986:15;;:::i;:::-;2024:17;:27;2042:8;2024:27;;;;;;;;;;;2017:34;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;1903:155;;;:::o;1596:156::-;1676:13;1712:18;:26;1731:6;1712:26;;;;;;;;;;;;;;;:33;;;;1705:40;;1596:156;;;:::o;1339:113::-;1402:14;;:::i;:::-;1439:6;1432:13;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;1339:113;:::o;2850:344::-;2935:8;1199:1;1170:31;;:17;1178:8;1170:7;:17::i;:::-;:31;;;;1162:40;;;;;;;;2988:10;2967:31;;:17;2975:8;2967:7;:17::i;:::-;:31;;;2959:40;;;;;;;;3032:1;3017:17;;:3;:17;;;;3009:26;;;;;;;;3046:52;3072:10;3084:3;3089:8;3046:25;:52::i;:::-;3130:1;3118:10;3109:33;;;3133:8;3109:33;;;;;;;;;;;;;;;;;;3173:3;3152:35;;3161:10;3152:35;;;3178:8;3152:35;;;;;;;;;;;;;;;;;;2850:344;;;:::o;550:26::-;;;;:::o;3389:154::-;3474:16;;:::i;:::-;3513:23;3529:6;3513:15;:23::i;:::-;3506:30;;3389:154;;;:::o;4413:165::-;4497:17;4537:24;:34;4562:8;4537:34;;;;;;;;;;;;;;;;;;;;;4530:41;;4413:165;;;:::o;4283:124::-;4397:3;4360:24;:34;4385:8;4360:34;;;;;;;;;;;;:40;;;;;;;;;;;;;;;;;;4283:124;;:::o;3840:283::-;3949:29;3969:8;3949:19;:29::i;:::-;3988:43;4015:5;4022:8;3988:26;:43::i;:::-;4041:29;4056:8;4066:3;4041:14;:29::i;:::-;4080:36;4102:3;4107:8;4080:21;:36::i;:::-;3840:283;;;:::o;4748:183::-;4855:12;4890:18;:26;4909:6;4890:26;;;;;;;;;;;;;;;4917:6;4890:34;;;;;;;;;;;;;;;;;;;4883:41;;4748:183;;;;:::o;4129:148::-;4209:14;4246;:24;4261:8;4246:24;;;;;;;;;;;;;;;;;;;;;4239:31;;4129:148;;;:::o;4584:158::-;4672:14;;:::i;:::-;4709:18;:26;4728:6;4709:26;;;;;;;;;;;;;;;4702:33;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;4584:158;;;:::o;4937:129::-;5057:1;5012:24;:34;5037:8;5012:34;;;;;;;;;;;;:47;;;;;;;;;;;;;;;;;;4937:129;:::o;5447:484::-;5545:11;5602:10;5659:14;5559:18;:26;5578:6;5559:26;;;;;;;;;;;;;;;:33;;;;5545:47;;5615:24;:34;5640:8;5615:34;;;;;;;;;;;;5602:47;;5676:18;:26;5695:6;5676:26;;;;;;;;;;;;;;;5712:1;5703:6;:10;5676:38;;;;;;;;;;;;;;;;;;;5659:55;;5761:9;5725:18;:26;5744:6;5725:26;;;;;;;;;;;;;;;5752:5;5725:33;;;;;;;;;;;;;;;;;;:45;;;;5818:5;5780:24;:35;5805:9;5780:35;;;;;;;;;;;:43;;;;5841:18;:26;5860:6;5841:26;;;;;;;;;;;;;;;5877:1;5868:6;:10;5841:38;;;;;;;;;;;;;;;;;;5834:45;;;5889:18;:26;5908:6;5889:26;;;;;;;;;;;;;;;:35;;;;;;;;;;;;:::i;:::-;;5447:484;;;;;:::o;5072:126::-;5185:6;5158:14;:24;5173:8;5158:24;;;;;;;;;;;;:33;;;;;;;;;;;;;;;;;;5072:126;;:::o;5204:237::-;5297:18;:26;5316:6;5297:26;;;;;;;;;;;;;;;:41;;;;;;;;;;;:::i;:::-;;;;;;;;;;5329:8;5297:41;;;;;;;5433:1;5397:18;:26;5416:6;5397:26;;;;;;;;;;;;;;;:33;;;;:37;5348:24;:34;5373:8;5348:34;;;;;;;;;;;:86;;;;5204:237;;:::o;449:5630::-;;;;;;;;;;;;;;;:::o;:::-;;;;;;;;;;;;;;;:::o;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;:::o;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;:::o;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;:::o",
  "source": "pragma solidity 0.4.18;\n\nimport \"./DetailedERC721.sol\";\n\n\n/**\n * @title NonFungibleToken\n *\n * Generic implementation for both required and optional functionality in\n * the ERC721 standard for non-fungible tokens.\n *\n * Heavily inspired by Decentraland's generic implementation:\n * https://github.com/decentraland/land/blob/master/contracts/BasicNFT.sol\n *\n * Standard Author: dete\n * Implementation Author: Nadav Hollander <nadav at dharma.io>\n */\ncontract NonFungibleToken is DetailedERC721 {\n    string public name;\n    string public symbol;\n\n    uint public numTokensTotal;\n\n    mapping(uint => address) internal tokenIdToOwner;\n    mapping(uint => address) internal tokenIdToApprovedAddress;\n    mapping(uint => string) internal tokenIdToMetadata;\n    mapping(address => uint[]) internal ownerToTokensOwned;\n    mapping(uint => uint) internal tokenIdToOwnerArrayIndex;\n\n    event Transfer(\n        address indexed _from,\n        address indexed _to,\n        uint256 _tokenId\n    );\n\n    event Approval(\n        address indexed _owner,\n        address indexed _approved,\n        uint256 _tokenId\n    );\n\n    modifier onlyExtantToken(uint _tokenId) {\n        require(ownerOf(_tokenId) != address(0));\n        _;\n    }\n\n    function name()\n        public\n        view\n        returns (string _name)\n    {\n        return name;\n    }\n\n    function symbol()\n        public\n        view\n        returns (string _symbol)\n    {\n        return symbol;\n    }\n\n    function totalSupply()\n        public\n        view\n        returns (uint256 _totalSupply)\n    {\n        return numTokensTotal;\n    }\n\n    function balanceOf(address _owner)\n        public\n        view\n        returns (uint _balance)\n    {\n        return ownerToTokensOwned[_owner].length;\n    }\n\n    function ownerOf(uint _tokenId)\n        public\n        view\n        returns (address _owner)\n    {\n        return _ownerOf(_tokenId);\n    }\n\n    function tokenMetadata(uint _tokenId)\n        public\n        view\n        returns (string _infoUrl)\n    {\n        return tokenIdToMetadata[_tokenId];\n    }\n\n    function approve(address _to, uint _tokenId)\n        public\n        onlyExtantToken(_tokenId)\n    {\n        require(msg.sender == ownerOf(_tokenId));\n        require(msg.sender != _to);\n\n        if (_getApproved(_tokenId) != address(0) ||\n                _to != address(0)) {\n            _approve(_to, _tokenId);\n            Approval(msg.sender, _to, _tokenId);\n        }\n    }\n\n    function transferFrom(address _from, address _to, uint _tokenId)\n        public\n        onlyExtantToken(_tokenId)\n    {\n        require(getApproved(_tokenId) == msg.sender);\n        require(ownerOf(_tokenId) == _from);\n        require(_to != address(0));\n\n        _clearApprovalAndTransfer(_from, _to, _tokenId);\n\n        Approval(_from, 0, _tokenId);\n        Transfer(_from, _to, _tokenId);\n    }\n\n    function transfer(address _to, uint _tokenId)\n        public\n        onlyExtantToken(_tokenId)\n    {\n        require(ownerOf(_tokenId) == msg.sender);\n        require(_to != address(0));\n\n        _clearApprovalAndTransfer(msg.sender, _to, _tokenId);\n\n        Approval(msg.sender, 0, _tokenId);\n        Transfer(msg.sender, _to, _tokenId);\n    }\n\n    function tokenOfOwnerByIndex(address _owner, uint _index)\n        public\n        view\n        returns (uint _tokenId)\n    {\n        return _getOwnerTokenByIndex(_owner, _index);\n    }\n\n    function getOwnerTokens(address _owner)\n        public\n        view\n        returns (uint[] _tokenIds)\n    {\n        return _getOwnerTokens(_owner);\n    }\n\n    function implementsERC721()\n        public\n        view\n        returns (bool _implementsERC721)\n    {\n        return true;\n    }\n\n    function getApproved(uint _tokenId)\n        public\n        view\n        returns (address _approved)\n    {\n        return _getApproved(_tokenId);\n    }\n\n    function _clearApprovalAndTransfer(address _from, address _to, uint _tokenId)\n        internal\n    {\n        _clearTokenApproval(_tokenId);\n        _removeTokenFromOwnersList(_from, _tokenId);\n        _setTokenOwner(_tokenId, _to);\n        _addTokenToOwnersList(_to, _tokenId);\n    }\n\n    function _ownerOf(uint _tokenId)\n        internal\n        view\n        returns (address _owner)\n    {\n        return tokenIdToOwner[_tokenId];\n    }\n\n    function _approve(address _to, uint _tokenId)\n        internal\n    {\n        tokenIdToApprovedAddress[_tokenId] = _to;\n    }\n\n    function _getApproved(uint _tokenId)\n        internal\n        view\n        returns (address _approved)\n    {\n        return tokenIdToApprovedAddress[_tokenId];\n    }\n\n    function _getOwnerTokens(address _owner)\n        internal\n        view\n        returns (uint[] _tokens)\n    {\n        return ownerToTokensOwned[_owner];\n    }\n\n    function _getOwnerTokenByIndex(address _owner, uint _index)\n        internal\n        view\n        returns (uint _tokens)\n    {\n        return ownerToTokensOwned[_owner][_index];\n    }\n\n    function _clearTokenApproval(uint _tokenId)\n        internal\n    {\n        tokenIdToApprovedAddress[_tokenId] = address(0);\n    }\n\n    function _setTokenOwner(uint _tokenId, address _owner)\n        internal\n    {\n        tokenIdToOwner[_tokenId] = _owner;\n    }\n\n    function _addTokenToOwnersList(address _owner, uint _tokenId)\n        internal\n    {\n        ownerToTokensOwned[_owner].push(_tokenId);\n        tokenIdToOwnerArrayIndex[_tokenId] =\n            ownerToTokensOwned[_owner].length - 1;\n    }\n\n    function _removeTokenFromOwnersList(address _owner, uint _tokenId)\n        internal\n    {\n        uint length = ownerToTokensOwned[_owner].length;\n        uint index = tokenIdToOwnerArrayIndex[_tokenId];\n        uint swapToken = ownerToTokensOwned[_owner][length - 1];\n\n        ownerToTokensOwned[_owner][index] = swapToken;\n        tokenIdToOwnerArrayIndex[swapToken] = index;\n\n        delete ownerToTokensOwned[_owner][length - 1];\n        ownerToTokensOwned[_owner].length--;\n    }\n\n    function _insertTokenMetadata(uint _tokenId, string _metadata)\n        internal\n    {\n        tokenIdToMetadata[_tokenId] = _metadata;\n    }\n}\n",
  "sourcePath": "NonFungibleToken/contracts/NonFungibleToken.sol",
  "ast": {
    "attributes": {
      "absolutePath": "NonFungibleToken/contracts/NonFungibleToken.sol",
      "exportedSymbols": {
        "NonFungibleToken": [
          5184
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
        "id": 4629,
        "name": "PragmaDirective",
        "src": "0:23:19"
      },
      {
        "attributes": {
          "SourceUnit": 4490,
          "absolutePath": "NonFungibleToken/contracts/DetailedERC721.sol",
          "file": "./DetailedERC721.sol",
          "scope": 5185,
          "symbolAliases": [
            null
          ],
          "unitAlias": ""
        },
        "id": 4630,
        "name": "ImportDirective",
        "src": "25:30:19"
      },
      {
        "attributes": {
          "contractDependencies": [
            4489,
            4562
          ],
          "contractKind": "contract",
          "documentation": "@title NonFungibleToken\n * Generic implementation for both required and optional functionality in\nthe ERC721 standard for non-fungible tokens.\n * Heavily inspired by Decentraland's generic implementation:\nhttps://github.com/decentraland/land/blob/master/contracts/BasicNFT.sol\n * Standard Author: dete\nImplementation Author: Nadav Hollander <nadav at dharma.io>",
          "fullyImplemented": true,
          "linearizedBaseContracts": [
            5184,
            4489,
            4562
          ],
          "name": "NonFungibleToken",
          "scope": 5185
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
                  "name": "DetailedERC721",
                  "referencedDeclaration": 4489,
                  "type": "contract DetailedERC721"
                },
                "id": 4631,
                "name": "UserDefinedTypeName",
                "src": "478:14:19"
              }
            ],
            "id": 4632,
            "name": "InheritanceSpecifier",
            "src": "478:14:19"
          },
          {
            "attributes": {
              "constant": false,
              "name": "name",
              "scope": 5184,
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
                "id": 4633,
                "name": "ElementaryTypeName",
                "src": "499:6:19"
              }
            ],
            "id": 4634,
            "name": "VariableDeclaration",
            "src": "499:18:19"
          },
          {
            "attributes": {
              "constant": false,
              "name": "symbol",
              "scope": 5184,
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
                "id": 4635,
                "name": "ElementaryTypeName",
                "src": "523:6:19"
              }
            ],
            "id": 4636,
            "name": "VariableDeclaration",
            "src": "523:20:19"
          },
          {
            "attributes": {
              "constant": false,
              "name": "numTokensTotal",
              "scope": 5184,
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
                "id": 4637,
                "name": "ElementaryTypeName",
                "src": "550:4:19"
              }
            ],
            "id": 4638,
            "name": "VariableDeclaration",
            "src": "550:26:19"
          },
          {
            "attributes": {
              "constant": false,
              "name": "tokenIdToOwner",
              "scope": 5184,
              "stateVariable": true,
              "storageLocation": "default",
              "type": "mapping(uint256 => address)",
              "value": null,
              "visibility": "internal"
            },
            "children": [
              {
                "attributes": {
                  "type": "mapping(uint256 => address)"
                },
                "children": [
                  {
                    "attributes": {
                      "name": "uint",
                      "type": "uint256"
                    },
                    "id": 4639,
                    "name": "ElementaryTypeName",
                    "src": "591:4:19"
                  },
                  {
                    "attributes": {
                      "name": "address",
                      "type": "address"
                    },
                    "id": 4640,
                    "name": "ElementaryTypeName",
                    "src": "599:7:19"
                  }
                ],
                "id": 4641,
                "name": "Mapping",
                "src": "583:24:19"
              }
            ],
            "id": 4642,
            "name": "VariableDeclaration",
            "src": "583:48:19"
          },
          {
            "attributes": {
              "constant": false,
              "name": "tokenIdToApprovedAddress",
              "scope": 5184,
              "stateVariable": true,
              "storageLocation": "default",
              "type": "mapping(uint256 => address)",
              "value": null,
              "visibility": "internal"
            },
            "children": [
              {
                "attributes": {
                  "type": "mapping(uint256 => address)"
                },
                "children": [
                  {
                    "attributes": {
                      "name": "uint",
                      "type": "uint256"
                    },
                    "id": 4643,
                    "name": "ElementaryTypeName",
                    "src": "645:4:19"
                  },
                  {
                    "attributes": {
                      "name": "address",
                      "type": "address"
                    },
                    "id": 4644,
                    "name": "ElementaryTypeName",
                    "src": "653:7:19"
                  }
                ],
                "id": 4645,
                "name": "Mapping",
                "src": "637:24:19"
              }
            ],
            "id": 4646,
            "name": "VariableDeclaration",
            "src": "637:58:19"
          },
          {
            "attributes": {
              "constant": false,
              "name": "tokenIdToMetadata",
              "scope": 5184,
              "stateVariable": true,
              "storageLocation": "default",
              "type": "mapping(uint256 => string storage ref)",
              "value": null,
              "visibility": "internal"
            },
            "children": [
              {
                "attributes": {
                  "type": "mapping(uint256 => string storage ref)"
                },
                "children": [
                  {
                    "attributes": {
                      "name": "uint",
                      "type": "uint256"
                    },
                    "id": 4647,
                    "name": "ElementaryTypeName",
                    "src": "709:4:19"
                  },
                  {
                    "attributes": {
                      "name": "string",
                      "type": "string storage pointer"
                    },
                    "id": 4648,
                    "name": "ElementaryTypeName",
                    "src": "717:6:19"
                  }
                ],
                "id": 4649,
                "name": "Mapping",
                "src": "701:23:19"
              }
            ],
            "id": 4650,
            "name": "VariableDeclaration",
            "src": "701:50:19"
          },
          {
            "attributes": {
              "constant": false,
              "name": "ownerToTokensOwned",
              "scope": 5184,
              "stateVariable": true,
              "storageLocation": "default",
              "type": "mapping(address => uint256[] storage ref)",
              "value": null,
              "visibility": "internal"
            },
            "children": [
              {
                "attributes": {
                  "type": "mapping(address => uint256[] storage ref)"
                },
                "children": [
                  {
                    "attributes": {
                      "name": "address",
                      "type": "address"
                    },
                    "id": 4651,
                    "name": "ElementaryTypeName",
                    "src": "765:7:19"
                  },
                  {
                    "attributes": {
                      "length": null,
                      "type": "uint256[] storage pointer"
                    },
                    "children": [
                      {
                        "attributes": {
                          "name": "uint",
                          "type": "uint256"
                        },
                        "id": 4652,
                        "name": "ElementaryTypeName",
                        "src": "776:4:19"
                      }
                    ],
                    "id": 4653,
                    "name": "ArrayTypeName",
                    "src": "776:6:19"
                  }
                ],
                "id": 4654,
                "name": "Mapping",
                "src": "757:26:19"
              }
            ],
            "id": 4655,
            "name": "VariableDeclaration",
            "src": "757:54:19"
          },
          {
            "attributes": {
              "constant": false,
              "name": "tokenIdToOwnerArrayIndex",
              "scope": 5184,
              "stateVariable": true,
              "storageLocation": "default",
              "type": "mapping(uint256 => uint256)",
              "value": null,
              "visibility": "internal"
            },
            "children": [
              {
                "attributes": {
                  "type": "mapping(uint256 => uint256)"
                },
                "children": [
                  {
                    "attributes": {
                      "name": "uint",
                      "type": "uint256"
                    },
                    "id": 4656,
                    "name": "ElementaryTypeName",
                    "src": "825:4:19"
                  },
                  {
                    "attributes": {
                      "name": "uint",
                      "type": "uint256"
                    },
                    "id": 4657,
                    "name": "ElementaryTypeName",
                    "src": "833:4:19"
                  }
                ],
                "id": 4658,
                "name": "Mapping",
                "src": "817:21:19"
              }
            ],
            "id": 4659,
            "name": "VariableDeclaration",
            "src": "817:55:19"
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
                      "scope": 4667,
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
                        "id": 4660,
                        "name": "ElementaryTypeName",
                        "src": "903:7:19"
                      }
                    ],
                    "id": 4661,
                    "name": "VariableDeclaration",
                    "src": "903:21:19"
                  },
                  {
                    "attributes": {
                      "constant": false,
                      "indexed": true,
                      "name": "_to",
                      "scope": 4667,
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
                        "id": 4662,
                        "name": "ElementaryTypeName",
                        "src": "934:7:19"
                      }
                    ],
                    "id": 4663,
                    "name": "VariableDeclaration",
                    "src": "934:19:19"
                  },
                  {
                    "attributes": {
                      "constant": false,
                      "indexed": false,
                      "name": "_tokenId",
                      "scope": 4667,
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
                        "id": 4664,
                        "name": "ElementaryTypeName",
                        "src": "963:7:19"
                      }
                    ],
                    "id": 4665,
                    "name": "VariableDeclaration",
                    "src": "963:16:19"
                  }
                ],
                "id": 4666,
                "name": "ParameterList",
                "src": "893:92:19"
              }
            ],
            "id": 4667,
            "name": "EventDefinition",
            "src": "879:107:19"
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
                      "scope": 4675,
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
                        "id": 4668,
                        "name": "ElementaryTypeName",
                        "src": "1016:7:19"
                      }
                    ],
                    "id": 4669,
                    "name": "VariableDeclaration",
                    "src": "1016:22:19"
                  },
                  {
                    "attributes": {
                      "constant": false,
                      "indexed": true,
                      "name": "_approved",
                      "scope": 4675,
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
                        "id": 4670,
                        "name": "ElementaryTypeName",
                        "src": "1048:7:19"
                      }
                    ],
                    "id": 4671,
                    "name": "VariableDeclaration",
                    "src": "1048:25:19"
                  },
                  {
                    "attributes": {
                      "constant": false,
                      "indexed": false,
                      "name": "_tokenId",
                      "scope": 4675,
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
                        "id": 4672,
                        "name": "ElementaryTypeName",
                        "src": "1083:7:19"
                      }
                    ],
                    "id": 4673,
                    "name": "VariableDeclaration",
                    "src": "1083:16:19"
                  }
                ],
                "id": 4674,
                "name": "ParameterList",
                "src": "1006:99:19"
              }
            ],
            "id": 4675,
            "name": "EventDefinition",
            "src": "992:114:19"
          },
          {
            "attributes": {
              "name": "onlyExtantToken",
              "visibility": "internal"
            },
            "children": [
              {
                "children": [
                  {
                    "attributes": {
                      "constant": false,
                      "name": "_tokenId",
                      "scope": 4691,
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
                        "id": 4676,
                        "name": "ElementaryTypeName",
                        "src": "1137:4:19"
                      }
                    ],
                    "id": 4677,
                    "name": "VariableDeclaration",
                    "src": "1137:13:19"
                  }
                ],
                "id": 4678,
                "name": "ParameterList",
                "src": "1136:15:19"
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
                              "referencedDeclaration": 5488,
                              "type": "function (bool) pure",
                              "value": "require"
                            },
                            "id": 4679,
                            "name": "Identifier",
                            "src": "1162:7:19"
                          },
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
                                      "overloadedDeclarations": [
                                        4740
                                      ],
                                      "referencedDeclaration": 4740,
                                      "type": "function (uint256) view returns (address)",
                                      "value": "ownerOf"
                                    },
                                    "id": 4680,
                                    "name": "Identifier",
                                    "src": "1170:7:19"
                                  },
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "overloadedDeclarations": [
                                        null
                                      ],
                                      "referencedDeclaration": 4677,
                                      "type": "uint256",
                                      "value": "_tokenId"
                                    },
                                    "id": 4681,
                                    "name": "Identifier",
                                    "src": "1178:8:19"
                                  }
                                ],
                                "id": 4682,
                                "name": "FunctionCall",
                                "src": "1170:17:19"
                              },
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "isConstant": false,
                                  "isLValue": false,
                                  "isPure": true,
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
                                          "typeIdentifier": "t_rational_0_by_1",
                                          "typeString": "int_const 0"
                                        }
                                      ],
                                      "isConstant": false,
                                      "isLValue": false,
                                      "isPure": true,
                                      "lValueRequested": false,
                                      "type": "type(address)",
                                      "value": "address"
                                    },
                                    "id": 4683,
                                    "name": "ElementaryTypeNameExpression",
                                    "src": "1191:7:19"
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
                                    "id": 4684,
                                    "name": "Literal",
                                    "src": "1199:1:19"
                                  }
                                ],
                                "id": 4685,
                                "name": "FunctionCall",
                                "src": "1191:10:19"
                              }
                            ],
                            "id": 4686,
                            "name": "BinaryOperation",
                            "src": "1170:31:19"
                          }
                        ],
                        "id": 4687,
                        "name": "FunctionCall",
                        "src": "1162:40:19"
                      }
                    ],
                    "id": 4688,
                    "name": "ExpressionStatement",
                    "src": "1162:40:19"
                  },
                  {
                    "id": 4689,
                    "name": "PlaceholderStatement",
                    "src": "1212:1:19"
                  }
                ],
                "id": 4690,
                "name": "Block",
                "src": "1152:68:19"
              }
            ],
            "id": 4691,
            "name": "ModifierDefinition",
            "src": "1112:108:19"
          },
          {
            "attributes": {
              "constant": true,
              "implemented": true,
              "isConstructor": false,
              "modifiers": [
                null
              ],
              "name": "name",
              "payable": false,
              "scope": 5184,
              "stateMutability": "view",
              "superFunction": 4467,
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
                "id": 4692,
                "name": "ParameterList",
                "src": "1239:2:19"
              },
              {
                "children": [
                  {
                    "attributes": {
                      "constant": false,
                      "name": "_name",
                      "scope": 4699,
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
                        "id": 4693,
                        "name": "ElementaryTypeName",
                        "src": "1287:6:19"
                      }
                    ],
                    "id": 4694,
                    "name": "VariableDeclaration",
                    "src": "1287:12:19"
                  }
                ],
                "id": 4695,
                "name": "ParameterList",
                "src": "1286:14:19"
              },
              {
                "children": [
                  {
                    "attributes": {
                      "functionReturnParameters": 4695
                    },
                    "children": [
                      {
                        "attributes": {
                          "argumentTypes": null,
                          "overloadedDeclarations": [
                            4634
                          ],
                          "referencedDeclaration": 4634,
                          "type": "string storage ref",
                          "value": "name"
                        },
                        "id": 4696,
                        "name": "Identifier",
                        "src": "1322:4:19"
                      }
                    ],
                    "id": 4697,
                    "name": "Return",
                    "src": "1315:11:19"
                  }
                ],
                "id": 4698,
                "name": "Block",
                "src": "1305:28:19"
              }
            ],
            "id": 4699,
            "name": "FunctionDefinition",
            "src": "1226:107:19"
          },
          {
            "attributes": {
              "constant": true,
              "implemented": true,
              "isConstructor": false,
              "modifiers": [
                null
              ],
              "name": "symbol",
              "payable": false,
              "scope": 5184,
              "stateMutability": "view",
              "superFunction": 4472,
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
                "id": 4700,
                "name": "ParameterList",
                "src": "1354:2:19"
              },
              {
                "children": [
                  {
                    "attributes": {
                      "constant": false,
                      "name": "_symbol",
                      "scope": 4707,
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
                        "id": 4701,
                        "name": "ElementaryTypeName",
                        "src": "1402:6:19"
                      }
                    ],
                    "id": 4702,
                    "name": "VariableDeclaration",
                    "src": "1402:14:19"
                  }
                ],
                "id": 4703,
                "name": "ParameterList",
                "src": "1401:16:19"
              },
              {
                "children": [
                  {
                    "attributes": {
                      "functionReturnParameters": 4703
                    },
                    "children": [
                      {
                        "attributes": {
                          "argumentTypes": null,
                          "overloadedDeclarations": [
                            4636
                          ],
                          "referencedDeclaration": 4636,
                          "type": "string storage ref",
                          "value": "symbol"
                        },
                        "id": 4704,
                        "name": "Identifier",
                        "src": "1439:6:19"
                      }
                    ],
                    "id": 4705,
                    "name": "Return",
                    "src": "1432:13:19"
                  }
                ],
                "id": 4706,
                "name": "Block",
                "src": "1422:30:19"
              }
            ],
            "id": 4707,
            "name": "FunctionDefinition",
            "src": "1339:113:19"
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
              "scope": 5184,
              "stateMutability": "view",
              "superFunction": 4496,
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
                "id": 4708,
                "name": "ParameterList",
                "src": "1478:2:19"
              },
              {
                "children": [
                  {
                    "attributes": {
                      "constant": false,
                      "name": "_totalSupply",
                      "scope": 4715,
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
                        "id": 4709,
                        "name": "ElementaryTypeName",
                        "src": "1526:7:19"
                      }
                    ],
                    "id": 4710,
                    "name": "VariableDeclaration",
                    "src": "1526:20:19"
                  }
                ],
                "id": 4711,
                "name": "ParameterList",
                "src": "1525:22:19"
              },
              {
                "children": [
                  {
                    "attributes": {
                      "functionReturnParameters": 4711
                    },
                    "children": [
                      {
                        "attributes": {
                          "argumentTypes": null,
                          "overloadedDeclarations": [
                            null
                          ],
                          "referencedDeclaration": 4638,
                          "type": "uint256",
                          "value": "numTokensTotal"
                        },
                        "id": 4712,
                        "name": "Identifier",
                        "src": "1569:14:19"
                      }
                    ],
                    "id": 4713,
                    "name": "Return",
                    "src": "1562:21:19"
                  }
                ],
                "id": 4714,
                "name": "Block",
                "src": "1552:38:19"
              }
            ],
            "id": 4715,
            "name": "FunctionDefinition",
            "src": "1458:132:19"
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
              "scope": 5184,
              "stateMutability": "view",
              "superFunction": 4503,
              "visibility": "public"
            },
            "children": [
              {
                "children": [
                  {
                    "attributes": {
                      "constant": false,
                      "name": "_owner",
                      "scope": 4728,
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
                        "id": 4716,
                        "name": "ElementaryTypeName",
                        "src": "1615:7:19"
                      }
                    ],
                    "id": 4717,
                    "name": "VariableDeclaration",
                    "src": "1615:14:19"
                  }
                ],
                "id": 4718,
                "name": "ParameterList",
                "src": "1614:16:19"
              },
              {
                "children": [
                  {
                    "attributes": {
                      "constant": false,
                      "name": "_balance",
                      "scope": 4728,
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
                        "src": "1676:4:19"
                      }
                    ],
                    "id": 4720,
                    "name": "VariableDeclaration",
                    "src": "1676:13:19"
                  }
                ],
                "id": 4721,
                "name": "ParameterList",
                "src": "1675:15:19"
              },
              {
                "children": [
                  {
                    "attributes": {
                      "functionReturnParameters": 4721
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
                              "type": "uint256[] storage ref"
                            },
                            "children": [
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "overloadedDeclarations": [
                                    null
                                  ],
                                  "referencedDeclaration": 4655,
                                  "type": "mapping(address => uint256[] storage ref)",
                                  "value": "ownerToTokensOwned"
                                },
                                "id": 4722,
                                "name": "Identifier",
                                "src": "1712:18:19"
                              },
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "overloadedDeclarations": [
                                    null
                                  ],
                                  "referencedDeclaration": 4717,
                                  "type": "address",
                                  "value": "_owner"
                                },
                                "id": 4723,
                                "name": "Identifier",
                                "src": "1731:6:19"
                              }
                            ],
                            "id": 4724,
                            "name": "IndexAccess",
                            "src": "1712:26:19"
                          }
                        ],
                        "id": 4725,
                        "name": "MemberAccess",
                        "src": "1712:33:19"
                      }
                    ],
                    "id": 4726,
                    "name": "Return",
                    "src": "1705:40:19"
                  }
                ],
                "id": 4727,
                "name": "Block",
                "src": "1695:57:19"
              }
            ],
            "id": 4728,
            "name": "FunctionDefinition",
            "src": "1596:156:19"
          },
          {
            "attributes": {
              "constant": true,
              "implemented": true,
              "isConstructor": false,
              "modifiers": [
                null
              ],
              "name": "ownerOf",
              "payable": false,
              "scope": 5184,
              "stateMutability": "view",
              "superFunction": 4510,
              "visibility": "public"
            },
            "children": [
              {
                "children": [
                  {
                    "attributes": {
                      "constant": false,
                      "name": "_tokenId",
                      "scope": 4740,
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
                        "id": 4729,
                        "name": "ElementaryTypeName",
                        "src": "1775:4:19"
                      }
                    ],
                    "id": 4730,
                    "name": "VariableDeclaration",
                    "src": "1775:13:19"
                  }
                ],
                "id": 4731,
                "name": "ParameterList",
                "src": "1774:15:19"
              },
              {
                "children": [
                  {
                    "attributes": {
                      "constant": false,
                      "name": "_owner",
                      "scope": 4740,
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
                        "id": 4732,
                        "name": "ElementaryTypeName",
                        "src": "1835:7:19"
                      }
                    ],
                    "id": 4733,
                    "name": "VariableDeclaration",
                    "src": "1835:14:19"
                  }
                ],
                "id": 4734,
                "name": "ParameterList",
                "src": "1834:16:19"
              },
              {
                "children": [
                  {
                    "attributes": {
                      "functionReturnParameters": 4734
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
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 5000,
                              "type": "function (uint256) view returns (address)",
                              "value": "_ownerOf"
                            },
                            "id": 4735,
                            "name": "Identifier",
                            "src": "1872:8:19"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4730,
                              "type": "uint256",
                              "value": "_tokenId"
                            },
                            "id": 4736,
                            "name": "Identifier",
                            "src": "1881:8:19"
                          }
                        ],
                        "id": 4737,
                        "name": "FunctionCall",
                        "src": "1872:18:19"
                      }
                    ],
                    "id": 4738,
                    "name": "Return",
                    "src": "1865:25:19"
                  }
                ],
                "id": 4739,
                "name": "Block",
                "src": "1855:42:19"
              }
            ],
            "id": 4740,
            "name": "FunctionDefinition",
            "src": "1758:139:19"
          },
          {
            "attributes": {
              "constant": true,
              "implemented": true,
              "isConstructor": false,
              "modifiers": [
                null
              ],
              "name": "tokenMetadata",
              "payable": false,
              "scope": 5184,
              "stateMutability": "view",
              "superFunction": 4479,
              "visibility": "public"
            },
            "children": [
              {
                "children": [
                  {
                    "attributes": {
                      "constant": false,
                      "name": "_tokenId",
                      "scope": 4752,
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
                        "id": 4741,
                        "name": "ElementaryTypeName",
                        "src": "1926:4:19"
                      }
                    ],
                    "id": 4742,
                    "name": "VariableDeclaration",
                    "src": "1926:13:19"
                  }
                ],
                "id": 4743,
                "name": "ParameterList",
                "src": "1925:15:19"
              },
              {
                "children": [
                  {
                    "attributes": {
                      "constant": false,
                      "name": "_infoUrl",
                      "scope": 4752,
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
                        "id": 4744,
                        "name": "ElementaryTypeName",
                        "src": "1986:6:19"
                      }
                    ],
                    "id": 4745,
                    "name": "VariableDeclaration",
                    "src": "1986:15:19"
                  }
                ],
                "id": 4746,
                "name": "ParameterList",
                "src": "1985:17:19"
              },
              {
                "children": [
                  {
                    "attributes": {
                      "functionReturnParameters": 4746
                    },
                    "children": [
                      {
                        "attributes": {
                          "argumentTypes": null,
                          "isConstant": false,
                          "isLValue": true,
                          "isPure": false,
                          "lValueRequested": false,
                          "type": "string storage ref"
                        },
                        "children": [
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4650,
                              "type": "mapping(uint256 => string storage ref)",
                              "value": "tokenIdToMetadata"
                            },
                            "id": 4747,
                            "name": "Identifier",
                            "src": "2024:17:19"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4742,
                              "type": "uint256",
                              "value": "_tokenId"
                            },
                            "id": 4748,
                            "name": "Identifier",
                            "src": "2042:8:19"
                          }
                        ],
                        "id": 4749,
                        "name": "IndexAccess",
                        "src": "2024:27:19"
                      }
                    ],
                    "id": 4750,
                    "name": "Return",
                    "src": "2017:34:19"
                  }
                ],
                "id": 4751,
                "name": "Block",
                "src": "2007:51:19"
              }
            ],
            "id": 4752,
            "name": "FunctionDefinition",
            "src": "1903:155:19"
          },
          {
            "attributes": {
              "constant": false,
              "implemented": true,
              "isConstructor": false,
              "name": "approve",
              "payable": false,
              "scope": 5184,
              "stateMutability": "nonpayable",
              "superFunction": 4517,
              "visibility": "public"
            },
            "children": [
              {
                "children": [
                  {
                    "attributes": {
                      "constant": false,
                      "name": "_to",
                      "scope": 4806,
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
                        "id": 4753,
                        "name": "ElementaryTypeName",
                        "src": "2081:7:19"
                      }
                    ],
                    "id": 4754,
                    "name": "VariableDeclaration",
                    "src": "2081:11:19"
                  },
                  {
                    "attributes": {
                      "constant": false,
                      "name": "_tokenId",
                      "scope": 4806,
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
                        "id": 4755,
                        "name": "ElementaryTypeName",
                        "src": "2094:4:19"
                      }
                    ],
                    "id": 4756,
                    "name": "VariableDeclaration",
                    "src": "2094:13:19"
                  }
                ],
                "id": 4757,
                "name": "ParameterList",
                "src": "2080:28:19"
              },
              {
                "attributes": {
                  "parameters": [
                    null
                  ]
                },
                "children": [],
                "id": 4761,
                "name": "ParameterList",
                "src": "2162:0:19"
              },
              {
                "children": [
                  {
                    "attributes": {
                      "argumentTypes": null,
                      "overloadedDeclarations": [
                        null
                      ],
                      "referencedDeclaration": 4691,
                      "type": "modifier (uint256)",
                      "value": "onlyExtantToken"
                    },
                    "id": 4758,
                    "name": "Identifier",
                    "src": "2132:15:19"
                  },
                  {
                    "attributes": {
                      "argumentTypes": null,
                      "overloadedDeclarations": [
                        null
                      ],
                      "referencedDeclaration": 4756,
                      "type": "uint256",
                      "value": "_tokenId"
                    },
                    "id": 4759,
                    "name": "Identifier",
                    "src": "2148:8:19"
                  }
                ],
                "id": 4760,
                "name": "ModifierInvocation",
                "src": "2132:25:19"
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
                              "referencedDeclaration": 5488,
                              "type": "function (bool) pure",
                              "value": "require"
                            },
                            "id": 4762,
                            "name": "Identifier",
                            "src": "2172:7:19"
                          },
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
                                      "referencedDeclaration": 5485,
                                      "type": "msg",
                                      "value": "msg"
                                    },
                                    "id": 4763,
                                    "name": "Identifier",
                                    "src": "2180:3:19"
                                  }
                                ],
                                "id": 4764,
                                "name": "MemberAccess",
                                "src": "2180:10:19"
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
                                      "overloadedDeclarations": [
                                        4740
                                      ],
                                      "referencedDeclaration": 4740,
                                      "type": "function (uint256) view returns (address)",
                                      "value": "ownerOf"
                                    },
                                    "id": 4765,
                                    "name": "Identifier",
                                    "src": "2194:7:19"
                                  },
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "overloadedDeclarations": [
                                        null
                                      ],
                                      "referencedDeclaration": 4756,
                                      "type": "uint256",
                                      "value": "_tokenId"
                                    },
                                    "id": 4766,
                                    "name": "Identifier",
                                    "src": "2202:8:19"
                                  }
                                ],
                                "id": 4767,
                                "name": "FunctionCall",
                                "src": "2194:17:19"
                              }
                            ],
                            "id": 4768,
                            "name": "BinaryOperation",
                            "src": "2180:31:19"
                          }
                        ],
                        "id": 4769,
                        "name": "FunctionCall",
                        "src": "2172:40:19"
                      }
                    ],
                    "id": 4770,
                    "name": "ExpressionStatement",
                    "src": "2172:40:19"
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
                              "referencedDeclaration": 5488,
                              "type": "function (bool) pure",
                              "value": "require"
                            },
                            "id": 4771,
                            "name": "Identifier",
                            "src": "2222:7:19"
                          },
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
                                      "referencedDeclaration": 5485,
                                      "type": "msg",
                                      "value": "msg"
                                    },
                                    "id": 4772,
                                    "name": "Identifier",
                                    "src": "2230:3:19"
                                  }
                                ],
                                "id": 4773,
                                "name": "MemberAccess",
                                "src": "2230:10:19"
                              },
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "overloadedDeclarations": [
                                    null
                                  ],
                                  "referencedDeclaration": 4754,
                                  "type": "address",
                                  "value": "_to"
                                },
                                "id": 4774,
                                "name": "Identifier",
                                "src": "2244:3:19"
                              }
                            ],
                            "id": 4775,
                            "name": "BinaryOperation",
                            "src": "2230:17:19"
                          }
                        ],
                        "id": 4776,
                        "name": "FunctionCall",
                        "src": "2222:26:19"
                      }
                    ],
                    "id": 4777,
                    "name": "ExpressionStatement",
                    "src": "2222:26:19"
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
                                      "overloadedDeclarations": [
                                        null
                                      ],
                                      "referencedDeclaration": 5026,
                                      "type": "function (uint256) view returns (address)",
                                      "value": "_getApproved"
                                    },
                                    "id": 4778,
                                    "name": "Identifier",
                                    "src": "2263:12:19"
                                  },
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "overloadedDeclarations": [
                                        null
                                      ],
                                      "referencedDeclaration": 4756,
                                      "type": "uint256",
                                      "value": "_tokenId"
                                    },
                                    "id": 4779,
                                    "name": "Identifier",
                                    "src": "2276:8:19"
                                  }
                                ],
                                "id": 4780,
                                "name": "FunctionCall",
                                "src": "2263:22:19"
                              },
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "isConstant": false,
                                  "isLValue": false,
                                  "isPure": true,
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
                                          "typeIdentifier": "t_rational_0_by_1",
                                          "typeString": "int_const 0"
                                        }
                                      ],
                                      "isConstant": false,
                                      "isLValue": false,
                                      "isPure": true,
                                      "lValueRequested": false,
                                      "type": "type(address)",
                                      "value": "address"
                                    },
                                    "id": 4781,
                                    "name": "ElementaryTypeNameExpression",
                                    "src": "2289:7:19"
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
                                    "id": 4782,
                                    "name": "Literal",
                                    "src": "2297:1:19"
                                  }
                                ],
                                "id": 4783,
                                "name": "FunctionCall",
                                "src": "2289:10:19"
                              }
                            ],
                            "id": 4784,
                            "name": "BinaryOperation",
                            "src": "2263:36:19"
                          },
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
                                  "referencedDeclaration": 4754,
                                  "type": "address",
                                  "value": "_to"
                                },
                                "id": 4785,
                                "name": "Identifier",
                                "src": "2319:3:19"
                              },
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "isConstant": false,
                                  "isLValue": false,
                                  "isPure": true,
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
                                          "typeIdentifier": "t_rational_0_by_1",
                                          "typeString": "int_const 0"
                                        }
                                      ],
                                      "isConstant": false,
                                      "isLValue": false,
                                      "isPure": true,
                                      "lValueRequested": false,
                                      "type": "type(address)",
                                      "value": "address"
                                    },
                                    "id": 4786,
                                    "name": "ElementaryTypeNameExpression",
                                    "src": "2326:7:19"
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
                                    "id": 4787,
                                    "name": "Literal",
                                    "src": "2334:1:19"
                                  }
                                ],
                                "id": 4788,
                                "name": "FunctionCall",
                                "src": "2326:10:19"
                              }
                            ],
                            "id": 4789,
                            "name": "BinaryOperation",
                            "src": "2319:17:19"
                          }
                        ],
                        "id": 4790,
                        "name": "BinaryOperation",
                        "src": "2263:73:19"
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
                                      "referencedDeclaration": 5014,
                                      "type": "function (address,uint256)",
                                      "value": "_approve"
                                    },
                                    "id": 4791,
                                    "name": "Identifier",
                                    "src": "2352:8:19"
                                  },
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "overloadedDeclarations": [
                                        null
                                      ],
                                      "referencedDeclaration": 4754,
                                      "type": "address",
                                      "value": "_to"
                                    },
                                    "id": 4792,
                                    "name": "Identifier",
                                    "src": "2361:3:19"
                                  },
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "overloadedDeclarations": [
                                        null
                                      ],
                                      "referencedDeclaration": 4756,
                                      "type": "uint256",
                                      "value": "_tokenId"
                                    },
                                    "id": 4793,
                                    "name": "Identifier",
                                    "src": "2366:8:19"
                                  }
                                ],
                                "id": 4794,
                                "name": "FunctionCall",
                                "src": "2352:23:19"
                              }
                            ],
                            "id": 4795,
                            "name": "ExpressionStatement",
                            "src": "2352:23:19"
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
                                        4675
                                      ],
                                      "referencedDeclaration": 4675,
                                      "type": "function (address,address,uint256)",
                                      "value": "Approval"
                                    },
                                    "id": 4796,
                                    "name": "Identifier",
                                    "src": "2389:8:19"
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
                                          "referencedDeclaration": 5485,
                                          "type": "msg",
                                          "value": "msg"
                                        },
                                        "id": 4797,
                                        "name": "Identifier",
                                        "src": "2398:3:19"
                                      }
                                    ],
                                    "id": 4798,
                                    "name": "MemberAccess",
                                    "src": "2398:10:19"
                                  },
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "overloadedDeclarations": [
                                        null
                                      ],
                                      "referencedDeclaration": 4754,
                                      "type": "address",
                                      "value": "_to"
                                    },
                                    "id": 4799,
                                    "name": "Identifier",
                                    "src": "2410:3:19"
                                  },
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "overloadedDeclarations": [
                                        null
                                      ],
                                      "referencedDeclaration": 4756,
                                      "type": "uint256",
                                      "value": "_tokenId"
                                    },
                                    "id": 4800,
                                    "name": "Identifier",
                                    "src": "2415:8:19"
                                  }
                                ],
                                "id": 4801,
                                "name": "FunctionCall",
                                "src": "2389:35:19"
                              }
                            ],
                            "id": 4802,
                            "name": "ExpressionStatement",
                            "src": "2389:35:19"
                          }
                        ],
                        "id": 4803,
                        "name": "Block",
                        "src": "2338:97:19"
                      }
                    ],
                    "id": 4804,
                    "name": "IfStatement",
                    "src": "2259:176:19"
                  }
                ],
                "id": 4805,
                "name": "Block",
                "src": "2162:279:19"
              }
            ],
            "id": 4806,
            "name": "FunctionDefinition",
            "src": "2064:377:19"
          },
          {
            "attributes": {
              "constant": false,
              "implemented": true,
              "isConstructor": false,
              "name": "transferFrom",
              "payable": false,
              "scope": 5184,
              "stateMutability": "nonpayable",
              "superFunction": 4533,
              "visibility": "public"
            },
            "children": [
              {
                "children": [
                  {
                    "attributes": {
                      "constant": false,
                      "name": "_from",
                      "scope": 4862,
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
                        "src": "2469:7:19"
                      }
                    ],
                    "id": 4808,
                    "name": "VariableDeclaration",
                    "src": "2469:13:19"
                  },
                  {
                    "attributes": {
                      "constant": false,
                      "name": "_to",
                      "scope": 4862,
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
                        "id": 4809,
                        "name": "ElementaryTypeName",
                        "src": "2484:7:19"
                      }
                    ],
                    "id": 4810,
                    "name": "VariableDeclaration",
                    "src": "2484:11:19"
                  },
                  {
                    "attributes": {
                      "constant": false,
                      "name": "_tokenId",
                      "scope": 4862,
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
                        "id": 4811,
                        "name": "ElementaryTypeName",
                        "src": "2497:4:19"
                      }
                    ],
                    "id": 4812,
                    "name": "VariableDeclaration",
                    "src": "2497:13:19"
                  }
                ],
                "id": 4813,
                "name": "ParameterList",
                "src": "2468:43:19"
              },
              {
                "attributes": {
                  "parameters": [
                    null
                  ]
                },
                "children": [],
                "id": 4817,
                "name": "ParameterList",
                "src": "2565:0:19"
              },
              {
                "children": [
                  {
                    "attributes": {
                      "argumentTypes": null,
                      "overloadedDeclarations": [
                        null
                      ],
                      "referencedDeclaration": 4691,
                      "type": "modifier (uint256)",
                      "value": "onlyExtantToken"
                    },
                    "id": 4814,
                    "name": "Identifier",
                    "src": "2535:15:19"
                  },
                  {
                    "attributes": {
                      "argumentTypes": null,
                      "overloadedDeclarations": [
                        null
                      ],
                      "referencedDeclaration": 4812,
                      "type": "uint256",
                      "value": "_tokenId"
                    },
                    "id": 4815,
                    "name": "Identifier",
                    "src": "2551:8:19"
                  }
                ],
                "id": 4816,
                "name": "ModifierInvocation",
                "src": "2535:25:19"
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
                              "referencedDeclaration": 5488,
                              "type": "function (bool) pure",
                              "value": "require"
                            },
                            "id": 4818,
                            "name": "Identifier",
                            "src": "2575:7:19"
                          },
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
                                      "overloadedDeclarations": [
                                        4959
                                      ],
                                      "referencedDeclaration": 4959,
                                      "type": "function (uint256) view returns (address)",
                                      "value": "getApproved"
                                    },
                                    "id": 4819,
                                    "name": "Identifier",
                                    "src": "2583:11:19"
                                  },
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "overloadedDeclarations": [
                                        null
                                      ],
                                      "referencedDeclaration": 4812,
                                      "type": "uint256",
                                      "value": "_tokenId"
                                    },
                                    "id": 4820,
                                    "name": "Identifier",
                                    "src": "2595:8:19"
                                  }
                                ],
                                "id": 4821,
                                "name": "FunctionCall",
                                "src": "2583:21:19"
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
                                      "referencedDeclaration": 5485,
                                      "type": "msg",
                                      "value": "msg"
                                    },
                                    "id": 4822,
                                    "name": "Identifier",
                                    "src": "2608:3:19"
                                  }
                                ],
                                "id": 4823,
                                "name": "MemberAccess",
                                "src": "2608:10:19"
                              }
                            ],
                            "id": 4824,
                            "name": "BinaryOperation",
                            "src": "2583:35:19"
                          }
                        ],
                        "id": 4825,
                        "name": "FunctionCall",
                        "src": "2575:44:19"
                      }
                    ],
                    "id": 4826,
                    "name": "ExpressionStatement",
                    "src": "2575:44:19"
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
                              "referencedDeclaration": 5488,
                              "type": "function (bool) pure",
                              "value": "require"
                            },
                            "id": 4827,
                            "name": "Identifier",
                            "src": "2629:7:19"
                          },
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
                                      "overloadedDeclarations": [
                                        4740
                                      ],
                                      "referencedDeclaration": 4740,
                                      "type": "function (uint256) view returns (address)",
                                      "value": "ownerOf"
                                    },
                                    "id": 4828,
                                    "name": "Identifier",
                                    "src": "2637:7:19"
                                  },
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "overloadedDeclarations": [
                                        null
                                      ],
                                      "referencedDeclaration": 4812,
                                      "type": "uint256",
                                      "value": "_tokenId"
                                    },
                                    "id": 4829,
                                    "name": "Identifier",
                                    "src": "2645:8:19"
                                  }
                                ],
                                "id": 4830,
                                "name": "FunctionCall",
                                "src": "2637:17:19"
                              },
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "overloadedDeclarations": [
                                    null
                                  ],
                                  "referencedDeclaration": 4808,
                                  "type": "address",
                                  "value": "_from"
                                },
                                "id": 4831,
                                "name": "Identifier",
                                "src": "2658:5:19"
                              }
                            ],
                            "id": 4832,
                            "name": "BinaryOperation",
                            "src": "2637:26:19"
                          }
                        ],
                        "id": 4833,
                        "name": "FunctionCall",
                        "src": "2629:35:19"
                      }
                    ],
                    "id": 4834,
                    "name": "ExpressionStatement",
                    "src": "2629:35:19"
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
                              "referencedDeclaration": 5488,
                              "type": "function (bool) pure",
                              "value": "require"
                            },
                            "id": 4835,
                            "name": "Identifier",
                            "src": "2674:7:19"
                          },
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
                                  "referencedDeclaration": 4810,
                                  "type": "address",
                                  "value": "_to"
                                },
                                "id": 4836,
                                "name": "Identifier",
                                "src": "2682:3:19"
                              },
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "isConstant": false,
                                  "isLValue": false,
                                  "isPure": true,
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
                                          "typeIdentifier": "t_rational_0_by_1",
                                          "typeString": "int_const 0"
                                        }
                                      ],
                                      "isConstant": false,
                                      "isLValue": false,
                                      "isPure": true,
                                      "lValueRequested": false,
                                      "type": "type(address)",
                                      "value": "address"
                                    },
                                    "id": 4837,
                                    "name": "ElementaryTypeNameExpression",
                                    "src": "2689:7:19"
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
                                    "id": 4838,
                                    "name": "Literal",
                                    "src": "2697:1:19"
                                  }
                                ],
                                "id": 4839,
                                "name": "FunctionCall",
                                "src": "2689:10:19"
                              }
                            ],
                            "id": 4840,
                            "name": "BinaryOperation",
                            "src": "2682:17:19"
                          }
                        ],
                        "id": 4841,
                        "name": "FunctionCall",
                        "src": "2674:26:19"
                      }
                    ],
                    "id": 4842,
                    "name": "ExpressionStatement",
                    "src": "2674:26:19"
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
                              "referencedDeclaration": 4988,
                              "type": "function (address,address,uint256)",
                              "value": "_clearApprovalAndTransfer"
                            },
                            "id": 4843,
                            "name": "Identifier",
                            "src": "2711:25:19"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4808,
                              "type": "address",
                              "value": "_from"
                            },
                            "id": 4844,
                            "name": "Identifier",
                            "src": "2737:5:19"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4810,
                              "type": "address",
                              "value": "_to"
                            },
                            "id": 4845,
                            "name": "Identifier",
                            "src": "2744:3:19"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4812,
                              "type": "uint256",
                              "value": "_tokenId"
                            },
                            "id": 4846,
                            "name": "Identifier",
                            "src": "2749:8:19"
                          }
                        ],
                        "id": 4847,
                        "name": "FunctionCall",
                        "src": "2711:47:19"
                      }
                    ],
                    "id": 4848,
                    "name": "ExpressionStatement",
                    "src": "2711:47:19"
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
                                  "typeIdentifier": "t_rational_0_by_1",
                                  "typeString": "int_const 0"
                                },
                                {
                                  "typeIdentifier": "t_uint256",
                                  "typeString": "uint256"
                                }
                              ],
                              "overloadedDeclarations": [
                                4675
                              ],
                              "referencedDeclaration": 4675,
                              "type": "function (address,address,uint256)",
                              "value": "Approval"
                            },
                            "id": 4849,
                            "name": "Identifier",
                            "src": "2769:8:19"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4808,
                              "type": "address",
                              "value": "_from"
                            },
                            "id": 4850,
                            "name": "Identifier",
                            "src": "2778:5:19"
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
                            "id": 4851,
                            "name": "Literal",
                            "src": "2785:1:19"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4812,
                              "type": "uint256",
                              "value": "_tokenId"
                            },
                            "id": 4852,
                            "name": "Identifier",
                            "src": "2788:8:19"
                          }
                        ],
                        "id": 4853,
                        "name": "FunctionCall",
                        "src": "2769:28:19"
                      }
                    ],
                    "id": 4854,
                    "name": "ExpressionStatement",
                    "src": "2769:28:19"
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
                                4667
                              ],
                              "referencedDeclaration": 4667,
                              "type": "function (address,address,uint256)",
                              "value": "Transfer"
                            },
                            "id": 4855,
                            "name": "Identifier",
                            "src": "2807:8:19"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4808,
                              "type": "address",
                              "value": "_from"
                            },
                            "id": 4856,
                            "name": "Identifier",
                            "src": "2816:5:19"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4810,
                              "type": "address",
                              "value": "_to"
                            },
                            "id": 4857,
                            "name": "Identifier",
                            "src": "2823:3:19"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4812,
                              "type": "uint256",
                              "value": "_tokenId"
                            },
                            "id": 4858,
                            "name": "Identifier",
                            "src": "2828:8:19"
                          }
                        ],
                        "id": 4859,
                        "name": "FunctionCall",
                        "src": "2807:30:19"
                      }
                    ],
                    "id": 4860,
                    "name": "ExpressionStatement",
                    "src": "2807:30:19"
                  }
                ],
                "id": 4861,
                "name": "Block",
                "src": "2565:279:19"
              }
            ],
            "id": 4862,
            "name": "FunctionDefinition",
            "src": "2447:397:19"
          },
          {
            "attributes": {
              "constant": false,
              "implemented": true,
              "isConstructor": false,
              "name": "transfer",
              "payable": false,
              "scope": 5184,
              "stateMutability": "nonpayable",
              "superFunction": 4540,
              "visibility": "public"
            },
            "children": [
              {
                "children": [
                  {
                    "attributes": {
                      "constant": false,
                      "name": "_to",
                      "scope": 4911,
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
                        "id": 4863,
                        "name": "ElementaryTypeName",
                        "src": "2868:7:19"
                      }
                    ],
                    "id": 4864,
                    "name": "VariableDeclaration",
                    "src": "2868:11:19"
                  },
                  {
                    "attributes": {
                      "constant": false,
                      "name": "_tokenId",
                      "scope": 4911,
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
                        "id": 4865,
                        "name": "ElementaryTypeName",
                        "src": "2881:4:19"
                      }
                    ],
                    "id": 4866,
                    "name": "VariableDeclaration",
                    "src": "2881:13:19"
                  }
                ],
                "id": 4867,
                "name": "ParameterList",
                "src": "2867:28:19"
              },
              {
                "attributes": {
                  "parameters": [
                    null
                  ]
                },
                "children": [],
                "id": 4871,
                "name": "ParameterList",
                "src": "2949:0:19"
              },
              {
                "children": [
                  {
                    "attributes": {
                      "argumentTypes": null,
                      "overloadedDeclarations": [
                        null
                      ],
                      "referencedDeclaration": 4691,
                      "type": "modifier (uint256)",
                      "value": "onlyExtantToken"
                    },
                    "id": 4868,
                    "name": "Identifier",
                    "src": "2919:15:19"
                  },
                  {
                    "attributes": {
                      "argumentTypes": null,
                      "overloadedDeclarations": [
                        null
                      ],
                      "referencedDeclaration": 4866,
                      "type": "uint256",
                      "value": "_tokenId"
                    },
                    "id": 4869,
                    "name": "Identifier",
                    "src": "2935:8:19"
                  }
                ],
                "id": 4870,
                "name": "ModifierInvocation",
                "src": "2919:25:19"
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
                              "referencedDeclaration": 5488,
                              "type": "function (bool) pure",
                              "value": "require"
                            },
                            "id": 4872,
                            "name": "Identifier",
                            "src": "2959:7:19"
                          },
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
                                      "overloadedDeclarations": [
                                        4740
                                      ],
                                      "referencedDeclaration": 4740,
                                      "type": "function (uint256) view returns (address)",
                                      "value": "ownerOf"
                                    },
                                    "id": 4873,
                                    "name": "Identifier",
                                    "src": "2967:7:19"
                                  },
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "overloadedDeclarations": [
                                        null
                                      ],
                                      "referencedDeclaration": 4866,
                                      "type": "uint256",
                                      "value": "_tokenId"
                                    },
                                    "id": 4874,
                                    "name": "Identifier",
                                    "src": "2975:8:19"
                                  }
                                ],
                                "id": 4875,
                                "name": "FunctionCall",
                                "src": "2967:17:19"
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
                                      "referencedDeclaration": 5485,
                                      "type": "msg",
                                      "value": "msg"
                                    },
                                    "id": 4876,
                                    "name": "Identifier",
                                    "src": "2988:3:19"
                                  }
                                ],
                                "id": 4877,
                                "name": "MemberAccess",
                                "src": "2988:10:19"
                              }
                            ],
                            "id": 4878,
                            "name": "BinaryOperation",
                            "src": "2967:31:19"
                          }
                        ],
                        "id": 4879,
                        "name": "FunctionCall",
                        "src": "2959:40:19"
                      }
                    ],
                    "id": 4880,
                    "name": "ExpressionStatement",
                    "src": "2959:40:19"
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
                              "referencedDeclaration": 5488,
                              "type": "function (bool) pure",
                              "value": "require"
                            },
                            "id": 4881,
                            "name": "Identifier",
                            "src": "3009:7:19"
                          },
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
                                  "referencedDeclaration": 4864,
                                  "type": "address",
                                  "value": "_to"
                                },
                                "id": 4882,
                                "name": "Identifier",
                                "src": "3017:3:19"
                              },
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "isConstant": false,
                                  "isLValue": false,
                                  "isPure": true,
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
                                          "typeIdentifier": "t_rational_0_by_1",
                                          "typeString": "int_const 0"
                                        }
                                      ],
                                      "isConstant": false,
                                      "isLValue": false,
                                      "isPure": true,
                                      "lValueRequested": false,
                                      "type": "type(address)",
                                      "value": "address"
                                    },
                                    "id": 4883,
                                    "name": "ElementaryTypeNameExpression",
                                    "src": "3024:7:19"
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
                                    "id": 4884,
                                    "name": "Literal",
                                    "src": "3032:1:19"
                                  }
                                ],
                                "id": 4885,
                                "name": "FunctionCall",
                                "src": "3024:10:19"
                              }
                            ],
                            "id": 4886,
                            "name": "BinaryOperation",
                            "src": "3017:17:19"
                          }
                        ],
                        "id": 4887,
                        "name": "FunctionCall",
                        "src": "3009:26:19"
                      }
                    ],
                    "id": 4888,
                    "name": "ExpressionStatement",
                    "src": "3009:26:19"
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
                              "referencedDeclaration": 4988,
                              "type": "function (address,address,uint256)",
                              "value": "_clearApprovalAndTransfer"
                            },
                            "id": 4889,
                            "name": "Identifier",
                            "src": "3046:25:19"
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
                                  "referencedDeclaration": 5485,
                                  "type": "msg",
                                  "value": "msg"
                                },
                                "id": 4890,
                                "name": "Identifier",
                                "src": "3072:3:19"
                              }
                            ],
                            "id": 4891,
                            "name": "MemberAccess",
                            "src": "3072:10:19"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4864,
                              "type": "address",
                              "value": "_to"
                            },
                            "id": 4892,
                            "name": "Identifier",
                            "src": "3084:3:19"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4866,
                              "type": "uint256",
                              "value": "_tokenId"
                            },
                            "id": 4893,
                            "name": "Identifier",
                            "src": "3089:8:19"
                          }
                        ],
                        "id": 4894,
                        "name": "FunctionCall",
                        "src": "3046:52:19"
                      }
                    ],
                    "id": 4895,
                    "name": "ExpressionStatement",
                    "src": "3046:52:19"
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
                                  "typeIdentifier": "t_rational_0_by_1",
                                  "typeString": "int_const 0"
                                },
                                {
                                  "typeIdentifier": "t_uint256",
                                  "typeString": "uint256"
                                }
                              ],
                              "overloadedDeclarations": [
                                4675
                              ],
                              "referencedDeclaration": 4675,
                              "type": "function (address,address,uint256)",
                              "value": "Approval"
                            },
                            "id": 4896,
                            "name": "Identifier",
                            "src": "3109:8:19"
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
                                  "referencedDeclaration": 5485,
                                  "type": "msg",
                                  "value": "msg"
                                },
                                "id": 4897,
                                "name": "Identifier",
                                "src": "3118:3:19"
                              }
                            ],
                            "id": 4898,
                            "name": "MemberAccess",
                            "src": "3118:10:19"
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
                            "id": 4899,
                            "name": "Literal",
                            "src": "3130:1:19"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4866,
                              "type": "uint256",
                              "value": "_tokenId"
                            },
                            "id": 4900,
                            "name": "Identifier",
                            "src": "3133:8:19"
                          }
                        ],
                        "id": 4901,
                        "name": "FunctionCall",
                        "src": "3109:33:19"
                      }
                    ],
                    "id": 4902,
                    "name": "ExpressionStatement",
                    "src": "3109:33:19"
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
                                4667
                              ],
                              "referencedDeclaration": 4667,
                              "type": "function (address,address,uint256)",
                              "value": "Transfer"
                            },
                            "id": 4903,
                            "name": "Identifier",
                            "src": "3152:8:19"
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
                                  "referencedDeclaration": 5485,
                                  "type": "msg",
                                  "value": "msg"
                                },
                                "id": 4904,
                                "name": "Identifier",
                                "src": "3161:3:19"
                              }
                            ],
                            "id": 4905,
                            "name": "MemberAccess",
                            "src": "3161:10:19"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4864,
                              "type": "address",
                              "value": "_to"
                            },
                            "id": 4906,
                            "name": "Identifier",
                            "src": "3173:3:19"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4866,
                              "type": "uint256",
                              "value": "_tokenId"
                            },
                            "id": 4907,
                            "name": "Identifier",
                            "src": "3178:8:19"
                          }
                        ],
                        "id": 4908,
                        "name": "FunctionCall",
                        "src": "3152:35:19"
                      }
                    ],
                    "id": 4909,
                    "name": "ExpressionStatement",
                    "src": "3152:35:19"
                  }
                ],
                "id": 4910,
                "name": "Block",
                "src": "2949:245:19"
              }
            ],
            "id": 4911,
            "name": "FunctionDefinition",
            "src": "2850:344:19"
          },
          {
            "attributes": {
              "constant": true,
              "implemented": true,
              "isConstructor": false,
              "modifiers": [
                null
              ],
              "name": "tokenOfOwnerByIndex",
              "payable": false,
              "scope": 5184,
              "stateMutability": "view",
              "superFunction": 4488,
              "visibility": "public"
            },
            "children": [
              {
                "children": [
                  {
                    "attributes": {
                      "constant": false,
                      "name": "_owner",
                      "scope": 4926,
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
                        "id": 4912,
                        "name": "ElementaryTypeName",
                        "src": "3229:7:19"
                      }
                    ],
                    "id": 4913,
                    "name": "VariableDeclaration",
                    "src": "3229:14:19"
                  },
                  {
                    "attributes": {
                      "constant": false,
                      "name": "_index",
                      "scope": 4926,
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
                        "id": 4914,
                        "name": "ElementaryTypeName",
                        "src": "3245:4:19"
                      }
                    ],
                    "id": 4915,
                    "name": "VariableDeclaration",
                    "src": "3245:11:19"
                  }
                ],
                "id": 4916,
                "name": "ParameterList",
                "src": "3228:29:19"
              },
              {
                "children": [
                  {
                    "attributes": {
                      "constant": false,
                      "name": "_tokenId",
                      "scope": 4926,
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
                        "id": 4917,
                        "name": "ElementaryTypeName",
                        "src": "3303:4:19"
                      }
                    ],
                    "id": 4918,
                    "name": "VariableDeclaration",
                    "src": "3303:13:19"
                  }
                ],
                "id": 4919,
                "name": "ParameterList",
                "src": "3302:15:19"
              },
              {
                "children": [
                  {
                    "attributes": {
                      "functionReturnParameters": 4919
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
                              "referencedDeclaration": 5055,
                              "type": "function (address,uint256) view returns (uint256)",
                              "value": "_getOwnerTokenByIndex"
                            },
                            "id": 4920,
                            "name": "Identifier",
                            "src": "3339:21:19"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4913,
                              "type": "address",
                              "value": "_owner"
                            },
                            "id": 4921,
                            "name": "Identifier",
                            "src": "3361:6:19"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4915,
                              "type": "uint256",
                              "value": "_index"
                            },
                            "id": 4922,
                            "name": "Identifier",
                            "src": "3369:6:19"
                          }
                        ],
                        "id": 4923,
                        "name": "FunctionCall",
                        "src": "3339:37:19"
                      }
                    ],
                    "id": 4924,
                    "name": "Return",
                    "src": "3332:44:19"
                  }
                ],
                "id": 4925,
                "name": "Block",
                "src": "3322:61:19"
              }
            ],
            "id": 4926,
            "name": "FunctionDefinition",
            "src": "3200:183:19"
          },
          {
            "attributes": {
              "constant": true,
              "implemented": true,
              "isConstructor": false,
              "modifiers": [
                null
              ],
              "name": "getOwnerTokens",
              "payable": false,
              "scope": 5184,
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
                      "scope": 4939,
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
                        "id": 4927,
                        "name": "ElementaryTypeName",
                        "src": "3413:7:19"
                      }
                    ],
                    "id": 4928,
                    "name": "VariableDeclaration",
                    "src": "3413:14:19"
                  }
                ],
                "id": 4929,
                "name": "ParameterList",
                "src": "3412:16:19"
              },
              {
                "children": [
                  {
                    "attributes": {
                      "constant": false,
                      "name": "_tokenIds",
                      "scope": 4939,
                      "stateVariable": false,
                      "storageLocation": "default",
                      "type": "uint256[] memory",
                      "value": null,
                      "visibility": "internal"
                    },
                    "children": [
                      {
                        "attributes": {
                          "length": null,
                          "type": "uint256[] storage pointer"
                        },
                        "children": [
                          {
                            "attributes": {
                              "name": "uint",
                              "type": "uint256"
                            },
                            "id": 4930,
                            "name": "ElementaryTypeName",
                            "src": "3474:4:19"
                          }
                        ],
                        "id": 4931,
                        "name": "ArrayTypeName",
                        "src": "3474:6:19"
                      }
                    ],
                    "id": 4932,
                    "name": "VariableDeclaration",
                    "src": "3474:16:19"
                  }
                ],
                "id": 4933,
                "name": "ParameterList",
                "src": "3473:18:19"
              },
              {
                "children": [
                  {
                    "attributes": {
                      "functionReturnParameters": 4933
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
                          "type": "uint256[] memory",
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
                              "referencedDeclaration": 5039,
                              "type": "function (address) view returns (uint256[] memory)",
                              "value": "_getOwnerTokens"
                            },
                            "id": 4934,
                            "name": "Identifier",
                            "src": "3513:15:19"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4928,
                              "type": "address",
                              "value": "_owner"
                            },
                            "id": 4935,
                            "name": "Identifier",
                            "src": "3529:6:19"
                          }
                        ],
                        "id": 4936,
                        "name": "FunctionCall",
                        "src": "3513:23:19"
                      }
                    ],
                    "id": 4937,
                    "name": "Return",
                    "src": "3506:30:19"
                  }
                ],
                "id": 4938,
                "name": "Block",
                "src": "3496:47:19"
              }
            ],
            "id": 4939,
            "name": "FunctionDefinition",
            "src": "3389:154:19"
          },
          {
            "attributes": {
              "constant": true,
              "implemented": true,
              "isConstructor": false,
              "modifiers": [
                null
              ],
              "name": "implementsERC721",
              "payable": false,
              "scope": 5184,
              "stateMutability": "view",
              "superFunction": 4545,
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
                "id": 4940,
                "name": "ParameterList",
                "src": "3574:2:19"
              },
              {
                "children": [
                  {
                    "attributes": {
                      "constant": false,
                      "name": "_implementsERC721",
                      "scope": 4947,
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
                        "id": 4941,
                        "name": "ElementaryTypeName",
                        "src": "3622:4:19"
                      }
                    ],
                    "id": 4942,
                    "name": "VariableDeclaration",
                    "src": "3622:22:19"
                  }
                ],
                "id": 4943,
                "name": "ParameterList",
                "src": "3621:24:19"
              },
              {
                "children": [
                  {
                    "attributes": {
                      "functionReturnParameters": 4943
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
                        "id": 4944,
                        "name": "Literal",
                        "src": "3667:4:19"
                      }
                    ],
                    "id": 4945,
                    "name": "Return",
                    "src": "3660:11:19"
                  }
                ],
                "id": 4946,
                "name": "Block",
                "src": "3650:28:19"
              }
            ],
            "id": 4947,
            "name": "FunctionDefinition",
            "src": "3549:129:19"
          },
          {
            "attributes": {
              "constant": true,
              "implemented": true,
              "isConstructor": false,
              "modifiers": [
                null
              ],
              "name": "getApproved",
              "payable": false,
              "scope": 5184,
              "stateMutability": "view",
              "superFunction": 4524,
              "visibility": "public"
            },
            "children": [
              {
                "children": [
                  {
                    "attributes": {
                      "constant": false,
                      "name": "_tokenId",
                      "scope": 4959,
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
                        "id": 4948,
                        "name": "ElementaryTypeName",
                        "src": "3705:4:19"
                      }
                    ],
                    "id": 4949,
                    "name": "VariableDeclaration",
                    "src": "3705:13:19"
                  }
                ],
                "id": 4950,
                "name": "ParameterList",
                "src": "3704:15:19"
              },
              {
                "children": [
                  {
                    "attributes": {
                      "constant": false,
                      "name": "_approved",
                      "scope": 4959,
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
                        "id": 4951,
                        "name": "ElementaryTypeName",
                        "src": "3765:7:19"
                      }
                    ],
                    "id": 4952,
                    "name": "VariableDeclaration",
                    "src": "3765:17:19"
                  }
                ],
                "id": 4953,
                "name": "ParameterList",
                "src": "3764:19:19"
              },
              {
                "children": [
                  {
                    "attributes": {
                      "functionReturnParameters": 4953
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
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 5026,
                              "type": "function (uint256) view returns (address)",
                              "value": "_getApproved"
                            },
                            "id": 4954,
                            "name": "Identifier",
                            "src": "3805:12:19"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4949,
                              "type": "uint256",
                              "value": "_tokenId"
                            },
                            "id": 4955,
                            "name": "Identifier",
                            "src": "3818:8:19"
                          }
                        ],
                        "id": 4956,
                        "name": "FunctionCall",
                        "src": "3805:22:19"
                      }
                    ],
                    "id": 4957,
                    "name": "Return",
                    "src": "3798:29:19"
                  }
                ],
                "id": 4958,
                "name": "Block",
                "src": "3788:46:19"
              }
            ],
            "id": 4959,
            "name": "FunctionDefinition",
            "src": "3684:150:19"
          },
          {
            "attributes": {
              "constant": false,
              "implemented": true,
              "isConstructor": false,
              "modifiers": [
                null
              ],
              "name": "_clearApprovalAndTransfer",
              "payable": false,
              "scope": 5184,
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
                      "scope": 4988,
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
                        "id": 4960,
                        "name": "ElementaryTypeName",
                        "src": "3875:7:19"
                      }
                    ],
                    "id": 4961,
                    "name": "VariableDeclaration",
                    "src": "3875:13:19"
                  },
                  {
                    "attributes": {
                      "constant": false,
                      "name": "_to",
                      "scope": 4988,
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
                        "id": 4962,
                        "name": "ElementaryTypeName",
                        "src": "3890:7:19"
                      }
                    ],
                    "id": 4963,
                    "name": "VariableDeclaration",
                    "src": "3890:11:19"
                  },
                  {
                    "attributes": {
                      "constant": false,
                      "name": "_tokenId",
                      "scope": 4988,
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
                        "id": 4964,
                        "name": "ElementaryTypeName",
                        "src": "3903:4:19"
                      }
                    ],
                    "id": 4965,
                    "name": "VariableDeclaration",
                    "src": "3903:13:19"
                  }
                ],
                "id": 4966,
                "name": "ParameterList",
                "src": "3874:43:19"
              },
              {
                "attributes": {
                  "parameters": [
                    null
                  ]
                },
                "children": [],
                "id": 4967,
                "name": "ParameterList",
                "src": "3939:0:19"
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
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 5069,
                              "type": "function (uint256)",
                              "value": "_clearTokenApproval"
                            },
                            "id": 4968,
                            "name": "Identifier",
                            "src": "3949:19:19"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4965,
                              "type": "uint256",
                              "value": "_tokenId"
                            },
                            "id": 4969,
                            "name": "Identifier",
                            "src": "3969:8:19"
                          }
                        ],
                        "id": 4970,
                        "name": "FunctionCall",
                        "src": "3949:29:19"
                      }
                    ],
                    "id": 4971,
                    "name": "ExpressionStatement",
                    "src": "3949:29:19"
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
                                }
                              ],
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 5169,
                              "type": "function (address,uint256)",
                              "value": "_removeTokenFromOwnersList"
                            },
                            "id": 4972,
                            "name": "Identifier",
                            "src": "3988:26:19"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4961,
                              "type": "address",
                              "value": "_from"
                            },
                            "id": 4973,
                            "name": "Identifier",
                            "src": "4015:5:19"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4965,
                              "type": "uint256",
                              "value": "_tokenId"
                            },
                            "id": 4974,
                            "name": "Identifier",
                            "src": "4022:8:19"
                          }
                        ],
                        "id": 4975,
                        "name": "FunctionCall",
                        "src": "3988:43:19"
                      }
                    ],
                    "id": 4976,
                    "name": "ExpressionStatement",
                    "src": "3988:43:19"
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
                                  "typeIdentifier": "t_uint256",
                                  "typeString": "uint256"
                                },
                                {
                                  "typeIdentifier": "t_address",
                                  "typeString": "address"
                                }
                              ],
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 5083,
                              "type": "function (uint256,address)",
                              "value": "_setTokenOwner"
                            },
                            "id": 4977,
                            "name": "Identifier",
                            "src": "4041:14:19"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4965,
                              "type": "uint256",
                              "value": "_tokenId"
                            },
                            "id": 4978,
                            "name": "Identifier",
                            "src": "4056:8:19"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4963,
                              "type": "address",
                              "value": "_to"
                            },
                            "id": 4979,
                            "name": "Identifier",
                            "src": "4066:3:19"
                          }
                        ],
                        "id": 4980,
                        "name": "FunctionCall",
                        "src": "4041:29:19"
                      }
                    ],
                    "id": 4981,
                    "name": "ExpressionStatement",
                    "src": "4041:29:19"
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
                                }
                              ],
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 5109,
                              "type": "function (address,uint256)",
                              "value": "_addTokenToOwnersList"
                            },
                            "id": 4982,
                            "name": "Identifier",
                            "src": "4080:21:19"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4963,
                              "type": "address",
                              "value": "_to"
                            },
                            "id": 4983,
                            "name": "Identifier",
                            "src": "4102:3:19"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4965,
                              "type": "uint256",
                              "value": "_tokenId"
                            },
                            "id": 4984,
                            "name": "Identifier",
                            "src": "4107:8:19"
                          }
                        ],
                        "id": 4985,
                        "name": "FunctionCall",
                        "src": "4080:36:19"
                      }
                    ],
                    "id": 4986,
                    "name": "ExpressionStatement",
                    "src": "4080:36:19"
                  }
                ],
                "id": 4987,
                "name": "Block",
                "src": "3939:184:19"
              }
            ],
            "id": 4988,
            "name": "FunctionDefinition",
            "src": "3840:283:19"
          },
          {
            "attributes": {
              "constant": true,
              "implemented": true,
              "isConstructor": false,
              "modifiers": [
                null
              ],
              "name": "_ownerOf",
              "payable": false,
              "scope": 5184,
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
                      "name": "_tokenId",
                      "scope": 5000,
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
                        "id": 4989,
                        "name": "ElementaryTypeName",
                        "src": "4147:4:19"
                      }
                    ],
                    "id": 4990,
                    "name": "VariableDeclaration",
                    "src": "4147:13:19"
                  }
                ],
                "id": 4991,
                "name": "ParameterList",
                "src": "4146:15:19"
              },
              {
                "children": [
                  {
                    "attributes": {
                      "constant": false,
                      "name": "_owner",
                      "scope": 5000,
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
                        "id": 4992,
                        "name": "ElementaryTypeName",
                        "src": "4209:7:19"
                      }
                    ],
                    "id": 4993,
                    "name": "VariableDeclaration",
                    "src": "4209:14:19"
                  }
                ],
                "id": 4994,
                "name": "ParameterList",
                "src": "4208:16:19"
              },
              {
                "children": [
                  {
                    "attributes": {
                      "functionReturnParameters": 4994
                    },
                    "children": [
                      {
                        "attributes": {
                          "argumentTypes": null,
                          "isConstant": false,
                          "isLValue": true,
                          "isPure": false,
                          "lValueRequested": false,
                          "type": "address"
                        },
                        "children": [
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4642,
                              "type": "mapping(uint256 => address)",
                              "value": "tokenIdToOwner"
                            },
                            "id": 4995,
                            "name": "Identifier",
                            "src": "4246:14:19"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4990,
                              "type": "uint256",
                              "value": "_tokenId"
                            },
                            "id": 4996,
                            "name": "Identifier",
                            "src": "4261:8:19"
                          }
                        ],
                        "id": 4997,
                        "name": "IndexAccess",
                        "src": "4246:24:19"
                      }
                    ],
                    "id": 4998,
                    "name": "Return",
                    "src": "4239:31:19"
                  }
                ],
                "id": 4999,
                "name": "Block",
                "src": "4229:48:19"
              }
            ],
            "id": 5000,
            "name": "FunctionDefinition",
            "src": "4129:148:19"
          },
          {
            "attributes": {
              "constant": false,
              "implemented": true,
              "isConstructor": false,
              "modifiers": [
                null
              ],
              "name": "_approve",
              "payable": false,
              "scope": 5184,
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
                      "name": "_to",
                      "scope": 5014,
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
                        "id": 5001,
                        "name": "ElementaryTypeName",
                        "src": "4301:7:19"
                      }
                    ],
                    "id": 5002,
                    "name": "VariableDeclaration",
                    "src": "4301:11:19"
                  },
                  {
                    "attributes": {
                      "constant": false,
                      "name": "_tokenId",
                      "scope": 5014,
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
                        "id": 5003,
                        "name": "ElementaryTypeName",
                        "src": "4314:4:19"
                      }
                    ],
                    "id": 5004,
                    "name": "VariableDeclaration",
                    "src": "4314:13:19"
                  }
                ],
                "id": 5005,
                "name": "ParameterList",
                "src": "4300:28:19"
              },
              {
                "attributes": {
                  "parameters": [
                    null
                  ]
                },
                "children": [],
                "id": 5006,
                "name": "ParameterList",
                "src": "4350:0:19"
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
                              "isConstant": false,
                              "isLValue": true,
                              "isPure": false,
                              "lValueRequested": true,
                              "type": "address"
                            },
                            "children": [
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "overloadedDeclarations": [
                                    null
                                  ],
                                  "referencedDeclaration": 4646,
                                  "type": "mapping(uint256 => address)",
                                  "value": "tokenIdToApprovedAddress"
                                },
                                "id": 5007,
                                "name": "Identifier",
                                "src": "4360:24:19"
                              },
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "overloadedDeclarations": [
                                    null
                                  ],
                                  "referencedDeclaration": 5004,
                                  "type": "uint256",
                                  "value": "_tokenId"
                                },
                                "id": 5008,
                                "name": "Identifier",
                                "src": "4385:8:19"
                              }
                            ],
                            "id": 5009,
                            "name": "IndexAccess",
                            "src": "4360:34:19"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 5002,
                              "type": "address",
                              "value": "_to"
                            },
                            "id": 5010,
                            "name": "Identifier",
                            "src": "4397:3:19"
                          }
                        ],
                        "id": 5011,
                        "name": "Assignment",
                        "src": "4360:40:19"
                      }
                    ],
                    "id": 5012,
                    "name": "ExpressionStatement",
                    "src": "4360:40:19"
                  }
                ],
                "id": 5013,
                "name": "Block",
                "src": "4350:57:19"
              }
            ],
            "id": 5014,
            "name": "FunctionDefinition",
            "src": "4283:124:19"
          },
          {
            "attributes": {
              "constant": true,
              "implemented": true,
              "isConstructor": false,
              "modifiers": [
                null
              ],
              "name": "_getApproved",
              "payable": false,
              "scope": 5184,
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
                      "name": "_tokenId",
                      "scope": 5026,
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
                        "id": 5015,
                        "name": "ElementaryTypeName",
                        "src": "4435:4:19"
                      }
                    ],
                    "id": 5016,
                    "name": "VariableDeclaration",
                    "src": "4435:13:19"
                  }
                ],
                "id": 5017,
                "name": "ParameterList",
                "src": "4434:15:19"
              },
              {
                "children": [
                  {
                    "attributes": {
                      "constant": false,
                      "name": "_approved",
                      "scope": 5026,
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
                        "id": 5018,
                        "name": "ElementaryTypeName",
                        "src": "4497:7:19"
                      }
                    ],
                    "id": 5019,
                    "name": "VariableDeclaration",
                    "src": "4497:17:19"
                  }
                ],
                "id": 5020,
                "name": "ParameterList",
                "src": "4496:19:19"
              },
              {
                "children": [
                  {
                    "attributes": {
                      "functionReturnParameters": 5020
                    },
                    "children": [
                      {
                        "attributes": {
                          "argumentTypes": null,
                          "isConstant": false,
                          "isLValue": true,
                          "isPure": false,
                          "lValueRequested": false,
                          "type": "address"
                        },
                        "children": [
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4646,
                              "type": "mapping(uint256 => address)",
                              "value": "tokenIdToApprovedAddress"
                            },
                            "id": 5021,
                            "name": "Identifier",
                            "src": "4537:24:19"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 5016,
                              "type": "uint256",
                              "value": "_tokenId"
                            },
                            "id": 5022,
                            "name": "Identifier",
                            "src": "4562:8:19"
                          }
                        ],
                        "id": 5023,
                        "name": "IndexAccess",
                        "src": "4537:34:19"
                      }
                    ],
                    "id": 5024,
                    "name": "Return",
                    "src": "4530:41:19"
                  }
                ],
                "id": 5025,
                "name": "Block",
                "src": "4520:58:19"
              }
            ],
            "id": 5026,
            "name": "FunctionDefinition",
            "src": "4413:165:19"
          },
          {
            "attributes": {
              "constant": true,
              "implemented": true,
              "isConstructor": false,
              "modifiers": [
                null
              ],
              "name": "_getOwnerTokens",
              "payable": false,
              "scope": 5184,
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
                      "name": "_owner",
                      "scope": 5039,
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
                        "id": 5027,
                        "name": "ElementaryTypeName",
                        "src": "4609:7:19"
                      }
                    ],
                    "id": 5028,
                    "name": "VariableDeclaration",
                    "src": "4609:14:19"
                  }
                ],
                "id": 5029,
                "name": "ParameterList",
                "src": "4608:16:19"
              },
              {
                "children": [
                  {
                    "attributes": {
                      "constant": false,
                      "name": "_tokens",
                      "scope": 5039,
                      "stateVariable": false,
                      "storageLocation": "default",
                      "type": "uint256[] memory",
                      "value": null,
                      "visibility": "internal"
                    },
                    "children": [
                      {
                        "attributes": {
                          "length": null,
                          "type": "uint256[] storage pointer"
                        },
                        "children": [
                          {
                            "attributes": {
                              "name": "uint",
                              "type": "uint256"
                            },
                            "id": 5030,
                            "name": "ElementaryTypeName",
                            "src": "4672:4:19"
                          }
                        ],
                        "id": 5031,
                        "name": "ArrayTypeName",
                        "src": "4672:6:19"
                      }
                    ],
                    "id": 5032,
                    "name": "VariableDeclaration",
                    "src": "4672:14:19"
                  }
                ],
                "id": 5033,
                "name": "ParameterList",
                "src": "4671:16:19"
              },
              {
                "children": [
                  {
                    "attributes": {
                      "functionReturnParameters": 5033
                    },
                    "children": [
                      {
                        "attributes": {
                          "argumentTypes": null,
                          "isConstant": false,
                          "isLValue": true,
                          "isPure": false,
                          "lValueRequested": false,
                          "type": "uint256[] storage ref"
                        },
                        "children": [
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4655,
                              "type": "mapping(address => uint256[] storage ref)",
                              "value": "ownerToTokensOwned"
                            },
                            "id": 5034,
                            "name": "Identifier",
                            "src": "4709:18:19"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 5028,
                              "type": "address",
                              "value": "_owner"
                            },
                            "id": 5035,
                            "name": "Identifier",
                            "src": "4728:6:19"
                          }
                        ],
                        "id": 5036,
                        "name": "IndexAccess",
                        "src": "4709:26:19"
                      }
                    ],
                    "id": 5037,
                    "name": "Return",
                    "src": "4702:33:19"
                  }
                ],
                "id": 5038,
                "name": "Block",
                "src": "4692:50:19"
              }
            ],
            "id": 5039,
            "name": "FunctionDefinition",
            "src": "4584:158:19"
          },
          {
            "attributes": {
              "constant": true,
              "implemented": true,
              "isConstructor": false,
              "modifiers": [
                null
              ],
              "name": "_getOwnerTokenByIndex",
              "payable": false,
              "scope": 5184,
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
                      "name": "_owner",
                      "scope": 5055,
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
                        "id": 5040,
                        "name": "ElementaryTypeName",
                        "src": "4779:7:19"
                      }
                    ],
                    "id": 5041,
                    "name": "VariableDeclaration",
                    "src": "4779:14:19"
                  },
                  {
                    "attributes": {
                      "constant": false,
                      "name": "_index",
                      "scope": 5055,
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
                        "id": 5042,
                        "name": "ElementaryTypeName",
                        "src": "4795:4:19"
                      }
                    ],
                    "id": 5043,
                    "name": "VariableDeclaration",
                    "src": "4795:11:19"
                  }
                ],
                "id": 5044,
                "name": "ParameterList",
                "src": "4778:29:19"
              },
              {
                "children": [
                  {
                    "attributes": {
                      "constant": false,
                      "name": "_tokens",
                      "scope": 5055,
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
                        "id": 5045,
                        "name": "ElementaryTypeName",
                        "src": "4855:4:19"
                      }
                    ],
                    "id": 5046,
                    "name": "VariableDeclaration",
                    "src": "4855:12:19"
                  }
                ],
                "id": 5047,
                "name": "ParameterList",
                "src": "4854:14:19"
              },
              {
                "children": [
                  {
                    "attributes": {
                      "functionReturnParameters": 5047
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
                              "type": "uint256[] storage ref"
                            },
                            "children": [
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "overloadedDeclarations": [
                                    null
                                  ],
                                  "referencedDeclaration": 4655,
                                  "type": "mapping(address => uint256[] storage ref)",
                                  "value": "ownerToTokensOwned"
                                },
                                "id": 5048,
                                "name": "Identifier",
                                "src": "4890:18:19"
                              },
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "overloadedDeclarations": [
                                    null
                                  ],
                                  "referencedDeclaration": 5041,
                                  "type": "address",
                                  "value": "_owner"
                                },
                                "id": 5049,
                                "name": "Identifier",
                                "src": "4909:6:19"
                              }
                            ],
                            "id": 5050,
                            "name": "IndexAccess",
                            "src": "4890:26:19"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 5043,
                              "type": "uint256",
                              "value": "_index"
                            },
                            "id": 5051,
                            "name": "Identifier",
                            "src": "4917:6:19"
                          }
                        ],
                        "id": 5052,
                        "name": "IndexAccess",
                        "src": "4890:34:19"
                      }
                    ],
                    "id": 5053,
                    "name": "Return",
                    "src": "4883:41:19"
                  }
                ],
                "id": 5054,
                "name": "Block",
                "src": "4873:58:19"
              }
            ],
            "id": 5055,
            "name": "FunctionDefinition",
            "src": "4748:183:19"
          },
          {
            "attributes": {
              "constant": false,
              "implemented": true,
              "isConstructor": false,
              "modifiers": [
                null
              ],
              "name": "_clearTokenApproval",
              "payable": false,
              "scope": 5184,
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
                      "name": "_tokenId",
                      "scope": 5069,
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
                        "id": 5056,
                        "name": "ElementaryTypeName",
                        "src": "4966:4:19"
                      }
                    ],
                    "id": 5057,
                    "name": "VariableDeclaration",
                    "src": "4966:13:19"
                  }
                ],
                "id": 5058,
                "name": "ParameterList",
                "src": "4965:15:19"
              },
              {
                "attributes": {
                  "parameters": [
                    null
                  ]
                },
                "children": [],
                "id": 5059,
                "name": "ParameterList",
                "src": "5002:0:19"
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
                              "isConstant": false,
                              "isLValue": true,
                              "isPure": false,
                              "lValueRequested": true,
                              "type": "address"
                            },
                            "children": [
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "overloadedDeclarations": [
                                    null
                                  ],
                                  "referencedDeclaration": 4646,
                                  "type": "mapping(uint256 => address)",
                                  "value": "tokenIdToApprovedAddress"
                                },
                                "id": 5060,
                                "name": "Identifier",
                                "src": "5012:24:19"
                              },
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "overloadedDeclarations": [
                                    null
                                  ],
                                  "referencedDeclaration": 5057,
                                  "type": "uint256",
                                  "value": "_tokenId"
                                },
                                "id": 5061,
                                "name": "Identifier",
                                "src": "5037:8:19"
                              }
                            ],
                            "id": 5062,
                            "name": "IndexAccess",
                            "src": "5012:34:19"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "isConstant": false,
                              "isLValue": false,
                              "isPure": true,
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
                                      "typeIdentifier": "t_rational_0_by_1",
                                      "typeString": "int_const 0"
                                    }
                                  ],
                                  "isConstant": false,
                                  "isLValue": false,
                                  "isPure": true,
                                  "lValueRequested": false,
                                  "type": "type(address)",
                                  "value": "address"
                                },
                                "id": 5063,
                                "name": "ElementaryTypeNameExpression",
                                "src": "5049:7:19"
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
                                "id": 5064,
                                "name": "Literal",
                                "src": "5057:1:19"
                              }
                            ],
                            "id": 5065,
                            "name": "FunctionCall",
                            "src": "5049:10:19"
                          }
                        ],
                        "id": 5066,
                        "name": "Assignment",
                        "src": "5012:47:19"
                      }
                    ],
                    "id": 5067,
                    "name": "ExpressionStatement",
                    "src": "5012:47:19"
                  }
                ],
                "id": 5068,
                "name": "Block",
                "src": "5002:64:19"
              }
            ],
            "id": 5069,
            "name": "FunctionDefinition",
            "src": "4937:129:19"
          },
          {
            "attributes": {
              "constant": false,
              "implemented": true,
              "isConstructor": false,
              "modifiers": [
                null
              ],
              "name": "_setTokenOwner",
              "payable": false,
              "scope": 5184,
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
                      "name": "_tokenId",
                      "scope": 5083,
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
                        "id": 5070,
                        "name": "ElementaryTypeName",
                        "src": "5096:4:19"
                      }
                    ],
                    "id": 5071,
                    "name": "VariableDeclaration",
                    "src": "5096:13:19"
                  },
                  {
                    "attributes": {
                      "constant": false,
                      "name": "_owner",
                      "scope": 5083,
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
                        "id": 5072,
                        "name": "ElementaryTypeName",
                        "src": "5111:7:19"
                      }
                    ],
                    "id": 5073,
                    "name": "VariableDeclaration",
                    "src": "5111:14:19"
                  }
                ],
                "id": 5074,
                "name": "ParameterList",
                "src": "5095:31:19"
              },
              {
                "attributes": {
                  "parameters": [
                    null
                  ]
                },
                "children": [],
                "id": 5075,
                "name": "ParameterList",
                "src": "5148:0:19"
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
                              "isConstant": false,
                              "isLValue": true,
                              "isPure": false,
                              "lValueRequested": true,
                              "type": "address"
                            },
                            "children": [
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "overloadedDeclarations": [
                                    null
                                  ],
                                  "referencedDeclaration": 4642,
                                  "type": "mapping(uint256 => address)",
                                  "value": "tokenIdToOwner"
                                },
                                "id": 5076,
                                "name": "Identifier",
                                "src": "5158:14:19"
                              },
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "overloadedDeclarations": [
                                    null
                                  ],
                                  "referencedDeclaration": 5071,
                                  "type": "uint256",
                                  "value": "_tokenId"
                                },
                                "id": 5077,
                                "name": "Identifier",
                                "src": "5173:8:19"
                              }
                            ],
                            "id": 5078,
                            "name": "IndexAccess",
                            "src": "5158:24:19"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 5073,
                              "type": "address",
                              "value": "_owner"
                            },
                            "id": 5079,
                            "name": "Identifier",
                            "src": "5185:6:19"
                          }
                        ],
                        "id": 5080,
                        "name": "Assignment",
                        "src": "5158:33:19"
                      }
                    ],
                    "id": 5081,
                    "name": "ExpressionStatement",
                    "src": "5158:33:19"
                  }
                ],
                "id": 5082,
                "name": "Block",
                "src": "5148:50:19"
              }
            ],
            "id": 5083,
            "name": "FunctionDefinition",
            "src": "5072:126:19"
          },
          {
            "attributes": {
              "constant": false,
              "implemented": true,
              "isConstructor": false,
              "modifiers": [
                null
              ],
              "name": "_addTokenToOwnersList",
              "payable": false,
              "scope": 5184,
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
                      "name": "_owner",
                      "scope": 5109,
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
                        "id": 5084,
                        "name": "ElementaryTypeName",
                        "src": "5235:7:19"
                      }
                    ],
                    "id": 5085,
                    "name": "VariableDeclaration",
                    "src": "5235:14:19"
                  },
                  {
                    "attributes": {
                      "constant": false,
                      "name": "_tokenId",
                      "scope": 5109,
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
                        "id": 5086,
                        "name": "ElementaryTypeName",
                        "src": "5251:4:19"
                      }
                    ],
                    "id": 5087,
                    "name": "VariableDeclaration",
                    "src": "5251:13:19"
                  }
                ],
                "id": 5088,
                "name": "ParameterList",
                "src": "5234:31:19"
              },
              {
                "attributes": {
                  "parameters": [
                    null
                  ]
                },
                "children": [],
                "id": 5089,
                "name": "ParameterList",
                "src": "5287:0:19"
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
                              "member_name": "push",
                              "referencedDeclaration": null,
                              "type": "function (uint256) returns (uint256)"
                            },
                            "children": [
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "isConstant": false,
                                  "isLValue": true,
                                  "isPure": false,
                                  "lValueRequested": false,
                                  "type": "uint256[] storage ref"
                                },
                                "children": [
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "overloadedDeclarations": [
                                        null
                                      ],
                                      "referencedDeclaration": 4655,
                                      "type": "mapping(address => uint256[] storage ref)",
                                      "value": "ownerToTokensOwned"
                                    },
                                    "id": 5090,
                                    "name": "Identifier",
                                    "src": "5297:18:19"
                                  },
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "overloadedDeclarations": [
                                        null
                                      ],
                                      "referencedDeclaration": 5085,
                                      "type": "address",
                                      "value": "_owner"
                                    },
                                    "id": 5091,
                                    "name": "Identifier",
                                    "src": "5316:6:19"
                                  }
                                ],
                                "id": 5092,
                                "name": "IndexAccess",
                                "src": "5297:26:19"
                              }
                            ],
                            "id": 5093,
                            "name": "MemberAccess",
                            "src": "5297:31:19"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 5087,
                              "type": "uint256",
                              "value": "_tokenId"
                            },
                            "id": 5094,
                            "name": "Identifier",
                            "src": "5329:8:19"
                          }
                        ],
                        "id": 5095,
                        "name": "FunctionCall",
                        "src": "5297:41:19"
                      }
                    ],
                    "id": 5096,
                    "name": "ExpressionStatement",
                    "src": "5297:41:19"
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
                                  "overloadedDeclarations": [
                                    null
                                  ],
                                  "referencedDeclaration": 4659,
                                  "type": "mapping(uint256 => uint256)",
                                  "value": "tokenIdToOwnerArrayIndex"
                                },
                                "id": 5097,
                                "name": "Identifier",
                                "src": "5348:24:19"
                              },
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "overloadedDeclarations": [
                                    null
                                  ],
                                  "referencedDeclaration": 5087,
                                  "type": "uint256",
                                  "value": "_tokenId"
                                },
                                "id": 5098,
                                "name": "Identifier",
                                "src": "5373:8:19"
                              }
                            ],
                            "id": 5099,
                            "name": "IndexAccess",
                            "src": "5348:34:19"
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
                                      "isConstant": false,
                                      "isLValue": true,
                                      "isPure": false,
                                      "lValueRequested": false,
                                      "type": "uint256[] storage ref"
                                    },
                                    "children": [
                                      {
                                        "attributes": {
                                          "argumentTypes": null,
                                          "overloadedDeclarations": [
                                            null
                                          ],
                                          "referencedDeclaration": 4655,
                                          "type": "mapping(address => uint256[] storage ref)",
                                          "value": "ownerToTokensOwned"
                                        },
                                        "id": 5100,
                                        "name": "Identifier",
                                        "src": "5397:18:19"
                                      },
                                      {
                                        "attributes": {
                                          "argumentTypes": null,
                                          "overloadedDeclarations": [
                                            null
                                          ],
                                          "referencedDeclaration": 5085,
                                          "type": "address",
                                          "value": "_owner"
                                        },
                                        "id": 5101,
                                        "name": "Identifier",
                                        "src": "5416:6:19"
                                      }
                                    ],
                                    "id": 5102,
                                    "name": "IndexAccess",
                                    "src": "5397:26:19"
                                  }
                                ],
                                "id": 5103,
                                "name": "MemberAccess",
                                "src": "5397:33:19"
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
                                "id": 5104,
                                "name": "Literal",
                                "src": "5433:1:19"
                              }
                            ],
                            "id": 5105,
                            "name": "BinaryOperation",
                            "src": "5397:37:19"
                          }
                        ],
                        "id": 5106,
                        "name": "Assignment",
                        "src": "5348:86:19"
                      }
                    ],
                    "id": 5107,
                    "name": "ExpressionStatement",
                    "src": "5348:86:19"
                  }
                ],
                "id": 5108,
                "name": "Block",
                "src": "5287:154:19"
              }
            ],
            "id": 5109,
            "name": "FunctionDefinition",
            "src": "5204:237:19"
          },
          {
            "attributes": {
              "constant": false,
              "implemented": true,
              "isConstructor": false,
              "modifiers": [
                null
              ],
              "name": "_removeTokenFromOwnersList",
              "payable": false,
              "scope": 5184,
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
                      "name": "_owner",
                      "scope": 5169,
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
                        "id": 5110,
                        "name": "ElementaryTypeName",
                        "src": "5483:7:19"
                      }
                    ],
                    "id": 5111,
                    "name": "VariableDeclaration",
                    "src": "5483:14:19"
                  },
                  {
                    "attributes": {
                      "constant": false,
                      "name": "_tokenId",
                      "scope": 5169,
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
                        "id": 5112,
                        "name": "ElementaryTypeName",
                        "src": "5499:4:19"
                      }
                    ],
                    "id": 5113,
                    "name": "VariableDeclaration",
                    "src": "5499:13:19"
                  }
                ],
                "id": 5114,
                "name": "ParameterList",
                "src": "5482:31:19"
              },
              {
                "attributes": {
                  "parameters": [
                    null
                  ]
                },
                "children": [],
                "id": 5115,
                "name": "ParameterList",
                "src": "5535:0:19"
              },
              {
                "children": [
                  {
                    "attributes": {
                      "assignments": [
                        5117
                      ]
                    },
                    "children": [
                      {
                        "attributes": {
                          "constant": false,
                          "name": "length",
                          "scope": 5169,
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
                            "id": 5116,
                            "name": "ElementaryTypeName",
                            "src": "5545:4:19"
                          }
                        ],
                        "id": 5117,
                        "name": "VariableDeclaration",
                        "src": "5545:11:19"
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
                              "isConstant": false,
                              "isLValue": true,
                              "isPure": false,
                              "lValueRequested": false,
                              "type": "uint256[] storage ref"
                            },
                            "children": [
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "overloadedDeclarations": [
                                    null
                                  ],
                                  "referencedDeclaration": 4655,
                                  "type": "mapping(address => uint256[] storage ref)",
                                  "value": "ownerToTokensOwned"
                                },
                                "id": 5118,
                                "name": "Identifier",
                                "src": "5559:18:19"
                              },
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "overloadedDeclarations": [
                                    null
                                  ],
                                  "referencedDeclaration": 5111,
                                  "type": "address",
                                  "value": "_owner"
                                },
                                "id": 5119,
                                "name": "Identifier",
                                "src": "5578:6:19"
                              }
                            ],
                            "id": 5120,
                            "name": "IndexAccess",
                            "src": "5559:26:19"
                          }
                        ],
                        "id": 5121,
                        "name": "MemberAccess",
                        "src": "5559:33:19"
                      }
                    ],
                    "id": 5122,
                    "name": "VariableDeclarationStatement",
                    "src": "5545:47:19"
                  },
                  {
                    "attributes": {
                      "assignments": [
                        5124
                      ]
                    },
                    "children": [
                      {
                        "attributes": {
                          "constant": false,
                          "name": "index",
                          "scope": 5169,
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
                            "id": 5123,
                            "name": "ElementaryTypeName",
                            "src": "5602:4:19"
                          }
                        ],
                        "id": 5124,
                        "name": "VariableDeclaration",
                        "src": "5602:10:19"
                      },
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
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 4659,
                              "type": "mapping(uint256 => uint256)",
                              "value": "tokenIdToOwnerArrayIndex"
                            },
                            "id": 5125,
                            "name": "Identifier",
                            "src": "5615:24:19"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 5113,
                              "type": "uint256",
                              "value": "_tokenId"
                            },
                            "id": 5126,
                            "name": "Identifier",
                            "src": "5640:8:19"
                          }
                        ],
                        "id": 5127,
                        "name": "IndexAccess",
                        "src": "5615:34:19"
                      }
                    ],
                    "id": 5128,
                    "name": "VariableDeclarationStatement",
                    "src": "5602:47:19"
                  },
                  {
                    "attributes": {
                      "assignments": [
                        5130
                      ]
                    },
                    "children": [
                      {
                        "attributes": {
                          "constant": false,
                          "name": "swapToken",
                          "scope": 5169,
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
                            "id": 5129,
                            "name": "ElementaryTypeName",
                            "src": "5659:4:19"
                          }
                        ],
                        "id": 5130,
                        "name": "VariableDeclaration",
                        "src": "5659:14:19"
                      },
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
                              "type": "uint256[] storage ref"
                            },
                            "children": [
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "overloadedDeclarations": [
                                    null
                                  ],
                                  "referencedDeclaration": 4655,
                                  "type": "mapping(address => uint256[] storage ref)",
                                  "value": "ownerToTokensOwned"
                                },
                                "id": 5131,
                                "name": "Identifier",
                                "src": "5676:18:19"
                              },
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "overloadedDeclarations": [
                                    null
                                  ],
                                  "referencedDeclaration": 5111,
                                  "type": "address",
                                  "value": "_owner"
                                },
                                "id": 5132,
                                "name": "Identifier",
                                "src": "5695:6:19"
                              }
                            ],
                            "id": 5133,
                            "name": "IndexAccess",
                            "src": "5676:26:19"
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
                                  "referencedDeclaration": 5117,
                                  "type": "uint256",
                                  "value": "length"
                                },
                                "id": 5134,
                                "name": "Identifier",
                                "src": "5703:6:19"
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
                                "id": 5135,
                                "name": "Literal",
                                "src": "5712:1:19"
                              }
                            ],
                            "id": 5136,
                            "name": "BinaryOperation",
                            "src": "5703:10:19"
                          }
                        ],
                        "id": 5137,
                        "name": "IndexAccess",
                        "src": "5676:38:19"
                      }
                    ],
                    "id": 5138,
                    "name": "VariableDeclarationStatement",
                    "src": "5659:55:19"
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
                                  "type": "uint256[] storage ref"
                                },
                                "children": [
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "overloadedDeclarations": [
                                        null
                                      ],
                                      "referencedDeclaration": 4655,
                                      "type": "mapping(address => uint256[] storage ref)",
                                      "value": "ownerToTokensOwned"
                                    },
                                    "id": 5139,
                                    "name": "Identifier",
                                    "src": "5725:18:19"
                                  },
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "overloadedDeclarations": [
                                        null
                                      ],
                                      "referencedDeclaration": 5111,
                                      "type": "address",
                                      "value": "_owner"
                                    },
                                    "id": 5140,
                                    "name": "Identifier",
                                    "src": "5744:6:19"
                                  }
                                ],
                                "id": 5142,
                                "name": "IndexAccess",
                                "src": "5725:26:19"
                              },
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "overloadedDeclarations": [
                                    null
                                  ],
                                  "referencedDeclaration": 5124,
                                  "type": "uint256",
                                  "value": "index"
                                },
                                "id": 5141,
                                "name": "Identifier",
                                "src": "5752:5:19"
                              }
                            ],
                            "id": 5143,
                            "name": "IndexAccess",
                            "src": "5725:33:19"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 5130,
                              "type": "uint256",
                              "value": "swapToken"
                            },
                            "id": 5144,
                            "name": "Identifier",
                            "src": "5761:9:19"
                          }
                        ],
                        "id": 5145,
                        "name": "Assignment",
                        "src": "5725:45:19"
                      }
                    ],
                    "id": 5146,
                    "name": "ExpressionStatement",
                    "src": "5725:45:19"
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
                                  "overloadedDeclarations": [
                                    null
                                  ],
                                  "referencedDeclaration": 4659,
                                  "type": "mapping(uint256 => uint256)",
                                  "value": "tokenIdToOwnerArrayIndex"
                                },
                                "id": 5147,
                                "name": "Identifier",
                                "src": "5780:24:19"
                              },
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "overloadedDeclarations": [
                                    null
                                  ],
                                  "referencedDeclaration": 5130,
                                  "type": "uint256",
                                  "value": "swapToken"
                                },
                                "id": 5148,
                                "name": "Identifier",
                                "src": "5805:9:19"
                              }
                            ],
                            "id": 5149,
                            "name": "IndexAccess",
                            "src": "5780:35:19"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 5124,
                              "type": "uint256",
                              "value": "index"
                            },
                            "id": 5150,
                            "name": "Identifier",
                            "src": "5818:5:19"
                          }
                        ],
                        "id": 5151,
                        "name": "Assignment",
                        "src": "5780:43:19"
                      }
                    ],
                    "id": 5152,
                    "name": "ExpressionStatement",
                    "src": "5780:43:19"
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
                          "operator": "delete",
                          "prefix": true,
                          "type": "tuple()"
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
                                  "type": "uint256[] storage ref"
                                },
                                "children": [
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "overloadedDeclarations": [
                                        null
                                      ],
                                      "referencedDeclaration": 4655,
                                      "type": "mapping(address => uint256[] storage ref)",
                                      "value": "ownerToTokensOwned"
                                    },
                                    "id": 5153,
                                    "name": "Identifier",
                                    "src": "5841:18:19"
                                  },
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "overloadedDeclarations": [
                                        null
                                      ],
                                      "referencedDeclaration": 5111,
                                      "type": "address",
                                      "value": "_owner"
                                    },
                                    "id": 5154,
                                    "name": "Identifier",
                                    "src": "5860:6:19"
                                  }
                                ],
                                "id": 5155,
                                "name": "IndexAccess",
                                "src": "5841:26:19"
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
                                      "referencedDeclaration": 5117,
                                      "type": "uint256",
                                      "value": "length"
                                    },
                                    "id": 5156,
                                    "name": "Identifier",
                                    "src": "5868:6:19"
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
                                    "id": 5157,
                                    "name": "Literal",
                                    "src": "5877:1:19"
                                  }
                                ],
                                "id": 5158,
                                "name": "BinaryOperation",
                                "src": "5868:10:19"
                              }
                            ],
                            "id": 5159,
                            "name": "IndexAccess",
                            "src": "5841:38:19"
                          }
                        ],
                        "id": 5160,
                        "name": "UnaryOperation",
                        "src": "5834:45:19"
                      }
                    ],
                    "id": 5161,
                    "name": "ExpressionStatement",
                    "src": "5834:45:19"
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
                          "operator": "--",
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
                                  "isConstant": false,
                                  "isLValue": true,
                                  "isPure": false,
                                  "lValueRequested": false,
                                  "type": "uint256[] storage ref"
                                },
                                "children": [
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "overloadedDeclarations": [
                                        null
                                      ],
                                      "referencedDeclaration": 4655,
                                      "type": "mapping(address => uint256[] storage ref)",
                                      "value": "ownerToTokensOwned"
                                    },
                                    "id": 5162,
                                    "name": "Identifier",
                                    "src": "5889:18:19"
                                  },
                                  {
                                    "attributes": {
                                      "argumentTypes": null,
                                      "overloadedDeclarations": [
                                        null
                                      ],
                                      "referencedDeclaration": 5111,
                                      "type": "address",
                                      "value": "_owner"
                                    },
                                    "id": 5163,
                                    "name": "Identifier",
                                    "src": "5908:6:19"
                                  }
                                ],
                                "id": 5164,
                                "name": "IndexAccess",
                                "src": "5889:26:19"
                              }
                            ],
                            "id": 5165,
                            "name": "MemberAccess",
                            "src": "5889:33:19"
                          }
                        ],
                        "id": 5166,
                        "name": "UnaryOperation",
                        "src": "5889:35:19"
                      }
                    ],
                    "id": 5167,
                    "name": "ExpressionStatement",
                    "src": "5889:35:19"
                  }
                ],
                "id": 5168,
                "name": "Block",
                "src": "5535:396:19"
              }
            ],
            "id": 5169,
            "name": "FunctionDefinition",
            "src": "5447:484:19"
          },
          {
            "attributes": {
              "constant": false,
              "implemented": true,
              "isConstructor": false,
              "modifiers": [
                null
              ],
              "name": "_insertTokenMetadata",
              "payable": false,
              "scope": 5184,
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
                      "name": "_tokenId",
                      "scope": 5183,
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
                        "id": 5170,
                        "name": "ElementaryTypeName",
                        "src": "5967:4:19"
                      }
                    ],
                    "id": 5171,
                    "name": "VariableDeclaration",
                    "src": "5967:13:19"
                  },
                  {
                    "attributes": {
                      "constant": false,
                      "name": "_metadata",
                      "scope": 5183,
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
                        "id": 5172,
                        "name": "ElementaryTypeName",
                        "src": "5982:6:19"
                      }
                    ],
                    "id": 5173,
                    "name": "VariableDeclaration",
                    "src": "5982:16:19"
                  }
                ],
                "id": 5174,
                "name": "ParameterList",
                "src": "5966:33:19"
              },
              {
                "attributes": {
                  "parameters": [
                    null
                  ]
                },
                "children": [],
                "id": 5175,
                "name": "ParameterList",
                "src": "6021:0:19"
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
                          "type": "string storage ref"
                        },
                        "children": [
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "isConstant": false,
                              "isLValue": true,
                              "isPure": false,
                              "lValueRequested": true,
                              "type": "string storage ref"
                            },
                            "children": [
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "overloadedDeclarations": [
                                    null
                                  ],
                                  "referencedDeclaration": 4650,
                                  "type": "mapping(uint256 => string storage ref)",
                                  "value": "tokenIdToMetadata"
                                },
                                "id": 5176,
                                "name": "Identifier",
                                "src": "6031:17:19"
                              },
                              {
                                "attributes": {
                                  "argumentTypes": null,
                                  "overloadedDeclarations": [
                                    null
                                  ],
                                  "referencedDeclaration": 5171,
                                  "type": "uint256",
                                  "value": "_tokenId"
                                },
                                "id": 5177,
                                "name": "Identifier",
                                "src": "6049:8:19"
                              }
                            ],
                            "id": 5178,
                            "name": "IndexAccess",
                            "src": "6031:27:19"
                          },
                          {
                            "attributes": {
                              "argumentTypes": null,
                              "overloadedDeclarations": [
                                null
                              ],
                              "referencedDeclaration": 5173,
                              "type": "string memory",
                              "value": "_metadata"
                            },
                            "id": 5179,
                            "name": "Identifier",
                            "src": "6061:9:19"
                          }
                        ],
                        "id": 5180,
                        "name": "Assignment",
                        "src": "6031:39:19"
                      }
                    ],
                    "id": 5181,
                    "name": "ExpressionStatement",
                    "src": "6031:39:19"
                  }
                ],
                "id": 5182,
                "name": "Block",
                "src": "6021:56:19"
              }
            ],
            "id": 5183,
            "name": "FunctionDefinition",
            "src": "5937:140:19"
          }
        ],
        "id": 5184,
        "name": "ContractDefinition",
        "src": "449:5630:19"
      }
    ],
    "id": 5185,
    "name": "SourceUnit",
    "src": "0:6080:19"
  },
  "compiler": {
    "name": "solc",
    "version": "0.4.18+commit.9cf6e910.Emscripten.clang"
  },
  "networks": {},
  "schemaVersion": "1.0.1",
  "updatedAt": "2018-03-23T04:19:01.786Z"
}