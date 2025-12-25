import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const navigate = useNavigate();
  const [shippingAddress, setShippingAddress] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("PayPal");
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("new");
  const [cartItems, setCartItems] = useState(
    JSON.parse(localStorage.getItem("cartItems")) || []
  );

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    if (userInfo) {
      const fetchAddresses = async () => {
        try {
          const res = await fetch("http://localhost:5000/api/addresses", {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          });
          const data = await res.json();
          setSavedAddresses(data);

          // Auto-select default address if available
          const defaultAddr = data.find((addr) => addr.isDefault);
          if (defaultAddr) {
            handleSelectAddress(defaultAddr);
          }
        } catch (error) {
          console.error("Error fetching addresses:", error);
        }
      };

      const fetchCart = async () => {
        try {
          const res = await fetch("http://localhost:5000/api/cart", {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          });
          const data = await res.json();
          if (res.ok) {
            const items = data.cartItems || data;
            if (Array.isArray(items)) setCartItems(items);
          }
        } catch (error) {
          console.error("Error fetching cart:", error);
        }
      };

      fetchAddresses();
      fetchCart();
    }
  }, []);

  const handleSelectAddress = (addr) => {
    setSelectedAddressId(addr._id);
    setShippingAddress({
      address: addr.street,
      city: addr.city,
      postalCode: addr.postalCode,
      country: addr.country,
    });
  };

  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };

  const itemsPrice = addDecimals(
    cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );
  const shippingPrice = addDecimals(
    Number(itemsPrice) > 100 || cartItems.length === 0 ? 0 : 10
  );
  const taxPrice = addDecimals(Number((0.15 * itemsPrice).toFixed(2)));
  const totalPrice = (
    Number(itemsPrice) +
    Number(shippingPrice) +
    Number(taxPrice)
  ).toFixed(2);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!userInfo) {
      navigate("/login");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({
          orderItems: cartItems,
          shippingAddress,
          paymentMethod,
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.removeItem("cartItems");
        navigate(`/order/${data._id}`);
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Error placing order");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Checkout Form */}
          <div className="flex-1">
            <form onSubmit={submitHandler} className="space-y-8">
              {/* Shipping Address */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
                <h2 className="text-xl font-medium text-gray-900 mb-4">
                  Shipping Address
                </h2>

                {savedAddresses.length > 0 && (
                  <div className="mb-6">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {savedAddresses.map((addr) => (
                        <div
                          key={addr._id}
                          onClick={() => handleSelectAddress(addr)}
                          className={`border rounded-lg p-4 cursor-pointer relative ${
                            selectedAddressId === addr._id
                              ? "border-indigo-500 ring-2 ring-indigo-500"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-900">
                              {addr.name}
                            </span>
                            {addr.isDefault && (
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {addr.street}
                          </p>
                          <p className="text-sm text-gray-500">
                            {addr.city}, {addr.postalCode}
                          </p>
                          <p className="text-sm text-gray-500">
                            {addr.country}
                          </p>
                        </div>
                      ))}
                      <div
                        onClick={() => {
                          setSelectedAddressId("new");
                          setShippingAddress({
                            address: "",
                            city: "",
                            postalCode: "",
                            country: "",
                          });
                        }}
                        className={`border rounded-lg p-4 cursor-pointer flex items-center justify-center border-dashed ${
                          selectedAddressId === "new"
                            ? "border-indigo-500 ring-2 ring-indigo-500"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        <span className="text-sm font-medium text-gray-600">
                          + Add New Address
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {(selectedAddressId === "new" ||
                  savedAddresses.length === 0) && (
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-6">
                      <label
                        htmlFor="address"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Address
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          id="address"
                          name="address"
                          value={shippingAddress.address}
                          onChange={(e) =>
                            setShippingAddress({
                              ...shippingAddress,
                              address: e.target.value,
                            })
                          }
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                          required
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="city"
                        className="block text-sm font-medium text-gray-700"
                      >
                        City
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={shippingAddress.city}
                          onChange={(e) =>
                            setShippingAddress({
                              ...shippingAddress,
                              city: e.target.value,
                            })
                          }
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                          required
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="postalCode"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Postal Code
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          id="postalCode"
                          name="postalCode"
                          value={shippingAddress.postalCode}
                          onChange={(e) =>
                            setShippingAddress({
                              ...shippingAddress,
                              postalCode: e.target.value,
                            })
                          }
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                          required
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Country
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          id="country"
                          name="country"
                          value={shippingAddress.country}
                          onChange={(e) =>
                            setShippingAddress({
                              ...shippingAddress,
                              country: e.target.value,
                            })
                          }
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
                <h2 className="text-xl font-medium text-gray-900 mb-4">
                  Payment Method
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      id="paypal"
                      name="paymentMethod"
                      type="radio"
                      value="PayPal"
                      checked={paymentMethod === "PayPal"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                    />
                    <label
                      htmlFor="paypal"
                      className="ml-3 block text-sm font-medium text-gray-700"
                    >
                      PayPal or Credit Card
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="stripe"
                      name="paymentMethod"
                      type="radio"
                      value="Stripe"
                      checked={paymentMethod === "Stripe"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                    />
                    <label
                      htmlFor="stripe"
                      className="ml-3 block text-sm font-medium text-gray-700"
                    >
                      Stripe
                    </label>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Place Order
              </button>
            </form>
          </div>

          <div className="w-full lg:w-96">
            <div className="bg-white shadow-sm rounded-lg p-6 sticky top-24">
              <h2 className="text-lg font-medium text-gray-900 mb-6">
                Order Summary
              </h2>
              {cartItems.length > 0 ? (
                <div className="flow-root">
                  <ul className="-my-4 divide-y divide-gray-200 mb-6">
                    {cartItems.map((item) => (
                      <li key={item.product} className="flex py-4">
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover object-center"
                          />
                        </div>

                        <div className="ml-4 flex flex-1 flex-col">
                          <div>
                            <div className="flex justify-between text-base font-medium text-gray-900">
                              <h3 className="truncate max-w-[150px]">
                                {item.name}
                              </h3>
                              <p className="ml-4">${item.price}</p>
                            </div>
                          </div>
                          <div className="flex flex-1 items-end justify-between text-sm">
                            <p className="text-gray-500">Qty {item.qty}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="border-t border-gray-200 pt-4 space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <p>Subtotal</p>
                      <p>${itemsPrice}</p>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <p>Shipping</p>
                      <p>${shippingPrice}</p>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <p>Tax</p>
                      <p>${taxPrice}</p>
                    </div>
                    <div className="flex justify-between text-base font-medium text-gray-900 border-t border-gray-200 pt-4 mt-4">
                      <p>Total</p>
                      <p>${totalPrice}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Your cart is empty.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
