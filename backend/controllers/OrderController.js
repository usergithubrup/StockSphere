const { HoldingsModel } = require("../model/HoldingsModel");
const { PositionsModel } = require("../model/PositionsModel");
const { OrdersModel } = require("../model/OrdersModel");
const { UserModel } = require("../model/UserModel");

// Place a new order (BUY or SELL)
module.exports.newOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, qty, price, mode } = req.body;

    const parsedQty = Number(qty);
    const parsedPrice = Number(price);

    if (!name || isNaN(parsedQty) || parsedQty <= 0 || isNaN(parsedPrice) || parsedPrice <= 0 || !mode) {
      return res.status(400).json({ success: false, message: "Invalid order parameters" });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const totalAmount = parsedQty * parsedPrice;

    if (mode === "BUY") {
      if (user.balance < totalAmount) {
        return res.status(400).json({
          success: false,
          message: `Insufficient funds. Required: ₹${totalAmount.toFixed(2)}, Available: ₹${user.balance.toFixed(2)}`,
        });
      }

      // Deduct balance
      user.balance -= totalAmount;
      await user.save();

      // Check if holding exists for this user and stock
      let existingHolding = await HoldingsModel.findOne({ userId, name });

      if (existingHolding) {
        const newQty = existingHolding.qty + parsedQty;
        const newAvg = ((existingHolding.qty * existingHolding.avg) + (parsedQty * parsedPrice)) / newQty;
        existingHolding.qty = newQty;
        existingHolding.avg = newAvg;
        existingHolding.price = parsedPrice;
        await existingHolding.save();
      } else {
        await HoldingsModel.create({
          userId,
          name,
          qty: parsedQty,
          avg: parsedPrice,
          price: parsedPrice,
          net: "+0.00%",
          day: "+0.00%",
        });
      }
    } else if (mode === "SELL") {
      let existingHolding = await HoldingsModel.findOne({ userId, name });

      if (!existingHolding || existingHolding.qty < parsedQty) {
        return res.status(400).json({
          success: false,
          message: `Insufficient shares to sell. You own: ${existingHolding ? existingHolding.qty : 0} shares`,
        });
      }

      // Add balance back
      user.balance += totalAmount;
      await user.save();

      if (existingHolding.qty === parsedQty) {
        await HoldingsModel.deleteOne({ _id: existingHolding._id });
      } else {
        existingHolding.qty -= parsedQty;
        existingHolding.price = parsedPrice;
        await existingHolding.save();
      }
    } else {
      return res.status(400).json({ success: false, message: "Invalid order mode" });
    }

    // Record order in database
    const order = await OrdersModel.create({
      userId,
      name,
      qty: parsedQty,
      price: parsedPrice,
      mode,
      status: "EXECUTED",
    });

    return res.status(201).json({
      success: true,
      message: `Order ${mode} executed successfully!`,
      order,
      balance: user.balance,
    });
  } catch (error) {
    console.error("Error placing order:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Fetch user-specific holdings
module.exports.getHoldings = async (req, res) => {
  try {
    const holdings = await HoldingsModel.find({ userId: req.userId });
    return res.json(holdings);
  } catch (error) {
    console.error("Error fetching holdings:", error);
    return res.status(500).json({ success: false, message: "Error fetching holdings" });
  }
};

// Fetch user-specific positions
module.exports.getPositions = async (req, res) => {
  try {
    const positions = await PositionsModel.find({ userId: req.userId });
    return res.json(positions);
  } catch (error) {
    console.error("Error fetching positions:", error);
    return res.status(500).json({ success: false, message: "Error fetching positions" });
  }
};

// Fetch user-specific orders
module.exports.getOrders = async (req, res) => {
  try {
    const orders = await OrdersModel.find({ userId: req.userId }).sort({ createdAt: -1 });
    return res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ success: false, message: "Error fetching orders" });
  }
};

// Fetch user profile & virtual balance
module.exports.getUserProfile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    return res.json({
      success: true,
      username: user.username,
      email: user.email,
      balance: user.balance,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({ success: false, message: "Error fetching user profile" });
  }
};

// Add funds to user account (Virtual Cash deposit)
module.exports.addFunds = async (req, res) => {
  try {
    const { amount } = req.body;
    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid amount" });
    }

    const user = await UserModel.findById(req.userId);
    user.balance += parsedAmount;
    await user.save();

    return res.json({
      success: true,
      message: `₹${parsedAmount.toLocaleString("en-IN")} added successfully!`,
      balance: user.balance,
    });
  } catch (error) {
    console.error("Error adding funds:", error);
    return res.status(500).json({ success: false, message: "Error adding funds" });
  }
};
