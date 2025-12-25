const express = require("express");
const {
  getBanners,
  createBanner,
  deleteBanner,
  updateBanner,
} = require("../controllers/bannerController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(getBanners).post(protect, admin, createBanner);
router
  .route("/:id")
  .delete(protect, admin, deleteBanner)
  .put(protect, admin, updateBanner);

module.exports = router;
