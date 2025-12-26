const express = require("express");
const router = express.Router();

// Placeholder for analytics routes
router.get("/", (req, res) => {
  res.status(200).json({ message: "Analytics routes are working" });
});

module.exports = router;
