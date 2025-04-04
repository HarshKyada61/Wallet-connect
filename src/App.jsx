import React, { useState, useEffect } from "react";
import Web3 from "web3";
import TransactionTable from "./components/TransactionTable";

const App = () => {
  const [account, setAccount] = useState(null); // To store connected wallet address
  const [balance, setBalance] = useState(null); // To store balance
  const [web3, setWeb3] = useState(null); // To store Web3 instance
  const [allTransactions, setAllTransactions] = useState(null);

  // Function to connect MetaMask wallet
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // Request account access if needed
        await window.ethereum.request({ method: "eth_requestAccounts" });

        // Create a Web3 instance
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        // Get the connected accounts
        const accounts = await web3Instance.eth.getAccounts();
        setAccount(accounts[0]);
        console.log(accounts[0]);

        // Get the account balance
        const balanceWei = await web3Instance.eth.getBalance(accounts[0]);
        setBalance(web3Instance.utils.fromWei(balanceWei, "ether"));
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    } else {
      alert("MetaMask is not installed. Please install it to use this app.");
    }
  };

  const sendTransaction = async () => {
    try {
      const senderAddress = account;
      const recipientAddress = "0x05182467fC87DAE0585e05648702603F503AA5C0"; // Replace with the recipient's address
      const amountToSend = web3.utils.toWei("0.00000001", "ether"); // Convert 0.00000001 ETH to Wei

      const transactionParameters = {
        from: senderAddress,
        to: recipientAddress,
        value: web3.utils.toHex(amountToSend), // Amount to send in Wei
        gas: web3.utils.toHex(21000), // Standard gas limit for ETH transfer
      };

      // Send the transaction
      const txHash = await web3.eth.sendTransaction(transactionParameters);

      console.log("Transaction successful! Hash:", txHash);
      alert(`Transaction successful! Hash: ${txHash.transactionHash}`);
    } catch (error) {
      console.error("Transaction failed:", error.message);
      alert("Transaction failed! Check the console for details.");
    }
  };

  const getTransactions = async () => {
    let blockNumber = await web3.eth.getBlockNumber(); // Get the latest block number
    console.log(blockNumber);

    let transactions = [];

    for (let i = blockNumber; i >= blockNumber - BigInt(100); i--) {
      // Check the last 100 blocks
      let block = await web3.eth.getBlock(i, true); // Fetch block details
      block.transactions.forEach((tx) => {
        transactions.push(tx);
      });
    }
    setAllTransactions(transactions);
    console.log("🚀 ~ getTransactions ~ transactions:", transactions);
  };

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
          setBalance(null);
        }
      });

      window.ethereum.on("chainChanged", () => {
        window.location.reload(); // Reload the page when the network changes
      });
    }
  }, []);

  return (
    <div>
      <h1>React + Web3 + MetaMask DApp</h1>
      {!account ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <div>
          <p>
            <strong>Connected Account:</strong> {account}
          </p>
          <p>
            <strong>Balance:</strong> {balance} ETH
          </p>
          <button
            onClick={() =>
              window.ethereum.request({ method: "eth_requestAccounts" })
            }
          >
            Refresh Balance
          </button>
          <button onClick={getTransactions}>getTransactions</button>
          <button onClick={sendTransaction}>Send Transaction</button>

          {allTransactions ? (
            <TransactionTable transactions={allTransactions} />
          ) : (
            ""
          )}
        </div>
      )}
    </div>
  );
};

export default App;
