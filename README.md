This project will allow people to mint an NFT that will be randomly selected
out of a set of 5 possible NFT's.

-   Randomization using ChainlinkVRF

    -   Chainlink Mocks

-   Pin Image file and Metadata JSON to IPFS for each NFT

    -   PINATA
    -   get IPFS Hash

-   Assign each NFT its poopulated Metadata TokenURI

-   NFT purchase price:

    -   .05 eth

-   NFT Options and Chance:
    -   Rajon Rondo
        -   35 %
    -   Rick Fox
        -   35 %
    -   Allen Iverson
        -   15 %
    -   Lebron James
        -   10 %
    -   Kobe Bryant
        -   5 %

Process:

-   Smart Contract:

1. Call ChainlinkVRF to generate a random number in the range of 100 (total percentage of all NFT's)
   1a. each nft is given its range of numbers out of 100 according to their percent chance of being drawn (Rajon -> 0-34, Rick -> 35-69, Allen -> 70-84, Lebron -> 85-94, Kobe 95 - 99)
   1b. save the requestId to the address that called it , make that the owner for the NFT selected from that requestID

create all functionality in the fulfillRandomWords function 2. Use the random number to select the specific NFT

3. save the NFT to its owners address

-   Deploy Script:
    -   Mocks

1. populate constructor chainlinkVRF variables

2. pin each nft image to IPFS using Pinata / generate IPFS hash for the image

3. fill out complete JSON Metadata for each NFT and include its IPFS image hash for its image: section

4. Pass in to the constructor an array of completed NFT metadata's in the correct order according to the smart contract
