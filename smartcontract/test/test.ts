import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { ethers } from "ethers";

import { expect } from "chai";
import hre from "hardhat";


describe("mintingnft", function () {
  let proposalName: string = "proposalname";
  let proposalDesc: string = "proposaldescription";
  let proposalTime: number = 180;
  let proposaltital: string = "title";

  async function deployNftTokenFixture() {
    const [bob, alice] = await hre.ethers.getSigners();

    const Token = await hre.ethers.getContractFactory("MyToken");
    const token = await Token.deploy();

    const Controler = await hre.ethers.getContractFactory("Voting");
    const controler = await Controler.deploy(token.address);

    const Proposal = await hre.ethers.getContractFactory("Proposal");
    const proposal = await Proposal.deploy(token.address, controler.address);

    return { token, bob, alice, controler, proposal };
  }

  it("minting", async function () {
    const { token, bob } = await loadFixture(deployNftTokenFixture);
    await token.safeMint(bob.address);
    const nftToken = await token.balanceOf(bob.address);
    expect(nftToken).to.equal(1);
  });

  it("NFT holders to vote", async function () {
    const { token, controler, bob } = await loadFixture(deployNftTokenFixture);
    await token.safeMint(bob.address);
    await controler.vote();
    const hasVoted = await controler.hasVoted(bob.address);
    expect(hasVoted).to.be.true;
    const voters = await controler.voters();
    expect(voters).to.equal(1);
  });
  
  it("should createproposal", async function () {
    const { token, bob, controler } = await loadFixture(deployNftTokenFixture);
    const safemint=await token.safeMint(bob.getAddress());
    const canpropose = await controler.Canpropose(bob.getAddress());
    const proposalDesc = "Description of my proposal";
    const proposalTitle = "Proposal Title";
    const timePeriod = 604800;
    const proposals =await canpropose.connect(bob).createproposal(proposalDesc,proposalTitle,timePeriod);
  })

});





