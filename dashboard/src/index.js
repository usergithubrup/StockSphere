import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import axios from "axios";
import "./index.css";
import Home from "./components/Home";

// Global Axios Interceptor 
axios.interceptors.response.use(
  (response) => {
    // If backend returned { status: false } or unauthorized message
    if (response.data && response.data.status === false) {
      window.location.href = "http://localhost:3000/login";
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      alert("Session expired or unauthorized. Please log in first.");
      window.location.href = "http://localhost:3000/login";
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