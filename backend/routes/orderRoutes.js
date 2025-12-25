const express = require("express");
const router = express.Router();
const {
  getOrders,
  updateOrderToDelivered,
} = require("../controllers/orderController");
const { protect, admin } = require("../middleware/authMiddleware");

router.route("/").get(protect, admin, getOrders);
router.route("/:id/deliver").put(protect, admin, updateOrderToDelivered);

module.exports = router;
