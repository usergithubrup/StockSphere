import React, { useState, useEffect } from "react";
import axios from "axios";

const Summary = () => {
  const [username, setUsername] = useState("Trader");
  const [balance, setBalance] = useState(100000);
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, holdingsRes] = await Promise.all([
          axios.get("http://localhost:3002/userProfile", { withCredentials: true }),
          axios.get("http://localhost:3002/allHoldings", { withCredentials: true }),
        ]);

        if (userRes.data && userRes.data.username) {
          setUsername(userRes.data.username);
          setBalance(userRes.data.balance || 100000);
        }

        if (Array.isArray(holdingsRes.data)) {
          setHoldings(holdingsRes.data);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error loading summary:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalInvestment = holdings.reduce(
    (acc, stock) => acc + stock.avg * stock.qty,
    0
  );
  const currentValue = holdings.reduce(
    (acc, stock) => acc + stock.price * stock.qty,
    0
  );
  const totalPnL = currentValue - totalInvestment;
  const pnlPercent =
    totalInvestment > 0
      ? ((totalPnL / totalInvestment) * 100).toFixed(2)
      : "0.00";

  const formatAmount = (val) => {
    if (val >= 100000) return `${(val / 1000).toFixed(1)}k`;
    if (val >= 1000) return `${(val / 1000).toFixed(2)}k`;
    return val.toFixed(2);
  };

  if (loading) {
    return <div className="p-4">Loading summary...</div>;
  }

  return (
    <>
      <div className="username">
        <h6>Hi, {username}!</h6>
        <hr className="divider" />
      </div>

      <div className="section">
        <span>
          <p>Equity</p>
        </span>

        <div className="data">
          <div className="first">
            <h3>₹{formatAmount(balance)}</h3>
            <p>Margin available</p>
          </div>
          <hr />

          <div className="second">
            <p>
              Margins used <span>₹{formatAmount(totalInvestment)}</span>{" "}
            </p>
            <p>
              Opening balance <span>₹{formatAmount(balance + totalInvestment)}</span>{" "}
            </p>
          </div>
        </div>
        <hr className="divider" />
      </div>

      <div className="section">
        <span>
          <p>Holdings ({holdings.length})</p>
        </span>

        <div className="data">
          <div className="first">
            <h3 className={totalPnL >= 0 ? "profit" : "loss"}>
              {totalPnL >= 0 ? "+" : ""}
              ₹{formatAmount(totalPnL)}{" "}
              <small>
                ({totalPnL >= 0 ? "+" : ""}
                {pnlPercent}%)
              </small>{" "}
            </h3>
            <p>P&L</p>
          </div>
          <hr />

          <div className="second">
            <p>
              Current Value <span>₹{formatAmount(currentValue)}</span>{" "}
            </p>
            <p>
              Investment <span>₹{formatAmount(totalInvestment)}</span>{" "}
            </p>
          </div>
        </div>
        <hr className="divider" />
      </div>
    </>
  );
};

export default Summary;
