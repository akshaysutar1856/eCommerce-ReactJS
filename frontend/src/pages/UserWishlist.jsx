import React from "react";
import UserLayout from "./UserLayout";

const UserWishlist = () => {
  const wishlistItems = [
    {
      id: 1,
      name: "Wireless Headphones",
      price: "₹199.00",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 2,
      name: "Smart Watch Series 5",
      price: "₹299.00",
      image: "https://via.placeholder.com/150",
    },
  ];

  return (
    <UserLayout>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">My Wishlist</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <div
              key={item.id}
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
                <p className="text-indigo-600 font-bold mt-1">{item.price}</p>
                <div className="mt-4 flex space-x-2">
                  <button className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded text-sm hover:bg-indigo-700 transition-colors">
                    Add to Cart
                  </button>
                  <button className="p-2 text-red-500 hover:bg-red-50 rounded border border-red-200">
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
          ))}
        </div>
      </div>
    </UserLayout>
  );
};

export default UserWishlist;
