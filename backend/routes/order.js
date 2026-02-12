const express = require("express");
const Order = require("../models/Order");

const router = express.Router();

//Create Order
router.post("/", async (req, res) => {
  try {
    const { buyerId, items, totalAmount } = req.body;

    const newOrder = new Order({
      buyerId,
      items,
      totalAmount,
    });

    await newOrder.save();

    res.status(201).json({ message: "Order placed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

//Get All Orders (for testing)
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().populate("buyerId");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

//Get Orders by Buyer
router.get("/buyer/:buyerId", async (req, res) => {
  try {
    const orders = await Order.find({
      buyerId: req.params.buyerId,
    }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
// 🔥 Update Order Status
router.put("/:orderId/status", async (req, res) => {
  try {
    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status },
      { new: true }
    );

    res.json(updatedOrder);
  } catch (error) {
    console.log("Update Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
