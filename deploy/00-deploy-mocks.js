const { developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    const fee = ethers.utils.parseEther("0.25")
    const Link_Gas = 1e9
    const args = [fee, Link_Gas]

    if (developmentChains.includes(network.name)) {
        console.log("- - - - Local network detected - Deploying Mocks!!")

        const vrfCoordinatorV2Mock = await deploy("VRFCoordinatorV2Mock", {
            from: deployer,
            args: args,
            log: true,
        })

        console.log("- - - - VRFCoordinatorV2Mock Deployed!")
    }
}

module.exports.tags = ["all", "mocks"]
