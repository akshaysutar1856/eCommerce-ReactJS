const Cart = require("../models/Cart");
const Product = require("../models/Product");

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "cartItems.product",
      "countInStock"
    );
    if (cart) {
      // Filter out items where the product may have been deleted
      const validItems = cart.cartItems.filter((item) => item.product);
      res.json(validItems);
    } else {
      res.json([]);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
      // Cart exists for user
      const itemIndex = cart.cartItems.findIndex(
        (p) => p.product.toString() === productId
      );

      if (itemIndex > -1) {
        // Product exists in cart, update quantity
        let productItem = cart.cartItems[itemIndex];
        const newQuantity = productItem.quantity + (quantity || 1);
        if (newQuantity > product.countInStock) {
          return res
            .status(400)
            .json({ message: "Cannot add more than available stock" });
        }
        productItem.quantity = newQuantity;
        cart.cartItems[itemIndex] = productItem;
      } else {
        // Product does not exist in cart, add new item
        if ((quantity || 1) > product.countInStock) {
          return res
            .status(400)
            .json({ message: "Cannot add more than available stock" });
        }
        cart.cartItems.push({
          product: productId,
          name: product.name,
          quantity: quantity || 1,
          price: product.price,
          image: product.image,
        });
      }
      cart = await cart.save();
      await cart.populate("cartItems.product", "countInStock");
      res.status(200).json(cart.cartItems);
    } else {
      // No cart for user, create new cart
      if ((quantity || 1) > product.countInStock) {
        return res
          .status(400)
          .json({ message: "Cannot add more than available stock" });
      }
      const newCart = await Cart.create({
        user: req.user._id,
        cartItems: [
          {
            product: productId,
            name: product.name,
            quantity: quantity || 1,
            price: product.price,
            image: product.image,
          },
        ],
      });
      await newCart.populate("cartItems.product", "countInStock");
      res.status(201).json(newCart.cartItems);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:id
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.cartItems = cart.cartItems.filter(
        (item) => item.product.toString() !== req.params.id
      );
      await cart.save();
      await cart.populate("cartItems.product", "countInStock");
      res.json(cart.cartItems);
    } else {
      res.status(404).json({ message: "Cart not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:id
// @access  Private
const updateCartItemQuantity = async (req, res) => {
  const { quantity } = req.body;
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (quantity > product.countInStock) {
      return res
        .status(400)
        .json({ message: "Quantity cannot exceed available stock" });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      const itemIndex = cart.cartItems.findIndex(
        (p) => p.product.toString() === req.params.id
      );
      if (itemIndex > -1) {
        if (quantity < 1)
          return res
            .status(400)
            .json({ message: "Quantity must be at least 1" });
        cart.cartItems[itemIndex].quantity = quantity;
        await cart.save();
        await cart.populate("cartItems.product", "countInStock");
        res.json(cart.cartItems);
      } else {
        res.status(404).json({ message: "Item not found in cart" });
      }
    } else {
      res.status(404).json({ message: "Cart not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCart, addToCart, removeFromCart, updateCartItemQuantity };
