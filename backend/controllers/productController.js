const Product = require("../models/Product");

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch trending products
// @route   GET /api/products/trending
// @access  Public
const getTrendingProducts = async (req, res) => {
  try {
    const products = await Product.find({ isTrending: true }).limit(4);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Seed sample products
// @route   GET /api/products/seed
// @access  Public (for dev/demo purposes)
const seedProducts = async (req, res) => {
  try {
    await Product.deleteMany({});
    const sampleProducts = [
      {
        name: "Classic Leather Jacket",
        image: "https://via.placeholder.com/300?text=Jacket",
        description: "High quality leather jacket.",
        category: "Men",
        price: 4999,
        isTrending: true,
        tag: "New",
      },
      {
        name: "Summer Floral Dress",
        image: "https://via.placeholder.com/300?text=Dress",
        description: "Light and breezy summer dress.",
        category: "Women",
        price: 2499,
        isTrending: true,
        tag: "Trending",
      },
      // Add more sample data as needed
    ];
    const createdProducts = await Product.insertMany(sampleProducts);
    res.json(createdProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      image,
      category,
      countInStock,
      isTrending,
    } = req.body;
    const product = new Product({
      name,
      price,
      description,
      image,
      category,
      countInStock,
      isTrending,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await Product.deleteOne({ _id: product._id });
      res.json({ message: "Product removed" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  const {
    name,
    price,
    description,
    image,
    category,
    countInStock,
    isTrending,
  } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name;
      product.price = price;
      product.description = description;
      product.image = image;
      product.category = category;
      product.countInStock = countInStock;
      product.isTrending = isTrending;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getTrendingProducts,
  seedProducts,
  createProduct,
  deleteProduct,
  getProductById,
  updateProduct,
};
