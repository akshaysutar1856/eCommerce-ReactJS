const express = require("express");
const {
  getCoupons,
  createCoupon,
  deleteCoupon,
} = require("../controllers/couponController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

router
  .route("/")
  .get(protect, admin, getCoupons)
  .post(protect, admin, createCoupon);
router.route("/:id").delete(protect, admin, deleteCoupon);

module.exports = router;
