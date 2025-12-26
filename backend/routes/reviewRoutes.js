const express = require("express");
const router = express.Router();
const Review = require("../models/Review");

// Get all reviews
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update review status (Approve/Reject)
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(updatedReview);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
