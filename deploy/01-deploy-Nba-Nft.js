const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
const { pinMetadataToIpfs } = require("../scripts/pinata-token-uris")

// ----------------------------------------------------------------------------------
//
// Deploy Script
module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    // other Variables
    const fundSubAmount = "1000000000000000000000"
    const imagesLocation = "./images/nft"

    // Call Function Which adds IPFS image hash to NFT , pins JSON to IPFS, and returns JSON Hash
    let nftUris
    nftUris = await pinMetadataToIpfs(imagesLocation)

    // Constructor Variables
    let vrfCoordinatorV2Address, subId
    const keyHash = networkConfig[chainId]["keyHash"]
    const callbackGasLimit = networkConfig[chainId]["callbackGasLimit"]
    const mintFee = networkConfig[chainId]["mintFee"]

    // Deploy Mocks
    if (developmentChains.includes(network.name)) {
        const vrfCoordinatorMock = await ethers.getContract(
            "VRFCoordinatorV2Mock"
        )
        vrfCoordinatorV2Address = vrfCoordinatorMock.address
        const tx = await vrfCoordinatorMock.createSubscription()
        const txReceipt = await tx.wait(1)
        subId = txReceipt.events[0].args.subId
        await vrfCoordinatorMock.fundSubscription(subId, fundSubAmount)
    } else {
        vrfCoordinatorV2Address = networkConfig[chainId]["vrfCoordinatorV2"]
        subId = networkConfig[chainId]["subId"]
    }

    // Completely Populated Constructor Arguments
    const constructorArguments = [
        vrfCoordinatorV2Address,
        keyHash,
        subId,
        callbackGasLimit,
        nftUris,
        mintFee,
    ]

    console.log("- - - Deploying NbaNfts")

    // Deploy Smart Contract
    const nbaNft = await deploy("NbaNft", {
        from: deployer,
        log: true,
        args: constructorArguments,
    })

    console.log(`- - - Deployed Smart Contract at ${nbaNft.address}`)

    /** 
    // Verify on Etherscan if on testnet or mainnet
    if (
        !developmentChains.includes(network.name) &&
        process.env.etherscan_api_key
    ) {
        console.log("- - - Verifying on etherscan")
        await verify(nbaNft.address, constructorArguments)
    }
*/
}

module.exports.tags = ["all", "nbaNft", "main"]
