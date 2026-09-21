import React, { useState, useEffect } from "react";
import axios from "axios";

const Funds = () => {
  const [balance, setBalance] = useState(100000);
  const [usedMargin, setUsedMargin] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchFunds = async () => {
    try {
      const [profileRes, holdingsRes] = await Promise.all([
        axios.get("http://localhost:3002/userProfile", { withCredentials: true }),
        axios.get("http://localhost:3002/allHoldings", { withCredentials: true }),
      ]);

      if (profileRes.data && profileRes.data.balance !== undefined) {
        setBalance(profileRes.data.balance);
      }

      if (Array.isArray(holdingsRes.data)) {
        const totalInvested = holdingsRes.data.reduce(
          (acc, h) => acc + h.avg * h.qty,
          0
        );
        setUsedMargin(totalInvested);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching funds profile:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFunds();
  }, []);

  const handleAddFunds = async () => {
    const amountStr = prompt("Enter Virtual Deposit Amount (₹):", "10000");
    if (!amountStr) return;
    const amount = Number(amountStr);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:3002/addFunds",
        { amount },
        { withCredentials: true }
      );
      if (res.data.success) {
        alert(res.data.message);
        setBalance(res.data.balance);
      }
    } catch (err) {
      alert("Failed to add funds. Please check your login status.");
    }
  };

  if (loading) {
    return <div className="p-4">Loading wallet balance...</div>;
  }

  const formattedBalance = Number(balance).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const formattedUsedMargin = Number(usedMargin).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <>
      <div className="funds">
        <p>Instant, zero-cost paper trading fund transfers </p>
        <button className="btn btn-green" onClick={handleAddFunds}>
          Add funds
        </button>
        <button
          className="btn btn-blue"
          onClick={() => alert("Virtual withdrawal simulator!")}
        >
          Withdraw
        </button>
      </div>

      <div className="row">
        <div className="col">
          <span>
            <p>Equity Portfolio Funds</p>
          </span>

          <div className="table">
            <div className="data">
              <p>Available margin</p>
              <p className="imp colored">₹{formattedBalance}</p>
            </div>
            <div className="data">
              <p>Used margin</p>
              <p className="imp">₹{formattedUsedMargin}</p>
            </div>
            <div className="data">
              <p>Available cash</p>
              <p className="imp">₹{formattedBalance}</p>
            </div>
            <hr />
            <div className="data">
              <p>Opening Balance</p>
              <p>₹{formattedBalance}</p>
            </div>
            <div className="data">
              <p>Payin (Deposits)</p>
              <p>₹0.00</p>
            </div>
            <div className="data">
              <p>SPAN / Delivery margin</p>
              <p>₹0.00</p>
            </div>
            <div className="data">
              <p>Options premium</p>
              <p>₹0.00</p>
            </div>
            <hr />
            <div className="data">
              <p>Total Collateral</p>
              <p>₹0.00</p>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="commodity">
            <p>You have a Virtual Equity & Derivatives Paper Account</p>
            <button className="btn btn-blue" onClick={handleAddFunds}>
              Add Deposit
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Funds;
