import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import axios from "axios";
import "./index.css";
import Home from "./components/Home";

const getFrontendLoginUrl = () => {
  if (process.env.REACT_APP_FRONTEND_URL) {
    return `${process.env.REACT_APP_FRONTEND_URL}/login`;
  }
  return window.location.hostname === "localhost"
    ? "http://localhost:3000/login"
    : "https://stocksphere-frontend-one.vercel.app/login";
};

// Global Axios Interceptor to catch 401 Unauthorized errors and redirect to Login
axios.interceptors.response.use(
  (response) => {
    if (response.data && response.data.status === false) {
      window.location.href = getFrontendLoginUrl();
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      alert("Session expired or unauthorized. Please log in first.");
      window.location.href = getFrontendLoginUrl();
    }
    return Promise.reject(error);
  }
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);