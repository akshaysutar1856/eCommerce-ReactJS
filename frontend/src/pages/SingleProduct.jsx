import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const SingleProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
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

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image */}
          <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
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
