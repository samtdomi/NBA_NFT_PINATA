const pinataSDK = require("@pinata/sdk")
const path = require("path")
const fs = require("fs")
require("dotenv").config()

const pinataApiKey = process.env.pinata_api_key
const pinataSecretKey = process.env.pinata_secret_api_key
const pinata = new pinataSDK(pinataApiKey, pinataSecretKey)

async function pinImagesToIpfs(imagesLocation) {
    // create a full path for the nft images folder
    const nftImagesFolderPath = path.resolve(imagesLocation)

    // return a readable array of each image file in nft images folder in order
    const nftFiles = fs.readdirSync(nftImagesFolderPath)

    let responses = []

    console.log("- - - - Pinata pinning NFT images to IPFS!!")

    // ------------------------------------------------

    for (const nftFile in nftFiles) {
        const readableStream = fs.createReadStream(
            `${nftImagesFolderPath}/${nftFiles[nftFile]}`
        )

        const options = {
            pinataMetadata: {
                name: nftFiles[nftFile],
            },
        }

        try {
            // pin image file to IPFS, pinata returns [ipfsHash, byteSize, timeStamp] for each file
            const pinataResponse = await pinata.pinFileToIPFS(
                readableStream,
                options
            )
            responses.push(pinataResponse)
        } catch (error) {
            console.log(error)
        }
    }

    console.log(responses)

    return { responses, nftFiles }
}

module.exports = {
    pinImagesToIpfs,
}
