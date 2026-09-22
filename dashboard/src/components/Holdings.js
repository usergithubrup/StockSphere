import React, { useState, useEffect } from "react";
import axios from "axios";
import { VerticalGraph } from "./VerticalGraph";

const Holdings = () => {
  const [allHoldings, setAllHoldings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const API_URL = process.env.REACT_APP_API_URL || "https://stocksphere-phnk.onrender.com";
    axios
      .get(`${API_URL}/allHoldings`, { withCredentials: true })
      .then((res) => {
        if (Array.isArray(res.data)) {
          setAllHoldings(res.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching holdings:", err);
        setLoading(false);
      });
  }, []);

  const totalInvestment = allHoldings.reduce(
    (acc, stock) => acc + stock.avg * stock.qty,
    0
  );
  const currentValue = allHoldings.reduce(
    (acc, stock) => acc + stock.price * stock.qty,
    0
  );
  const totalPnL = currentValue - totalInvestment;
  const pnlPercent =
    totalInvestment > 0
      ? ((totalPnL / totalInvestment) * 100).toFixed(2)
      : "0.00";

  const labels = allHoldings.map((stock) => stock.name);

  const data = {
    labels,
    datasets: [
      {
        label: "Stock Price",
        data: allHoldings.map((stock) => stock.price),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  if (loading) {
    return <div className="p-4">Loading holdings...</div>;
  }

  return (
    <>
      <h3 className="title">Holdings ({allHoldings.length})</h3>

      <div className="order-table table-responsive">
        <table>
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg. cost</th>
              <th>LTP</th>
              <th>Cur. val</th>
              <th>P&L</th>
              <th>Net chg.</th>
              <th>Day chg.</th>
            </tr>
          </thead>
          <tbody>
            {allHoldings.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: "center", padding: "20px" }}>
                  No holdings found. Buy stocks from the Watchlist to build your portfolio!
                </td>
              </tr>
            ) : (
              allHoldings.map((stock, index) => {
                const curValue = stock.price * stock.qty;
                const pnl = curValue - stock.avg * stock.qty;
                const isProfit = pnl >= 0;
                const profClass = isProfit ? "profit" : "loss";

                return (
                  <tr key={index}>
                    <td>{stock.name}</td>
                    <td>{stock.qty}</td>
                    <td>₹{Number(stock.avg).toFixed(2)}</td>
                    <td>₹{Number(stock.price).toFixed(2)}</td>
                    <td>₹{curValue.toFixed(2)}</td>
                    <td className={profClass}>
                      {isProfit ? "+" : ""}
                      {pnl.toFixed(2)}
                    </td>
                    <td className={profClass}>{stock.net || "+0.00%"}</td>
                    <td className={stock.isLoss ? "loss" : "profit"}>
                      {stock.day || "+0.00%"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="row">
        <div className="col">
          <h5>₹{totalInvestment.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</h5>
          <p>Total investment</p>
        </div>
        <div className="col">
          <h5>₹{currentValue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</h5>
          <p>Current value</p>
        </div>
        <div className="col">
          <h5 className={totalPnL >= 0 ? "profit" : "loss"}>
            {totalPnL >= 0 ? "+" : ""}
            ₹{totalPnL.toFixed(2)} ({totalPnL >= 0 ? "+" : ""}
            {pnlPercent}%)
          </h5>
          <p>P&L</p>
        </div>
      </div>
      {allHoldings.length > 0 && <VerticalGraph data={data} />}
    </>
  );
};

export default Holdings;
