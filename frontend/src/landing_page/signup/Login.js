import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
  });

  const { email, password } = inputValue;

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const API_URL = process.env.REACT_APP_API_URL || "https://stocksphere-phnk.onrender.com";
      const { data } = await axios.post(
        `${API_URL}/login`,
        { ...inputValue },
        { withCredentials: true }
      );
      const { success, message } = data;
      if (success) {
        toast.success(message, { position: "bottom-right" });
        setTimeout(() => {
          const dashboardUrl = process.env.REACT_APP_DASHBOARD_URL || 
            (window.location.hostname === "localhost" ? "http://localhost:3001" : "https://stocksphere-dashboard.vercel.app");
          window.location.href = dashboardUrl;
        }, 1000);
      } else {
        toast.error(message || "Invalid credentials", { position: "bottom-left" });
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong during login", { position: "bottom-left" });
    }
  };

  return (
    <div className="container p-5 my-5">
      <div className="row text-center justify-content-center">
        <div className="col-6 p-4 border rounded shadow-sm">
          <h2 className="mb-4 text-muted">Log In to Your Account</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3 text-start">
              <label className="form-label">Email address</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={email}
                placeholder="Enter your email"
                onChange={handleOnChange}
                required
              />
            </div>
            <div className="mb-3 text-start">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={password}
                placeholder="Enter your password"
                onChange={handleOnChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100 fs-5 mt-3">
              Log In
            </button>
          </form>
          <div className="mt-3 text-center">
            <p className="text-muted">
              Don't have an account? <Link to="/signup">Sign Up</Link>
            </p>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Login;
