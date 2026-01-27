const Transaction = require("../models/Transaction");

// @desc    Get user transactions
// @route   GET /api/transactions
// @access  Private
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTransactions };
