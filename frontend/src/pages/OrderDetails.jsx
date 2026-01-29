import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("UPI");
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${userInfo?.token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setOrder(data);
        } else {
          setError(data.message || "Failed to fetch order details");
        }
      } catch (err) {
        setError("Network error. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (userInfo && id) {
      fetchOrder();
    } else {
      setLoading(false);
      setError("Please log in to view order details.");
    }
  }, [id, userInfo?.token]);

  const handlePayment = async () => {
    if (selectedPaymentMethod === "Cash on Delivery") {
      alert(
        "Payment method set to Cash on Delivery. Please pay upon delivery.",
      );
      setShowPaymentOptions(false);
      return;
    }

    // Simulate payment gateway interaction
    const paymentResult = {
      id: `PAY-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      status: "COMPLETED",
      update_time: new Date().toISOString(),
      email_address: userInfo.email,
      payment_method: selectedPaymentMethod,
    };

    try {
      const res = await fetch(`http://localhost:5000/api/orders/${id}/pay`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo?.token}`,
        },
        body: JSON.stringify(paymentResult),
      });
      const data = await res.json();
      if (res.ok) {
        setOrder(data);
        setShowPaymentOptions(false);
        alert(`Payment via ${selectedPaymentMethod} Successful!`);
      } else {
        alert(data.message || "Payment failed");
      }
    } catch (err) {
      alert("Network error during payment.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-xl text-gray-500">Loading Order Details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-xl text-gray-500">Order not found.</div>
      </div>
    );
  }

  const steps = ["Pending", "Processing", "Out for Delivery", "Delivered"];
  const currentStep = order.orderStatus
    ? steps.indexOf(order.orderStatus)
    : order.isDelivered
      ? 3
      : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Order {order._id}
          </h1>
          <Link
            to="/user/orders"
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            &larr; Back to Orders
          </Link>
        </div>

        {/* Order Status Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between w-full relative">
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 -z-10"></div>
            <div
              className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-indigo-600 -z-10 transition-all duration-500"
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            ></div>
            {steps.map((step, index) => (
              <div
                key={step}
                className="flex flex-col items-center bg-white px-2"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    index <= currentStep
                      ? "border-indigo-600 bg-indigo-600 text-white"
                      : "border-gray-300 bg-white text-gray-400"
                  }`}
                >
                  {index + 1}
                </div>
                <span
                  className={`text-xs mt-2 font-medium ${index <= currentStep ? "text-indigo-600" : "text-gray-500"}`}
                >
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Order Info */}
          <div className="flex-1 space-y-6">
            {/* Shipping */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Shipping
              </h2>
              <p className="text-gray-600 mb-2">
                <strong className="font-medium text-gray-900">Name: </strong>{" "}
                {order.user?.name || userInfo.name}
              </p>
              <p className="text-gray-600 mb-2">
                <strong className="font-medium text-gray-900">Email: </strong>
                <a
                  href={`mailto:${order.user?.email || userInfo.email}`}
                  className="text-indigo-600 hover:underline"
                >
                  {order.user?.email || userInfo.email}
                </a>
              </p>
              <p className="text-gray-600 mb-4">
                <strong className="font-medium text-gray-900">Address: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
                {order.shippingAddress.postalCode},{" "}
                {order.shippingAddress.country}
              </p>
              <div className="mt-4">
                <h3 className="font-medium text-gray-900 mb-2">Status:</h3>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    order.orderStatus === "Delivered" || order.isDelivered
                      ? "bg-green-100 text-green-800"
                      : order.orderStatus === "Out for Delivery"
                        ? "bg-indigo-100 text-indigo-800"
                        : order.orderStatus === "Processing"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {order.orderStatus ||
                    (order.isDelivered ? "Delivered" : "Pending")}
                </span>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Payment Method
              </h2>
              <p className="text-gray-600 mb-4">
                <strong className="font-medium text-gray-900">Method: </strong>{" "}
                {order.paymentMethod}
              </p>
              <div
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  order.isPaid
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {order.isPaid
                  ? `Paid on ${new Date(order.paidAt).toLocaleDateString()}`
                  : "Not Paid"}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Order Items
              </h2>
              {order.orderItems.length === 0 ? (
                <p className="text-gray-500">Order is empty</p>
              ) : (
                <div className="divide-y divide-gray-200">
                  {order.orderItems.map((item, index) => (
                    <div key={index} className="py-4 flex items-center">
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="text-sm font-medium text-gray-900">
                          <Link
                            to={`/product/${item.product}`}
                            className="hover:text-indigo-600"
                          >
                            {item.name}
                          </Link>
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {item.qty} x ₹{item.price} = ₹{item.qty * item.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="w-full lg:w-96">
            <div className="bg-white shadow rounded-lg p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Order Summary
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Items</span>
                  <span>₹{order.itemsPrice}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span>₹{order.shippingPrice}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tax</span>
                  <span>₹{order.taxPrice}</span>
                </div>
                <div className="border-t border-gray-200 pt-4 flex justify-between text-base font-medium text-gray-900">
                  <span>Total</span>
                  <span>₹{order.totalPrice}</span>
                </div>
              </div>

              {/* Pay Now Button Placeholder */}
              {!order.isPaid && (
                <div className="mt-6">
                  {!showPaymentOptions ? (
                    <button
                      onClick={() => setShowPaymentOptions(true)}
                      className="w-full bg-indigo-600 border border-transparent rounded-md py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Pay Now
                    </button>
                  ) : (
                    <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                      <h3 className="font-medium text-gray-900 mb-3">
                        Select Payment Method
                      </h3>
                      <div className="space-y-2 mb-4">
                        {["Cash on Delivery", "UPI", "PayPal"].map((method) => (
                          <label
                            key={method}
                            className="flex items-center space-x-3 cursor-pointer"
                          >
                            <input
                              type="radio"
                              name="paymentMethod"
                              value={method}
                              checked={selectedPaymentMethod === method}
                              onChange={(e) =>
                                setSelectedPaymentMethod(e.target.value)
                              }
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                            />
                            <span className="text-gray-700">{method}</span>
                          </label>
                        ))}
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={handlePayment}
                          className="flex-1 bg-green-600 border border-transparent rounded-md py-2 px-4 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setShowPaymentOptions(false)}
                          className="flex-1 bg-white border border-gray-300 rounded-md py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
