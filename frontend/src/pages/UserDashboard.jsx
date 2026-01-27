import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserLayout from "./UserLayout";

const UserDashboard = () => {
  const [userProfile, setUserProfile] = useState({});
  const [orders, setOrders] = useState([]);
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    if (userInfo) {
      fetchDashboardData();
    }
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch User Profile
      const profileRes = await fetch(
        "http://localhost:5000/api/users/profile",
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        },
      );
      const profileData = await profileRes.json();
      setUserProfile(profileData);

      // Fetch User Orders
      const ordersRes = await fetch(
        "http://localhost:5000/api/orders/myorders",
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        },
      );
      const ordersData = await ordersRes.json();
      setOrders(ordersData);

      // Fetch Addresses to find default
      const addressRes = await fetch("http://localhost:5000/api/addresses", {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      const addressData = await addressRes.json();
      const defAddr =
        addressData.find((addr) => addr.isDefault) || addressData[0];
      setDefaultAddress(defAddr);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <UserLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-gray-500">Loading Dashboard...</div>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 capitalize">
              Welcome back, {userProfile.name || userInfo.name}!
            </h1>
            <p className="text-gray-500 mt-2 max-w-2xl">
              From your account dashboard you can view your recent orders,
              manage your shipping and billing addresses, and edit your password
              and account details.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Start Shopping
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Orders */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4 hover:shadow-md transition-shadow">
            <div className="p-3 bg-indigo-50 rounded-full text-indigo-600">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">
                {orders.length}
              </p>
            </div>
          </div>

          {/* Pending Orders */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4 hover:shadow-md transition-shadow">
            <div className="p-3 bg-yellow-50 rounded-full text-yellow-600">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Pending Orders
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {orders.filter((o) => !o.isDelivered).length}
              </p>
            </div>
          </div>

          {/* Wallet Balance */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4 hover:shadow-md transition-shadow">
            <div className="p-3 bg-green-50 rounded-full text-green-600">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Wallet Balance
              </p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{userProfile.walletBalance || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Recent Activity / Quick Links */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders Preview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
              <Link
                to="/user/orders"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                View All
              </Link>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {orders.slice(0, 3).map((order) => (
                  <div
                    key={order._id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="bg-white p-2 rounded border border-gray-200">
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Order #{order._id.substring(0, 8)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.isDelivered
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.isDelivered ? "Delivered" : "Processing"}
                    </span>
                  </div>
                ))}
                {orders.length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    No recent orders found.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Account Details Preview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">
                Account Details
              </h3>
              <Link
                to="/user/profile"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                Edit
              </Link>
            </div>
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xl">
                  {userProfile.name
                    ? userProfile.name.charAt(0).toUpperCase()
                    : "U"}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 capitalize">
                    {userProfile.name}
                  </p>
                  <p className="text-sm text-gray-500">{userProfile.email}</p>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-4">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Default Address
                </h4>
                {defaultAddress ? (
                  <>
                    <p className="text-sm text-gray-600">
                      {defaultAddress.street}
                    </p>
                    <p className="text-sm text-gray-600">
                      {defaultAddress.city}, {defaultAddress.state}{" "}
                      {defaultAddress.postalCode}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-gray-400">No address set</p>
                )}
                <Link
                  to="/user/addresses"
                  className="text-sm text-indigo-600 hover:text-indigo-500 mt-2 inline-block"
                >
                  Manage Addresses
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default UserDashboard;
