const express = require("express");
const Product = require("../models/Product");
const authMiddleware = require("../middleware/authMiddleware");

const multer = require("multer");
const path = require("path");

const router = express.Router();

/*MULTER CONFIGURATION */

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

/*GET ALL PRODUCTS (Public)*/
// PUBLIC - Get all products
router.get("/", async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
});

// SELLER - Get only their products
router.get("/my-products", authMiddleware, async (req, res) => {
  const products = await Product.find({
    sellerId: req.user.id,
  }).sort({ createdAt: -1 });

  res.json(products);
});


/*ADD PRODUCT (Seller Only) */

router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      if (req.user.role !== "seller") {
        return res
          .status(403)
          .json({ message: "Only sellers can add products" });
      }

      const { name, price, category, description } = req.body;

      const newProduct = new Product({
        name,
        price,
        category,
        description,
        image: req.file ? req.file.filename : null,
        sellerId: req.user.id,
      });

      await newProduct.save();

      res.status(201).json(newProduct);
    } catch (error) {
      console.log("Add Product Error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/*DELETE PRODUCT (Owner Only)*/

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "seller") {
      return res
        .status(403)
        .json({ message: "Only sellers can delete products" });
    }

    // Clean & Safe Ownership Check
    const product = await Product.findOne({
      _id: req.params.id,
      sellerId: req.user.id,
    });


    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found or not authorized" });
    }

    await product.deleteOne();

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log("Delete Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;