import React from "react";
import { Link, useLocation } from "react-router-dom";

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Orders", path: "/admin/orders" },
    { name: "Products", path: "/admin/products" },
    { name: "Categories", path: "/admin/categories" },
    { name: "Customers", path: "/admin/customers" },
    { name: "Coupons", path: "/admin/coupons" },
    { name: "Banners", path: "/admin/banners" },
    { name: "Reviews", path: "/admin/reviews" },
    { name: "Analytics", path: "/admin/analytics" },
    { name: "Settings", path: "/admin/settings" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex-shrink-0 hidden md:flex flex-col">
        <div className="p-6 text-xl font-bold border-b border-gray-800 tracking-wider">
          Admin Panel
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul>
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`block px-6 py-3 hover:bg-gray-800 transition-colors ${
                    location.pathname === item.path
                      ? "bg-gray-800 border-l-4 border-indigo-500 text-indigo-400"
                      : "text-gray-300"
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
};

export default AdminLayout;
