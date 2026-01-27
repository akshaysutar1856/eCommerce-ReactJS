import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserLayout from "./UserLayout";

const UserWishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    } else {
      fetchWishlist();
    }
  }, [userInfo, navigate]);

  const fetchWishlist = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/wishlist", {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      const data = await res.json();
      setWishlistItems(data.products || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/wishlist/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        },
      );
      if (res.ok) {
        const data = await res.json();
        setWishlistItems(data.products || []);
      }
    } catch (error) {
      console.error("Error removing from wishlist", error);
    }
  };

  const handleAddToCart = async (product) => {
    try {
      const res = await fetch("http://localhost:5000/api/users/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({ productId: product._id, quantity: 1 }),
      });
      if (res.ok) {
        alert(`Added ${product.name} to cart!`);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  if (loading) {
    return <UserLayout>Loading wishlist...</UserLayout>;
  }

  return (
    <UserLayout>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">My Wishlist</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.length > 0 ? (
            wishlistItems.map((item) => (
              <div
                key={item._id}
                className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900 truncate">
                    {item.name}
                  </h3>
                  <p className="text-indigo-600 font-bold mt-1">
                    ₹{item.price}
                  </p>
                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded text-sm hover:bg-indigo-700 transition-colors"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleRemove(item._id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded border border-red-200"
                    >
                      <span className="sr-only">Remove</span>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">Your wishlist is empty.</p>
          )}
        </div>
      </div>
    </UserLayout>
  );
};

export default UserWishlist;
