require('dotenv').config();

const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require("cookie-parser");

const authRoute = require("./routes/AuthRoute");
const { protectRoute } = require("./middlewares/AuthMiddleware");
const {
  newOrder,
  getHoldings,
  getPositions,
  getOrders,
  getUserProfile,
  addFunds,
} = require("./controllers/OrderController");

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/stocksphere_db";

const app = express();

app.use(
  cors({
    origin: function (origin, callback) {
      if (
        !origin ||
        origin.includes("localhost") ||
        origin.includes("vercel.app") ||
        origin.includes("onrender.com")
      ) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

// Root Health Check Route
app.get("/", (req, res) => {
  res.json({ message: "StockSphere Backend API is Running Live!", status: "OK" });
});

// Auth routes (/signup, /login, /userVerification)
app.use("/", authRoute);

// Stock Watchlist Live Mock Price Engine
const initialWatchlist = [
  { name: "INFY", price: 1555.45, percent: "+1.25%", isDown: false },
  { name: "ONGC", price: 234.10, percent: "-0.65%", isDown: true },
  { name: "TCS", price: 3890.00, percent: "+0.45%", isDown: false },
  { name: "KPITTECH", price: 1340.50, percent: "-1.10%", isDown: true },
  { name: "QUICKHEAL", price: 420.75, percent: "+2.15%", isDown: false },
  { name: "WIPRO", price: 480.20, percent: "-0.30%", isDown: true },
  { name: "M&M", price: 2750.00, percent: "+1.80%", isDown: false },
  { name: "RELIANCE", price: 2890.60, percent: "+0.95%", isDown: false },
  { name: "HDFCBANK", price: 1640.30, percent: "-0.40%", isDown: true },
];

let liveWatchlist = JSON.parse(JSON.stringify(initialWatchlist));

// Background price ticker service (fluctuates prices every 3 seconds)
setInterval(() => {
  liveWatchlist = liveWatchlist.map((stock) => {
    const deltaPercent = (Math.random() * 0.6 - 0.3) / 100; // -0.3% to +0.3%
    let newPrice = stock.price * (1 + deltaPercent);
    newPrice = Math.round(newPrice * 100) / 100;
    const isDown = deltaPercent < 0;
    const percentStr = `${isDown ? "" : "+"}${(deltaPercent * 100).toFixed(2)}%`;
    return {
      ...stock,
      price: newPrice,
      percent: percentStr,
      isDown,
    };
  });
}, 3000);

app.get("/watchlist", (req, res) => {
  res.json(liveWatchlist);
});

// Protected Trading Routes
app.get("/allHoldings", protectRoute, getHoldings);
app.get("/allPositions", protectRoute, getPositions);
app.get("/allOrders", protectRoute, getOrders);
app.post("/newOrder", protectRoute, newOrder);
app.get("/userProfile", protectRoute, getUserProfile);
app.post("/addFunds", protectRoute, addFunds);

app.listen(PORT, () => {
  console.log("Backend server running on port " + PORT);
  if (typeof uri === "string" && uri.startsWith("mongodb")) {
    mongoose
      .connect(uri)
      .then(() => console.log("MongoDB Connected Successfully!"))
      .catch((err) => console.error("MongoDB Connection Error:", err.message));
  } else {
    console.log("MONGO_URL not provided or invalid string. Using local fallback.");
    mongoose
      .connect("mongodb://127.0.0.1:27017/stocksphere_db")
      .then(() => console.log("MongoDB Connected to local fallback!"))
      .catch((err) => console.error("MongoDB Local Connection Error:", err.message));
  }
});