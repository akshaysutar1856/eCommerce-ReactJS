import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/analytics", {
          headers: {
            Authorization: `Bearer ${userInfo?.token}`,
          },
        });
        const data = await res.json();
        setAnalytics(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching analytics:", error);
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [userInfo?.token]);

  const exportToCSV = () => {
    if (!analytics || !analytics.salesData) return;

    const headers = ["Date", "Total Sales", "Order Count"];
    const rows = analytics.salesData.map((item) => [
      item._id,
      item.totalSales,
      item.orderCount,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "sales_analytics.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <AdminLayout>
        <p>Loading analytics...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Reports & Analytics
        </h1>
        <button
          onClick={exportToCSV}
          className="border border-gray-300 bg-white text-gray-700 px-4 py-2 rounded hover:bg-gray-50 transition-colors"
        >
          Export Sales Data (CSV)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Performance */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-gray-700 font-medium mb-4">
            Sales Performance (Last 7 Days)
          </h3>
          {analytics?.salesData?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Date
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Sales
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Orders
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {analytics.salesData.map((item) => (
                    <tr key={item._id}>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {item._id}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        ₹{item.totalSales}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {item.orderCount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-400 text-center py-10">
              No sales data available
            </p>
          )}
        </div>

        {/* Inventory Turnover / Low Stock */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-gray-700 font-medium mb-4">
            Low Stock Alert (Less than 10)
          </h3>
          {analytics?.lowStockProducts?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Product
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Stock
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {analytics.lowStockProducts.map((product) => (
                    <tr key={product._id}>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {product.name}
                      </td>
                      <td className="px-4 py-2 text-sm text-red-600 font-bold">
                        {product.countInStock}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        ₹{product.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-400 text-center py-10">
              No low stock items
            </p>
          )}
        </div>

        {/* Category Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 lg:col-span-2">
          <h3 className="text-gray-700 font-medium mb-4">
            Product Category Distribution
          </h3>
          <div className="flex flex-wrap gap-4">
            {analytics?.categoryDistribution?.map((cat) => (
              <div
                key={cat._id}
                className="bg-indigo-50 text-indigo-700 px-4 py-3 rounded-lg flex flex-col items-center min-w-[120px]"
              >
                <span className="font-bold text-xl">{cat.count}</span>
                <span className="text-sm">{cat._id}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Analytics;
