import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const SingleProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
        setSelectedImage(data.image);
        setSelectedImageIndex(0);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo) {
      navigate("/login");
    } else if (userInfo.role === "admin") {
      alert("Admins cannot add items to cart.");
      return;
    } else {
      try {
        const res = await fetch("http://localhost:5000/api/cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
          body: JSON.stringify({ productId: product._id, quantity: 1 }),
        });
        if (res.ok) alert(`Added ${product.name} to cart!`);
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!product)
    return <div className="text-center py-20">Product not found</div>;

  // Process images: use product.images if available, filter empty strings, and remove duplicates
  let images =
    product.images && product.images.length > 0
      ? product.images
      : [product.image];
  images = images.filter((img) => img && img.trim() !== "");
  // Deduplicate images to clean up display
  images = [...new Set(images)];

  if (images.length === 0) images = [product.image];

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="flex flex-col">
            <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden mb-4 h-96">
              <img
                src={selectedImage || product.image}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div className="grid grid-cols-5 gap-4">
              {images.map((img, index) => (
                <div
                  key={index}
                  className={`aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden cursor-pointer border-2 h-24 ${
                    selectedImageIndex === index
                      ? "border-indigo-600"
                      : "border-transparent"
                  }`}
                  onClick={() => {
                    setSelectedImage(img);
                    setSelectedImageIndex(index);
                  }}
                >
                  <img
                    src={img}
                    alt={`Product ${index}`}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              ))}
            </div>
          </div>
          {/* Details */}
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              {product.name}
            </h1>
            <p className="text-2xl text-indigo-600 mt-4">₹{product.price}</p>
            <div className="mt-4 prose prose-sm text-gray-500">
              <p>{product.description}</p>
            </div>
            <div className="mt-6">
              <p className="text-sm text-gray-500">
                Category: {product.category}
              </p>
              <p className="text-sm text-gray-500">
                Stock: {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
              </p>
            </div>
            <div className="mt-8">
              <button
                onClick={handleAddToCart}
                disabled={product.countInStock === 0}
                className={`w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  product.countInStock === 0
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                {product.countInStock === 0 ? "Out of Stock" : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
