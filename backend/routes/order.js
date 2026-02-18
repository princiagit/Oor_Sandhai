const express = require("express");
const Order = require("../models/Order");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

//Create Order
router.post("/", authMiddleware, async (req, res) => {
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
router.get("/", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find().populate("buyerId");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

//Get Orders by Buyer
router.get("/buyer/:buyerId", authMiddleware, async (req, res) => {
  try {
    //ROLE CHECK
    if (req.user.role !== "buyer" || req.user.id !== req.params.buyerId) {
      return res.status(403).json({ message: "Access denied" });
    }

    const orders = await Order.find({
      buyerId: req.params.buyerId,
    }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// Update Order Status
router.put("/:id/status", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // 🔥 ROLE-BASED AUTHORIZATION LOGIC

    // Only Seller can Confirm order
    if (status === "Confirmed" && req.user.role !== "seller") {
      return res.status(403).json({ message: "Only seller can confirm orders" });
    }

    // Only Delivery can mark Out for Delivery or Delivered
    if (
      (status === "Out for Delivery" || status === "Delivered") &&
      req.user.role !== "delivery"
    ) {
      return res.status(403).json({ message: "Only delivery partner can update delivery status" });
    }

    order.status = status;
    await order.save();

    res.json(order);

  } catch (error) {
    console.log("Update Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Cancel Order (Buyer Only)
router.put("/:id/cancel", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Only buyer can cancel
    if (req.user.role !== "buyer") {
      return res.status(403).json({ message: "Only buyer can cancel orders" });
    }

    // Buyer can cancel only their own order
    if (req.user.id !== order.buyerId.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Only if order is Pending
    if (order.status !== "Pending") {
      return res.status(400).json({
        message: "Order cannot be cancelled after confirmation"
      });
    }

    order.status = "Cancelled";
    await order.save();

    res.json({ message: "Order cancelled successfully", order });

  } catch (error) {
    console.log("Cancel Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
