import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const UserLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
  const location = useLocation();
  const menuItems = [
    { name: "Dashboard", href: "/user/dashboard" },
    { name: "My Orders", href: "/user/orders" },
    { name: "Wishlist", href: "/user/wishlist" },
    { name: "Manage Profile", href: "/user/profile" },
    { name: "Address Book", href: "/user/addresses" },
    { name: "My Wallet", href: "/user/wallet" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex font-sans relative">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen
            ? "translate-x-0 w-64"
            : "-translate-x-full md:translate-x-0 md:w-0"
        } fixed md:static inset-y-0 left-0 z-30 bg-gray-900 text-white flex-shrink-0 transition-all duration-300 ease-in-out overflow-hidden flex flex-col`}
      >
        <div className="p-6 text-xl font-bold border-b border-gray-800 tracking-wider">
          My Account
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul>
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={`block px-6 py-3 hover:bg-gray-800 transition-colors ${
                    location.pathname === item.href
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
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white shadow-sm h-16 flex items-center px-6">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-gray-600 hover:text-gray-900 focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </header>
        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default UserLayout;
