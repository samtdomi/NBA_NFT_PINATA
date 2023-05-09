const pinataSDK = require("@pinata/sdk")
require("dotenv").config()
const { pinImagesToIpfs } = require("./pin-image-to-ipfs")

const pinataApiKey = process.env.pinata_api_key
const pinataSecretKey = process.env.pinata_secret_api_key
const pinata = new pinataSDK(pinataApiKey, pinataSecretKey)

// Token URI Metadata for each player
const rajonRondoMetadata = {
    name: "Rajon Rondo",
    position: "Point Guard",
    image: "",
    champion: "1x",
    attributes: {
        passing: "100",
        scoring: "50",
        defense: "90",
    },
}
const rickFoxMetadata = {
    name: "Rick Fox",
    position: "Guard",
    image: "",
    champion: "3x",
    attributes: {
        passing: "55",
        scoring: "70",
        defense: "90",
    },
}
const allenIversonMetadata = {
    name: "Allen Iverson",
    position: "Point Guard",
    image: "",
    champion: "0",
    attirbutes: {
        passing: "88",
        scoring: "95",
        defense: "75",
    },
}
const lebronJamesMetadata = {
    name: "Lebron James",
    position: "Guard",
    image: "",
    champion: "3x",
    attributes: {
        passing: "90",
        scoring: "95",
        defense: "90",
    },
}
const kobeBryantMetadata = {
    name: "Kobe Bryant",
    position: "Guard",
    image: "",
    champion: "5x",
    attributes: {
        passing: "90",
        scoring: "100",
        defense: "90",
    },
}

const JSONorder = [
    rajonRondoMetadata,
    rickFoxMetadata,
    allenIversonMetadata,
    lebronJamesMetadata,
    kobeBryantMetadata,
]

// ------------------------------------------------------------
//
//
async function pinMetadataToIpfs(imagesLocation) {
    let nftUris = []

    // gets the pinata responses for each pinned nft image file
    const { responses: pinataResponses, nftFiles } = await pinImagesToIpfs(
        imagesLocation
    )

    // ----------------------------------------------------------------------
    //

    for (const responseIndex in pinataResponses) {
        console.log("- - - -  RUNNING FOR LOOP")
        console.log(
            `- - - Pinning ${nftFiles[responseIndex]} Metadata to IPFS!`
        )

        // add the ipfs image file hash to its NFT metadata
        const nftMetadata = JSONorder[responseIndex]

        console.log(nftMetadata)

        nftMetadata.image = `ipfs://${pinataResponses[responseIndex].IpfsHash}`

        const options = {
            pinataMetadata: {
                name: nftMetadata.name,
            },
        }

        try {
            // Pin JSON Metadata to IPFS and record its responses
            const metadataPinataResponse = await pinata.pinJSONToIPFS(
                nftMetadata,
                options
            )

            nftUris.push(`ipfs://${metadataPinataResponse.IpfsHash}`)
        } catch (error) {
            console.log(error)
        }
    } // End of For Loop

    console.log(`- - - Uploaded NFT URIs: `)
    console.log(nftUris)

    return nftUris
}

module.exports = {
    pinMetadataToIpfs,
}

// -----------------------------------------------------------------------------
/**
    // Rajon Rondo Upload Metadata
    rajonRondoMetadata.image = `ipfs://${pinataResponses[0].IpfsHash}`
    let options = {
        pinataMetadata: {
            name: rajonRondoMetadata.name,
        },
    }
    const rajonMetadataResponse = await pinata.pinJSONToIPFS(
        rajonRondoMetadata,
        options
    )
    nftUris.push(`ipfs://${rajonMetadataResponse.IpfsHash}`)

    console.log(nftUris)

    // Rick Fox Upload MEtadata
    rickFoxMetadata.image = `ipfs://${pinataResponses[1].IpfsHash}`
    options = {
        pinataMetadata: {
            name: rickFoxMetadata.name,
        },
    }
    const rickMetadataResponse = await pinata.pinJSONToIPFS(
        rickFoxMetadata,
        options
    )
    nftUris.push(`ipfs://${rickMetadataResponse.IpfsHash}`)

    // Allen Iverson Upload MEtadata
    allenIversonMetadata.image = `ipfs://${pinataResponses[2].IpfsHash}`
    options = {
        pinataMetadata: {
            name: allenIversonMetadata.name,
        },
    }
    const allenMetadataResponse = await pinata.pinJSONToIPFS(
        allenIversonMetadata,
        options
    )
    nftUris.push(`ipfs://${allenMetadataResponse.IpfsHash}`)

    // Lebron Upload Metadata
    lebronJamesMetadata.image = `ipfs://${pinataResponses[3].IpfsHash}`
    options = {
        pinataMetadata: {
            name: lebronJamesMetadata.name,
        },
    }
    const lebronMetadataResponse = await pinata.pinJSONToIPFS(
        lebronJamesMetadata,
        options
    )
    nftUris.push(`ipfs://${lebronMetadataResponse.IpfsHash}`)

    // Kobe Upload MEtadata
    kobeBryantMetadata.image = `ipfs://${pinataResponses[4].IpfsHash}`
    options = {
        pinataMetadata: {
            name: kobeBryantMetadata.name,
        },
    }
    const kobeMetadataResponse = await pinata.pinJSONToIPFS(
        kobeBryantMetadata,
        options
    )
    nftUris.push(`ipfs://${kobeMetadataResponse.IpfsHash}`)
*/
