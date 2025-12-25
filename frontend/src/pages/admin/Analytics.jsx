import React from "react";
import AdminLayout from "../../components/AdminLayout";

const Analytics = () => {
  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Reports & Analytics
        </h1>
        <button className="border border-gray-300 bg-white text-gray-700 px-4 py-2 rounded hover:bg-gray-50 transition-colors">
          Export Data (CSV)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm h-80 flex flex-col justify-center items-center border border-gray-200">
          <h3 className="text-gray-700 font-medium mb-4">Sales Performance</h3>
          <div className="text-gray-400">Chart Placeholder</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm h-80 flex flex-col justify-center items-center border border-gray-200">
          <h3 className="text-gray-700 font-medium mb-4">Inventory Turnover</h3>
          <div className="text-gray-400">Chart Placeholder</div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Analytics;
