import React, { useState, useEffect } from "react";
import axios from "axios";
import Dashboard from "./Dashboard";
import TopBar from "./TopBar";

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const API_URL = process.env.REACT_APP_API_URL || "https://stocksphere-phnk.onrender.com";
    axios
      .get(`${API_URL}/userProfile`, { withCredentials: true })
      .then((res) => {
        if (res.data && res.data.username) {
          setIsAuthenticated(true);
        } else {
          window.location.href = "http://localhost:3000/login";
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        window.location.href = "http://localhost:3000/login";
      });
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "1.2rem",
          color: "#666",
        }}
      >
        Checking authentication... Redirecting to login if not logged in.
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <TopBar />
      <Dashboard />
    </>
  );
};

export default Home;
