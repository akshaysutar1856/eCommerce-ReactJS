const Coupon = require("../models/Coupon");

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private/Admin
const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({});
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a coupon
// @route   POST /api/coupons
// @access  Private/Admin
const createCoupon = async (req, res) => {
  try {
    const { code, discount, type, status } = req.body;
    const upperCode = code.toUpperCase();
    const couponExists = await Coupon.findOne({ code: upperCode });

    if (couponExists) {
      return res.status(400).json({ message: "Coupon already exists" });
    }

    const coupon = new Coupon({ code: upperCode, discount, type, status });
    const createdCoupon = await coupon.save();
    res.status(201).json(createdCoupon);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a coupon
// @route   PUT /api/coupons/:id
// @access  Private/Admin
const updateCoupon = async (req, res) => {
  const { code, discount, type, status } = req.body;

  try {
    const coupon = await Coupon.findById(req.params.id);

    if (coupon) {
      coupon.code = code ? code.toUpperCase() : coupon.code;
      coupon.discount = discount || coupon.discount;
      coupon.type = type || coupon.type;
      coupon.status = status || coupon.status;

      const updatedCoupon = await coupon.save();
      res.json(updatedCoupon);
    } else {
      res.status(404).json({ message: "Coupon not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (coupon) {
      await Coupon.deleteOne({ _id: coupon._id });
      res.json({ message: "Coupon removed" });
    } else {
      res.status(404).json({ message: "Coupon not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCoupons, createCoupon, deleteCoupon, updateCoupon };
