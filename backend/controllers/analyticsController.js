const Order = require("../models/Order");
const Product = require("../models/Product");

// @desc    Get analytics data
// @route   GET /api/analytics
// @access  Private/Admin
const getAnalytics = async (req, res) => {
  try {
    // Sales Performance (Last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const salesData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalSales: { $sum: "$totalPrice" },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Inventory Status (Low stock)
    const lowStockProducts = await Product.find({ countInStock: { $lt: 10 } })
      .select("name countInStock price")
      .limit(10);

    // Category Distribution
    const categoryDistribution = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      salesData,
      lowStockProducts,
      categoryDistribution,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAnalytics };
