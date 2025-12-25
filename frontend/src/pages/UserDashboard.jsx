import React from "react";
import { Link } from "react-router-dom";
import UserLayout from "./UserLayout";

const UserDashboard = () => {
  return (
    <UserLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-800">Hello, John Doe!</h1>
          <p className="text-gray-600 mt-1">
            From your account dashboard you can view your recent orders, manage
            your shipping and billing addresses, and edit your password and
            account details.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-indigo-600">
            <div className="text-gray-500 text-sm font-medium uppercase">
              Total Orders
            </div>
            <div className="mt-2 text-3xl font-bold text-gray-900">24</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
            <div className="text-gray-500 text-sm font-medium uppercase">
              Pending Orders
            </div>
            <div className="mt-2 text-3xl font-bold text-gray-900">2</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
            <div className="text-gray-500 text-sm font-medium uppercase">
              Wallet Balance
            </div>
            <div className="mt-2 text-3xl font-bold text-gray-900">₹150.00</div>
          </div>
        </div>

        {/* Recent Activity Snippet */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
          </div>
          <div className="p-6">
            <p className="text-gray-500 text-sm mb-4">
              You have no recent orders to display.
            </p>
            <Link
              to="/user/orders"
              className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
            >
              View All Orders &rarr;
            </Link>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default UserDashboard;
