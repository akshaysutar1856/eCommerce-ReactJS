import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProceedToCheckout from "../components/ProceedToCheckout";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [usePoints, setUsePoints] = useState(false);

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
      return;
    }
    fetchCart();
  }, [userInfo, navigate]);

  const fetchCart = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/cart", {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setCartItems(data);
      } else {
        console.error("Failed to fetch cart", data.message);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    const item = cartItems.find((i) => i.product._id === productId);
    if (item && newQuantity > item.product.countInStock) {
      alert("Cannot add more than available stock.");
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/cart/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });
      const data = await res.json();
      if (res.ok) {
        setCartItems(data);
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const removeItem = async (productId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/cart/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      const data = await res.json();
      setCartItems(data);
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const discount = subtotal * 0.1; // 10% Member Discount
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal - discount + shipping;
  const pointsEarned = Math.floor(total / 10);

  // Mock data for "Saved for Later"
  const savedForLater = [
    {
      id: 101,
      name: "Leather Wallet",
      price: 1200,
      image: "https://via.placeholder.com/150",
      inStock: true,
    },
  ];

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <div className="text-gray-600">
            Signed in as{" "}
            <span className="font-semibold text-indigo-600">
              {userInfo?.name}
            </span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items List */}
          <div className="flex-1">
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <li
                    key={item.product._id}
                    className="p-6 flex flex-col sm:flex-row"
                  >
                    <div className="flex-shrink-0 w-full sm:w-24 h-24 mb-4 sm:mb-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1 sm:ml-6 flex flex-col justify-between">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            <Link to={`/product/${item.product}`}>
                              {item.name}
                            </Link>
                          </h3>
                          {/* Inventory Alert */}
                          {item.product && item.product.countInStock < 5 && (
                            <p className="text-xs text-red-600 font-semibold mt-1">
                              ⚠️ Only {item.product.countInStock} left!
                            </p>
                          )}
                        </div>
                        <p className="text-lg font-medium text-gray-900">
                          ₹{item.price.toLocaleString()}
                        </p>
                      </div>

                      {/* Editable Attributes (Mock) */}
                      <div className="mt-2 flex space-x-4">
                        <select className="block w-24 pl-3 pr-10 py-1 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                          <option>Size: M</option>
                          <option>Size: L</option>
                        </select>
                        <select className="block w-24 pl-3 pr-10 py-1 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                          <option>Blue</option>
                          <option>Black</option>
                        </select>
                      </div>

                      <div className="mt-4 flex justify-between items-center">
                        <div className="flex items-center border border-gray-300 rounded-md">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product._id,
                                item.quantity - 1
                              )
                            }
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 text-gray-900 font-medium border-l border-r border-gray-300">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product._id,
                                item.quantity + 1
                              )
                            }
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={
                              !item.product ||
                              item.quantity >= item.product.countInStock
                            }
                          >
                            +
                          </button>
                        </div>
                        <div className="flex space-x-4">
                          <button className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                            Save for Later
                          </button>
                          <button
                            onClick={() => removeItem(item.product._id)}
                            className="text-sm font-medium text-red-600 hover:text-red-500"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Saved for Later Section */}
            <div className="mt-12">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Saved for Later
              </h2>
              <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                <ul className="divide-y divide-gray-200">
                  {savedForLater.map((item) => (
                    <li key={item.id} className="p-6 flex items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="ml-4 flex-1">
                        <h3 className="text-sm font-medium text-gray-900">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          ₹{item.price.toLocaleString()}
                        </p>
                      </div>
                      <button className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                        Move to Cart
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <ProceedToCheckout
            cartItems={cartItems}
            subtotal={subtotal}
            discount={discount}
            shipping={shipping}
            total={total}
          />
        </div>
      </div>
    </div>
  );
};

export default Cart;
