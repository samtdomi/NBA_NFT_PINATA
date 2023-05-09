// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

// Errors
error NbaNft__RandomNumberOutOfRange();
error NbaNft__TransferFailed();

contract NbaNft is VRFConsumerBaseV2, ERC721URIStorage {
    // Types:
    enum nbaNfts {
        Rajon_Rondo,
        Rick_Fox,
        Allen_Iverson,
        Lebron_James,
        Kobe_Bryant
    }

    // Chainlink VRF variables
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    bytes32 private immutable i_keyHash;
    uint64 private immutable i_subId;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private immutable i_callbackGasLimit;
    uint32 private constant NUM_WORDS = 1;

    // State Variables:
    mapping(uint256 => address) public requestIdToOwner;
    uint256 nftId;
    string[] internal nftURIs;
    address payable i_owner;
    uint256 private immutable i_mintFee;

    // Modifier:
    modifier onlyOwner() {
        require(i_owner == msg.sender);
        _;
    }

    modifier mintFeePaid() {
        require(msg.value >= i_mintFee);
        _;
    }

    constructor(
        address _vrfCoordinator,
        bytes32 _keyHash,
        uint64 _subId,
        uint32 _callbackGasLimit,
        string[5] memory _nftURIs,
        uint256 _mintFee
    ) VRFConsumerBaseV2(_vrfCoordinator) ERC721("NbaNFT", "NBA") {
        i_vrfCoordinator = VRFCoordinatorV2Interface(_vrfCoordinator);
        i_keyHash = _keyHash;
        i_subId = _subId;
        i_callbackGasLimit = _callbackGasLimit;
        nftId = 0;
        nftURIs = _nftURIs;
        i_owner = payable(msg.sender);
        i_mintFee = _mintFee;
    }

    function requestNbaNft()
        public
        payable
        mintFeePaid
        returns (uint256 requestId)
    {
        requestId = i_vrfCoordinator.requestRandomWords(
            i_keyHash,
            i_subId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );

        requestIdToOwner[requestId] = msg.sender;
    }

    function fulfillRandomWords(
        uint256 requestId,
        uint256[] memory randomWords
    ) internal virtual override {
        uint256 newNftId = nftId;
        uint256 winningNumber = randomWords[0] % 100;
        address nftOwner = requestIdToOwner[requestId];
        nbaNfts winningNft = chooseWinner(winningNumber);
        _safeMint(nftOwner, newNftId);
        _setTokenURI(newNftId, nftURIs[uint256(winningNft)]);
    }

    function chooseWinner(
        uint256 winningNumber
    ) internal pure returns (nbaNfts winningNft) {
        if (winningNumber < 35) {
            winningNft = nbaNfts.Rajon_Rondo;
            return winningNft;
        } else if (winningNumber >= 35 && winningNumber < 70) {
            winningNft = nbaNfts.Rick_Fox;
            return winningNft;
        } else if (winningNumber >= 70 && winningNumber < 85) {
            winningNft = nbaNfts.Allen_Iverson;
            return winningNft;
        } else if (winningNumber >= 85 && winningNumber < 95) {
            winningNft = nbaNfts.Lebron_James;
            return winningNft;
        } else if (winningNumber >= 95 && winningNumber < 100) {
            winningNft = nbaNfts.Kobe_Bryant;
            return winningNft;
        } else {
            revert NbaNft__RandomNumberOutOfRange();
        }
    }

    function withdraw() public payable onlyOwner {
        (bool success, ) = i_owner.call{value: address(this).balance}("");
        if (!success) {
            revert NbaNft__TransferFailed();
        }
    }
} // End of smart contract
