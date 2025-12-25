import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="text-2xl font-bold text-indigo-600 tracking-tight hover:text-indigo-500 transition duration-300"
            >
              Ecommerce
            </Link>
          </div>
          <nav>
            <ul className="flex items-center space-x-8">
              {userInfo && userInfo.role === "admin" && (
                <li>
                  <Link
                    to="/admin/dashboard"
                    className="text-gray-600 hover:text-indigo-600 font-medium transition duration-300"
                  >
                    Admin Panel
                  </Link>
                </li>
              )}
              {userInfo && userInfo.role !== "admin" && (
                <li>
                  <Link
                    to="/user/dashboard"
                    className="text-gray-600 hover:text-indigo-600 font-medium transition duration-300"
                  >
                    My Account
                  </Link>
                </li>
              )}
              {userInfo && userInfo.role !== "admin" && (
                <li>
                  <Link
                    to="/cart"
                    className="text-gray-600 hover:text-indigo-600 font-medium transition duration-300"
                  >
                    Cart
                  </Link>
                </li>
              )}
              <li>
                {userInfo ? (
                  <button
                    onClick={handleLogout}
                    className="bg-indigo-600 text-white px-5 py-2.5 rounded-full font-medium hover:bg-indigo-700 transition duration-300 shadow-md hover:shadow-lg cursor-pointer"
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="bg-indigo-600 text-white px-5 py-2.5 rounded-full font-medium hover:bg-indigo-700 transition duration-300 shadow-md hover:shadow-lg"
                  >
                    Sign In
                  </Link>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
