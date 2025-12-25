import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const ProceedToCheckout = ({
  cartItems,
  subtotal,
  discount,
  shipping,
  total,
}) => {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  // Validation Logic
  const validationError = () => {
    const outOfStockItem = cartItems.find(
      (item) => !item.product || item.quantity > item.product.countInStock
    );
    if (outOfStockItem) return `Item "${outOfStockItem.name}" is out of stock.`;

    const MINIMUM_ORDER_VALUE = 200; // Example: ₹200 minimum
    if (subtotal < MINIMUM_ORDER_VALUE)
      return `A minimum order value of ₹${MINIMUM_ORDER_VALUE} is required.`;

    return null;
  };

  const error = validationError();
  const isCartValid = !error;

  const handleCheckoutClick = () => {
    if (!isCartValid) {
      alert("Please resolve cart errors before proceeding.");
      return;
    }

    if (userInfo) {
      navigate("/checkout"); // Navigate to actual checkout flow
    } else {
      setShowAuthModal(true);
    }
  };

  return (
    <>
      {/* Main Order Summary for Desktop */}
      <div className="hidden lg:block w-full lg:w-96">
        <div className="bg-white shadow-sm rounded-lg p-6 sticky top-24">
          <h2 className="text-lg font-medium text-gray-900 mb-6">
            Order Summary
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between text-base text-gray-600">
              <p>Subtotal</p>
              <p>₹{subtotal.toLocaleString()}</p>
            </div>
            <div className="flex justify-between text-base text-green-600">
              <p>Discount (Member 10%)</p>
              <p>-₹{discount.toLocaleString()}</p>
            </div>
            <div className="flex justify-between text-base text-gray-600">
              <p>Shipping Estimate</p>
              <p>
                {shipping === 0 ? (
                  <span className="text-green-600">Free</span>
                ) : (
                  `₹${shipping}`
                )}
              </p>
            </div>
            <div className="border-t border-gray-200 pt-4 flex justify-between text-lg font-bold text-gray-900">
              <p>Order Total</p>
              <p>₹{total.toLocaleString()}</p>
            </div>
          </div>

          {error && (
            <div className="mt-4 text-sm text-red-600 text-center">{error}</div>
          )}

          <button
            onClick={handleCheckoutClick}
            disabled={!isCartValid}
            className="mt-6 w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Proceed to Checkout
          </button>

          <div className="mt-4 flex justify-center items-center space-x-2 text-gray-500">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 1.944A11.954 11.954 0 012.166 5.026a11.954 11.954 0 01-1.032 3.997A11.954 11.954 0 011 11.954a11.954 11.954 0 011.032 3.997A11.954 11.954 0 012.166 18.98a11.954 11.954 0 013.997 1.032A11.954 11.954 0 0110 21.83a11.954 11.954 0 013.997-1.032A11.954 11.954 0 0117.834 18.98a11.954 11.954 0 011.032-3.997A11.954 11.954 0 0121 11.954a11.954 11.954 0 01-1.032-3.997A11.954 11.954 0 0117.834 5.026a11.954 11.954 0 01-3.997-1.032A11.954 11.954 0 0110 1.944zM8.657 15.657l-3.536-3.536 1.414-1.414L8.657 12.828l7.071-7.071 1.414 1.414-8.485 8.485z"
                clipRule="evenodd"
              ></path>
            </svg>
            <span className="text-xs">Secure SSL Encryption</span>
          </div>
        </div>
      </div>

      {/* Sticky Footer for Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200 shadow-t-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Total:</span>
          <span className="text-xl font-bold text-gray-900">
            ₹{total.toLocaleString()}
          </span>
        </div>
        <button
          onClick={handleCheckoutClick}
          disabled={!isCartValid}
          className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isCartValid ? "Proceed to Checkout" : error}
        </button>
      </div>

      {/* Guest vs. Member Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-sm text-center">
            <h2 className="text-2xl font-bold mb-4">Checkout as</h2>
            <div className="space-y-4">
              <button
                onClick={() => navigate("/checkout?guest=true")}
                className="w-full bg-gray-200 text-gray-800 py-3 rounded-md hover:bg-gray-300 font-semibold"
              >
                Guest Checkout
              </button>
              <Link
                to="/login"
                className="block w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 font-semibold"
              >
                Login
              </Link>
              <p className="text-sm text-gray-500">or</p>
              <Link
                to="/signup"
                className="text-indigo-600 hover:underline font-medium"
              >
                Create an Account
              </Link>
            </div>
            <button
              onClick={() => setShowAuthModal(false)}
              className="mt-6 text-sm text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProceedToCheckout;
