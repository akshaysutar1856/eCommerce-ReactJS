const express = require("express");
const {
  getProducts,
  getTrendingProducts,
  seedProducts,
  createProduct,
  deleteProduct,
  getProductById,
  updateProduct,
} = require("../controllers/productController");

const router = express.Router();

router.get("/", getProducts);
router.post("/", createProduct);
router.get("/trending", getTrendingProducts);
router.get("/seed", seedProducts); // Visit /api/products/seed to populate DB
router.get("/:id", getProductById);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
