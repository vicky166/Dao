import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Button } from "antd";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import proposalabi from "./ABI.json";

export function Minting() {
  const contractAddress = "0x5829B31EF88c199d13C474ad9546971f03eD7Bf7";
  const [signer, setSigner] = useState(null);
  const [provider, setProvider] = useState(null);
  const [yes, setYes] = useState(0);
  const [no, setNo] = useState(0);
  const [proposals, setProposals] = useState([]);
  const [curProposal, setCurProposal] = useState("");
  const [curDescription, setCurDescription] = useState("");
  const [curTimePeriod, setCurTimePeriod] = useState(1800);

  async function connectAccount() {
    let initProvider;
    if (window.ethereum == null) {
      console.log("MetaMask not installed; using read-only defaults");
      initProvider = ethers.getDefaultProvider();
      setProvider(initProvider);
    } else {
      initProvider = new ethers.BrowserProvider(window.ethereum);
      const initSigner = await initProvider.getSigner();
      setSigner(initSigner);
      setProvider(initProvider);
    }
  }

  async function Createprop() {
    if (!signer) return;
    const contract = new ethers.Contract(contractAddress, proposalabi, signer);
    const tx = await contract.createProposal(
      curProposal,
      curDescription,
      curTimePeriod
    );
    await tx.wait();
  }

  async function totalproposal() {
    if (!provider) return;
    const contract = new ethers.Contract(
      contractAddress,
      proposalabi,
      provider
    );
    const prop = await contract.totalPostedProposal();
    setProposals(prop);
  }

  async function voteProposal(id, choice) {
  
    const contract = new ethers.Contract(contractAddress,proposalabi,signer);
    const vx = await contract.voteOnProposal(id, choice);
    vx.wait();
  }

  useEffect(() => {
    connectAccount();
  }, []);

  useEffect(() => {
    if (provider) {
      totalproposal();
    }
  }, [provider]);

  return (
    <>
      <div>
        <Navbar bg="dark" data-bs-theme="dark">
          <Container>
            <Navbar.Brand id="navbar" variant="info">
              DAO
            </Navbar.Brand>
            <Nav className="me-auto"></Nav>
          </Container>
        </Navbar>
        <Container className="firstcont">
          <Row>
            <Col>
              <Form name="myform">
                <Form.Label className="proposel" htmlFor="inputProposal">
                  Proposal Title
                </Form.Label>
                <Form.Control
                  onChange={(e) => setCurProposal(e.target.value)}
                  className="form"
                  type="text"
                  name="proposal"
                  id="inputProposal"
                  aria-describedby="proposalHelpBlock"
                  value={curProposal}
                />
                <Form.Label className="proposel" htmlFor="inputDescription">
                  Proposal Description
                </Form.Label>
                <Form.Control
                  onChange={(e) => setCurDescription(e.target.value)}
                  className="form"
                  type="text"
                  name="description"
                  id="inputDescription"
                  aria-describedby="descriptionHelpBlock"
                  value={curDescription}
                />
              </Form>
            </Col>
            <Col>
              <Button className="btn1" type="button" onClick={Createprop}>
                Submit
              </Button>
              <Button className="btn1" onClick={totalproposal}>
                Postedproposal
              </Button>
            </Col>
          </Row>
          <Row>
            {proposals.map((item, i) => (
              <Col key={i}>
                <Card id="Contain" style={{ width: "18rem" }}>
                  <Card.Body id="proposal">
                    <Card.Title>Proposal</Card.Title>
                    <Card.Text>{item.title}</Card.Text>

                    <Col id="proposal">Title:{item.description}</Col>
                  </Card.Body>
                 

                  <div className="app">
                    <Button
                      className="btn5"
                      variant="outline-success"
                      onClick={() => voteProposal(Number(item.id), 0)}
                    >
                      YES
                    </Button>
                    <Col className="count1">{Number(item.yesVote)}</Col>
                    <Button
                      className="btn6"
                      variant="outline-danger"
                      onClick={() => voteProposal(Number(item.id),1)}
                      >NO
                    </Button>
                    <Col >
                    <div className="count2">{Number(item.noVote)} </div>
                    </Col>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </div>
      {signer ? signer.address : <Button onClick={connectAccount}></Button>}{" "}
    </>
  );
}
   