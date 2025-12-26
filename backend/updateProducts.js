const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");

dotenv.config();

const updateImages = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ecommerce"
    );
    console.log("Connected to MongoDB");

    const products = await Product.find();

    for (const product of products) {
      // If images array is empty or has fewer than 5 images, populate/pad it
      if (!product.images || product.images.length < 5) {
        const updatedImages = product.images ? [...product.images] : [];

        // Ensure at least one image exists
        if (updatedImages.length === 0) updatedImages.push(product.image);

        // Pad with the main image until we have 5
        while (updatedImages.length < 5) {
          updatedImages.push("");
        }

        product.images = updatedImages;
        await product.save();
        console.log(`Updated images for: ${product.name}`);
      }
    }

    console.log("Database update complete.");
    process.exit();
  } catch (error) {
    console.error("Error updating products:", error);
    process.exit(1);
  }
};

updateImages();
