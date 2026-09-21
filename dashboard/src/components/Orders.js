import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const API_URL = process.env.REACT_APP_API_URL || "https://stocksphere-phnk.onrender.com";
    axios
      .get(`${API_URL}/allOrders`, { withCredentials: true })
      .then((res) => {
        if (Array.isArray(res.data)) {
          setOrders(res.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-4">Loading order history...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="orders">
        <div className="no-orders">
          <p>You haven't placed any orders yet today.</p>
          <Link to="/" className="btn">
            Get started
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <h3 className="title">Orders ({orders.length})</h3>
      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Type</th>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => {
              const isBuy = order.mode === "BUY";
              const timeStr = order.createdAt
                ? new Date(order.createdAt).toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })
                : "Just now";

              return (
                <tr key={index}>
                  <td>{timeStr}</td>
                  <td>
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: "4px",
                        color: "#fff",
                        backgroundColor: isBuy ? "#4184f3" : "#ff5722",
                        fontSize: "0.8rem",
                        fontWeight: "bold",
                      }}
                    >
                      {order.mode}
                    </span>
                  </td>
                  <td>{order.name}</td>
                  <td>{order.qty}</td>
                  <td>₹{Number(order.price).toFixed(2)}</td>
                  <td>
                    <span style={{ color: "#28a745", fontWeight: "bold" }}>
                      {order.status || "EXECUTED"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Orders;
