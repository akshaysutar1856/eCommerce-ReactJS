const Order = require("../models/Order");
const User = require("../models/User");

// @desc    Get dashboard stats
// @route   GET /api/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    // Total Sales
    const totalSalesData = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);
    const totalSales = totalSalesData.length > 0 ? totalSalesData[0].total : 0;

    // Daily Orders (Orders created today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dailyOrders = await Order.countDocuments({
      createdAt: { $gte: today },
    });

    // Total Users
    const totalUsers = await User.countDocuments({});

    res.json({ totalSales, dailyOrders, totalUsers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats };
