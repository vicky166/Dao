// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./minting.sol";
contract Voting {
    address payable public owner;
    uint256 public voters;
    uint256 public duration = 10 minutes;
    ERC721 public nftContract;
    MyToken public token;

    mapping(address => bool) public hasVoted;

    constructor(address _nftContractAddress) {
        owner = payable(msg.sender);
        nftContract = ERC721(_nftContractAddress);
    }

    function isVoter(address account) public view returns (bool) {
        return nftContract.balanceOf(account) > 0;
    }

    function vote() public {
        require(isVoter(msg.sender), "You need NFT to vote");
        require(!hasVoted[msg.sender], "You have already voted");

        hasVoted[msg.sender] = true;
        voters += 1;
    }
function createproposal(address account)public view returns (bool){
    return isVoter(account);
}

    function canPropose(address account) public view returns (bool) {
                if (token.balanceOf(account) > 0) return true;
                 else return false;

    }

    

    function canVote(address account) public view returns (bool) {
        return isVoter(account) && !hasVoted[account];
    }
}
