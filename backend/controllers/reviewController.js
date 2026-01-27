const Review = require("../models/Review");

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Private/Admin
const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({})
      .populate("user", "name")
      .populate("product", "name");
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update review status
// @route   PUT /api/reviews/:id
// @access  Private/Admin
const updateReviewStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const review = await Review.findById(req.params.id);

    if (review) {
      review.status = status;
      const updatedReview = await review.save();
      res.json(updatedReview);
    } else {
      res.status(404).json({ message: "Review not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (review) {
      await Review.deleteOne({ _id: review._id });
      res.json({ message: "Review removed" });
    } else {
      res.status(404).json({ message: "Review not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getReviews,
  updateReviewStatus,
  deleteReview,
};
