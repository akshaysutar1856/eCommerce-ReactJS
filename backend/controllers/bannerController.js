const Banner = require("../models/Banner");

// @desc    Get all banners
// @route   GET /api/banners
// @access  Public
const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find({});
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a banner
// @route   POST /api/banners
// @access  Private/Admin
const createBanner = async (req, res) => {
  try {
    const { title, imageUrl, link, status } = req.body;
    const banner = new Banner({ title, imageUrl, link, status });
    const createdBanner = await banner.save();
    res.status(201).json(createdBanner);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a banner
// @route   DELETE /api/banners/:id
// @access  Private/Admin
const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (banner) {
      await Banner.deleteOne({ _id: banner._id });
      res.json({ message: "Banner removed" });
    } else {
      res.status(404).json({ message: "Banner not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a banner
// @route   PUT /api/banners/:id
// @access  Private/Admin
const updateBanner = async (req, res) => {
  const { title, imageUrl, link, status } = req.body;

  try {
    const banner = await Banner.findById(req.params.id);

    if (banner) {
      banner.title = title;
      banner.imageUrl = imageUrl;
      banner.link = link;
      banner.status = status;

      const updatedBanner = await banner.save();
      res.json(updatedBanner);
    } else {
      res.status(404).json({ message: "Banner not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getBanners, createBanner, deleteBanner, updateBanner };
