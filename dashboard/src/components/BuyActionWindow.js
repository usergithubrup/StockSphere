import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import GeneralContext from "./GeneralContext";
import "./BuyActionWindow.css";

const BuyActionWindow = ({ uid, initialPrice = 0, mode = "BUY" }) => {
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(initialPrice || 100);
  const [errorMessage, setErrorMessage] = useState("");

  const { closeBuyWindow } = useContext(GeneralContext);

  useEffect(() => {
    if (initialPrice > 0) {
      setStockPrice(initialPrice);
    }
  }, [initialPrice]);

  const handleOrderClick = async () => {
    setErrorMessage("");
    try {
      const API_URL = process.env.REACT_APP_API_URL || "https://stocksphere-phnk.onrender.com";
      const res = await axios.post(
        `${API_URL}/newOrder`,
        {
          name: uid,
          qty: Number(stockQuantity),
          price: Number(stockPrice),
          mode: mode,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        alert(res.data.message || `Order ${mode} executed!`);
        closeBuyWindow();
        window.location.reload(); // Refresh portfolio data
      } else {
        setErrorMessage(res.data.message || "Failed to execute order");
      }
    } catch (err) {
      console.error("Order error:", err);
      if (err.response?.status === 401) {
        alert("Session expired or unauthorized. Redirecting to login page.");
        const loginUrl = process.env.REACT_APP_FRONTEND_URL ? `${process.env.REACT_APP_FRONTEND_URL}/login` :
          (window.location.hostname === "localhost" ? "http://localhost:3000/login" : "https://stocksphere-frontend-one.vercel.app/login");
        window.location.href = loginUrl;
        return;
      }
      const msg = err.response?.data?.message || "Error submitting order. Please check login session.";
      setErrorMessage(msg);
    }
  };

  const handleCancelClick = () => {
    closeBuyWindow();
  };

  const marginRequired = (Number(stockQuantity) * Number(stockPrice)).toFixed(2);

  return (
    <div className="container" id="buy-window" draggable="true">
      <div className="regular-order">
        <h4 style={{ color: mode === "BUY" ? "#4184f3" : "#ff5722", marginBottom: "15px" }}>
          {mode === "BUY" ? "Buy" : "Sell"} {uid}
        </h4>
        {errorMessage && (
          <div style={{ color: "red", fontSize: "0.85rem", marginBottom: "10px" }}>
            {errorMessage}
          </div>
        )}
        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              name="qty"
              id="qty"
              min="1"
              onChange={(e) => setStockQuantity(e.target.value)}
              value={stockQuantity}
            />
          </fieldset>
          <fieldset>
            <legend>Price (₹)</legend>
            <input
              type="number"
              name="price"
              id="price"
              step="0.05"
              onChange={(e) => setStockPrice(e.target.value)}
              value={stockPrice}
            />
          </fieldset>
        </div>
      </div>

      <div className="buttons">
        <span>Margin required ₹{marginRequired}</span>
        <div>
          <button
            className={`btn ${mode === "BUY" ? "btn-blue" : "btn-orange"}`}
            onClick={handleOrderClick}
            style={{ backgroundColor: mode === "SELL" ? "#ff5722" : undefined }}
          >
            {mode === "BUY" ? "Buy" : "Sell"}
          </button>
          <button className="btn btn-grey" onClick={handleCancelClick}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyActionWindow;
