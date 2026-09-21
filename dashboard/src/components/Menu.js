import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Menu = () => {
  const [selectedMenu, setSelectedMenu] = useState(0);
  const [username, setUsername] = useState("USER");
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const API_URL = process.env.REACT_APP_API_URL || "https://stocksphere-phnk.onrender.com";
    axios
      .get(`${API_URL}/userProfile`, { withCredentials: true })
      .then((res) => {
        if (res.data && res.data.username) {
          setUsername(res.data.username);
        }
      })
      .catch((err) => console.log("Profile load error:", err));
  }, []);

  const handleMenuClick = (index) => {
    setSelectedMenu(index);
  };

  const handleLogout = async () => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || "https://stocksphere-phnk.onrender.com";
      await axios.post(
        `${API_URL}/logout`,
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.log("Logout error:", err);
    }
    // Redirect to login on main site
    window.location.href = "http://localhost:3000/login";
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.slice(0, 2).toUpperCase();
  };

  const menuClass = "menu";
  const activeMenuClass = "menu selected";

  return (
    <div className="menu-container">
      <img src="logo.png" style={{ width: "35px", height: "35px" }} alt="Logo" />
      <div className="menus">
        <ul>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/"
              onClick={() => handleMenuClick(0)}
            >
              <p className={selectedMenu === 0 ? activeMenuClass : menuClass}>
                Dashboard
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/orders"
              onClick={() => handleMenuClick(1)}
            >
              <p className={selectedMenu === 1 ? activeMenuClass : menuClass}>
                Orders
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/holdings"
              onClick={() => handleMenuClick(2)}
            >
              <p className={selectedMenu === 2 ? activeMenuClass : menuClass}>
                Holdings
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/positions"
              onClick={() => handleMenuClick(3)}
            >
              <p className={selectedMenu === 3 ? activeMenuClass : menuClass}>
                Positions
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/funds"
              onClick={() => handleMenuClick(4)}
            >
              <p className={selectedMenu === 4 ? activeMenuClass : menuClass}>
                Funds
              </p>
            </Link>
          </li>
          <li>
            <a style={{ textDecoration: "none" }} href="http://localhost:3000">
              <p className={menuClass}>Home</p>
            </a>
          </li>
        </ul>
        <hr />
        <div
          className="profile"
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
          }}
          onClick={() => setShowProfileMenu(!showProfileMenu)}
        >
          <div className="avatar" style={{ backgroundColor: "#387ed1", color: "#fff" }}>
            {getInitials(username)}
          </div>
          <p className="username">{username.toUpperCase()}</p>

          {showProfileMenu && (
            <div
              style={{
                position: "absolute",
                top: "45px",
                right: "0",
                backgroundColor: "#fff",
                border: "1px solid #e0e0e0",
                borderRadius: "4px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                padding: "8px 0",
                zIndex: 1000,
                minWidth: "120px",
              }}
            >
              <button
                onClick={handleLogout}
                style={{
                  width: "100%",
                  padding: "8px 16px",
                  border: "none",
                  backgroundColor: "transparent",
                  textAlign: "left",
                  cursor: "pointer",
                  color: "#ff5722",
                  fontWeight: "bold",
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;
