const { UserModel: User } = require("../model/UserModel");
require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.userVerification = (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ status: false, message: "Token missing" });
  }
  jwt.verify(token, process.env.TOKEN_KEY || "secret_key_12345", async (err, data) => {
    if (err) {
      return res.status(401).json({ status: false, message: "Token invalid or expired" });
    } else {
      const user = await User.findById(data.id);
      if (user) {
        return res.json({
          status: true,
          user: user.username,
          email: user.email,
          balance: user.balance || 100000,
        });
      } else {
        return res.status(401).json({ status: false, message: "User not found" });
      }
    }
  });
};

module.exports.protectRoute = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized: Token missing" });
  }
  jwt.verify(token, process.env.TOKEN_KEY || "secret_key_12345", async (err, data) => {
    if (err) {
      return res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
    }
    const user = await User.findById(data.id);
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }
    req.userId = data.id;
    req.user = user;
    next();
  });
};