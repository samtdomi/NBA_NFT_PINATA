require("@nomicfoundation/hardhat-toolbox")
require("dotenv").config()
require("hardhat-deploy")

const mainnet_rpc_url = process.env.mainnet_rpc_url // alchemy mainnet rpc url
const goerli_rpc_url = process.env.goerli_rpc_url // alchemy goerli rpc url
const etherscan_api_key = process.env.etherscan_api_key // etherscan
const coinMarketCap_api_key = process.env.coinMarketCap_api_key // coinmarketcap
const goerli_private_key = process.env.goerli_private_key // metamask wallet goerli private key
const sepolia_rpc_url = process.env.sepolia_rpc_url // alchemy sepolia testnet
const sepolia_private_key = process.env.sepolia_private_key // sepolia private wallet key
const polygon_mumbai_rpc_url = process.env.polygon_mumbai_rpc_url // polygon mumbai alchemy rpc url
const polygon_mumbai_private_key = process.env.polygon_mumbai_private_key

module.exports = {
    solidity: {
        compilers: [
            { version: "0.8.17" },
            { version: "0.4.19" },
            { version: "0.6.12" },
            { version: "0.8.0" },
            { version: "0.8.4" },
        ],
    },

    namedAccounts: {
        deployer: {
            default: 0,
        },
        player: {
            default: 1,
        },
    },

    networks: {
        hardhat: {
            chainId: 31337,
            forking: {
                url: mainnet_rpc_url,
            },
        },
        goerli: {
            chainId: 5,
            url: goerli_rpc_url,
            accounts: [goerli_private_key],
        },
        sepolia: {
            chainId: 11155111,
            url: sepolia_rpc_url,
            accounts: [sepolia_private_key],
        },
        mumbai: {
            chainId: 80001,
            url: polygon_mumbai_rpc_url,
            accounts: [polygon_mumbai_private_key],
        },
    },

    etherscan: {
        apiKey: etherscan_api_key,
    },

    gasReporter: {
        enabled: true,
        outputFile: "gas-report.txt",
        noColors: true,
        currency: "USD",
        coinmarketcap: coinMarketCap_api_key,
        token: "MATIC",
    },

    mocha: {
        // time limit for the Promise and Listener in test.js
        // if the listener doesnt get resolved in 300 seconds, its error's out
        timeout: 500000, // 500,000 miliseconds, 500 seconds
    },
}
