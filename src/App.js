import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { Web3Provider } from "@ethersproject/providers";

import { contractABI, contractAddress } from "./contract";

const App = () => {
  const [proposals, setProposals] = useState([]);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");

  const handleVote = async (index) => {
    try {
      const tx = await contract.vote(index);
      await tx.wait();
      alert("Vote cast!");
      window.location.reload();
    } catch (err) {
      console.log(err.error.message)
      alert("Error voting: " + err.error.message);
    }
  };

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const provider = new Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        setContract(contract);
        setAccount(await signer.getAddress());
        const network = await provider.getNetwork();
        console.log("Connected to:", network.name);

        const count = await contract.getProposalCount();
        const props = [];
        for (let i = 0; i < count; i++) {
          const [name, votes] = await contract.getProposal(i);
          props.push({ name, votes: votes.toString() });
        }
        setProposals(props);
      }
    };
    init();
  }, []);

  return (
    <div className="container py-5">
  <div className="card shadow-sm mb-4">
    <div className="card-body">
      <h1 className="card-title h3 fw-bold text-primary mb-3">🗳️ Voting dApp</h1>
      <p className="card-subtitle text-muted">Connected as: <span className="fw-semibold">{account}</span></p>
    </div>
  </div>

  <div className="row row-cols-1 row-cols-md-2 g-4">
    {proposals.map((p, i) => (
      <div key={i} className="col">
        <div className="card h-100 border-primary">
          <div className="card-body">
            <h5 className="card-title fw-bold text-dark">{p.name}</h5>
            <p className="card-text">
              <span className="badge bg-secondary me-2">{p.votes} votes</span>
            </p>
            <button
              className="btn btn-outline-primary btn-sm mt-2"
              onClick={() => handleVote(i)}
            >
              Vote
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>

  );
};

export default App;
