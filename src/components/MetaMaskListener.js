import { useEffect, useState } from "react";

import { Web3Provider } from "@ethersproject/providers";
import { ethers } from "ethers";

const MetaMaskListener = () => {
  const [account, setAccount] = useState(null);
  const [network, setNetwork] = useState("");
  const [weiBalance, setWeiBalance] = useState("");
  const [ethBalance, setEthBalance] = useState("");

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new Web3Provider(window.ethereum);
      const handleAccountsChanged = async (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          const currentAccount = accounts[0];
          const network = await provider.getNetwork();
          setNetwork(network.name);
          const balanceWei = await provider.getBalance(currentAccount);
          setWeiBalance(balanceWei.toString());
          setEthBalance(ethers.formatEther(balanceWei.toBigInt()));
        } else {
          setAccount(null);
        }
      };

      // Initial fetch
      window.ethereum
        .request({ method: "eth_accounts" })
        .then(handleAccountsChanged);

      // Listen to account changes
      window.ethereum.on("accountsChanged", handleAccountsChanged);

      // Optional: clean up the listener on unmount
      return () => {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      };
    } else {
      console.log("🦊 MetaMask is not installed");
    }
  }, []);

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h1 className="card-title h3 fw-bold text-primary mb-3">
          🗳️ Voting dApp
        </h1>
        <p className="card-subtitle text-muted">
          👤 : <span className="fw-semibold">{account}</span>
        </p>
        <p className="card-subtitle text-muted">
          🌐 : <span className="fw-semibold">{network}</span>
        </p>
        <p className="card-subtitle text-muted">
          💰 : <span className="fw-semibold">{weiBalance}</span> Wei
        </p>
        <p className="card-subtitle text-muted">
          💰 : <span className="fw-semibold">{ethBalance}</span> ETH
        </p>
      </div>
    </div>
  );
};

export default MetaMaskListener;
