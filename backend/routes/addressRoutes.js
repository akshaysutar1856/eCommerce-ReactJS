const express = require("express");
const {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} = require("../controllers/addressController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(protect, getAddresses).post(protect, addAddress);
router.route("/:id").put(protect, updateAddress).delete(protect, deleteAddress);

module.exports = router;
