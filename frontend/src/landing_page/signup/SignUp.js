import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function SignUp() {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
    username: "",
  });

  const { email, password, username } = inputValue;

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
      const { data } = await axios.post(
        "http://localhost:3002/signup",
        { ...inputValue },
        { withCredentials: true }
      );
      const { success, message } = data;
      if (success) {
        toast.success(message, { position: "bottom-right" });
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        toast.error(message, { position: "bottom-left" });
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong", { position: "bottom-left" });
    }
  };

  return (
    <div className="container p-5 my-5">
      <div className="row text-center justify-content-center">
        <div className="col-6 p-4 border rounded shadow-sm">
          <h2 className="mb-4 text-muted">Open Account / Sign Up</h2>
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
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                name="username"
                value={username}
                placeholder="Enter your username"
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
              Submit
            </button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default SignUp;