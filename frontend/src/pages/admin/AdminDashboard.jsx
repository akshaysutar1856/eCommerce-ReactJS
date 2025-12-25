import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    dailyOrders: 0,
    totalUsers: 0,
  });
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/dashboard", {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Dashboard Overview
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-indigo-500">
          <div className="text-gray-500 text-sm font-medium uppercase">
            Total Sales
          </div>
          <div className="mt-2 text-3xl font-bold text-gray-900">
            ₹{stats.totalSales.toLocaleString()}
          </div>
          <p className="text-green-500 text-sm mt-1">↑ 12% from last week</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
          <div className="text-gray-500 text-sm font-medium uppercase">
            Daily Orders
          </div>
          <div className="mt-2 text-3xl font-bold text-gray-900">
            {stats.dailyOrders}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-500">
          <div className="text-gray-500 text-sm font-medium uppercase">
            Total Users
          </div>
          <div className="mt-2 text-3xl font-bold text-gray-900">
            {stats.totalUsers}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm h-96 flex items-center justify-center border border-gray-200">
        <p className="text-gray-400 text-lg">
          Sales Chart Visualization Placeholder
        </p>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
