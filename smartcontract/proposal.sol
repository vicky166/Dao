// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0

pragma solidity ^0.8.24;

import "./minting.sol"; 
import "./nft.sol";     

contract Proposal {
    MyToken public token;
    Voting private votingContract;
    uint232 private proposalIdCounter; 
    ProposalStruct[] public setProposals;

    enum VoteChoice {
        Yes,
        No
    }

    struct ProposalStruct {
        uint256 id;
        string title;
        string description;
        uint256 yesVote;
        uint256 noVote;
        address owner;
        uint256 votingTimePeriod;
        bool isComplete;
    }

    mapping(uint256 => ProposalStruct) public proposals; 
    mapping(address => mapping(uint256 => bool)) public hasVoted;

    constructor(MyToken _token, Voting _votingContract) {
        token = _token;
        votingContract = _votingContract;
    }

    function createProposal(
        string memory _title,
        string memory _description,
        uint256 _timePeriod
    ) public {
        require(
            votingContract.canPropose(msg.sender) == true,
            "Person cannot create the proposal"
        );

        proposalIdCounter += 1;

        ProposalStruct memory newProposal = ProposalStruct({
            id: proposalIdCounter,
            title: _title,
            description: _description,
            yesVote: 0,
            noVote: 0,
            owner: msg.sender,
            votingTimePeriod: block.timestamp + _timePeriod,
            isComplete: false
        });

        proposals[proposalIdCounter] = newProposal;
        setProposals.push(newProposal);
    }

    function voteOnProposal(
        uint232 _proposalId,
        VoteChoice _voteChoice
    ) external {
        require(
            votingContract.isVoter(msg.sender) == true,
            "Person is not a voter"
        );
        require(
            votingContract.canVote(msg.sender) == true,
            "Person is not eligible for voting"
        );
        require(
            _voteChoice == VoteChoice.Yes || _voteChoice == VoteChoice.No,
            "Only yes(0) or no(1) accepted"
        );
        require(
            proposals[_proposalId].votingTimePeriod > block.timestamp,
            "Voting period has ended"
        );
        require(
            !hasVoted[msg.sender][_proposalId],
            "You have already voted on this proposal"
        );

        ProposalStruct storage proposal = proposals[_proposalId];

        if (_voteChoice == VoteChoice.Yes) {
            proposal.yesVote += 1;
        } else {
            proposal.noVote += 1;
        }

        hasVoted[msg.sender][_proposalId] = true;
    }

    function getPostedProposals() external view returns (ProposalStruct[] memory) {
        ProposalStruct[] memory allProposals = new ProposalStruct[](proposalIdCounter);

        for (uint256 i = 1; i <= proposalIdCounter; i++) {
            allProposals[i - 1] = proposals[i];
        }

        return allProposals;
    }

    function totalPostedProposal() external view returns (ProposalStruct[] memory) {
        return setProposals;
    }

  
}
