import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const UserLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const menuItems = [
    { name: "Dashboard", href: "/user/dashboard" },
    { name: "My Orders", href: "/user/orders" },
    { name: "Wishlist", href: "/user/wishlist" },
    { name: "Manage Profile", href: "/user/profile" },
    { name: "Address Book", href: "/user/addresses" },
    { name: "My Wallet", href: "/user/wallet" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 bg-indigo-600">
                <h2 className="text-white text-lg font-bold">My Account</h2>
              </div>
              <nav className="p-2">
                <ul className="space-y-1">
                  {menuItems.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className={`block px-4 py-2 rounded-md transition-colors ${
                          location.pathname === item.href
                            ? "bg-indigo-50 text-indigo-600 font-medium"
                            : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                        }`}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md transition-colors"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default UserLayout;
