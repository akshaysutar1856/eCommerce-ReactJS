import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import UserDashboard from "../pages/UserDashboard";
import Home from "../pages/Home";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import SingleProduct from "../pages/SingleProduct";
import UserOrders from "../pages/UserOrders";
import UserWishlist from "../pages/UserWishlist";
import UserProfile from "../pages/UserProfile";
import UserAddresses from "../pages/UserAddresses";
import UserWallet from "../pages/UserWallet";
import AdminDashboard from "../pages/admin/AdminDashboard";
import OrderManagement from "../pages/admin/OrderManagement";
import ProductManagement from "../pages/admin/ProductManagement";
import CategoryManagement from "../pages/admin/CategoryManagement";
import CustomerManagement from "../pages/admin/CustomerManagement";
import CouponManagement from "../pages/admin/CouponManagement";
import BannerManagement from "../pages/admin/BannerManagement";
import ReviewManagement from "../pages/admin/ReviewManagement";
import Analytics from "../pages/admin/Analytics";
import Settings from "../pages/admin/Settings";
import Navbar from "../components/Navbar";

const ProtectedRoute = ({ children, isAdmin }) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  if (!userInfo) {
    return <Navigate to="/login" />;
  }

  if (isAdmin && userInfo.role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/product/:id" element={<SingleProduct />} />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route path="/checkout" element={<Checkout />} />
        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/orders"
          element={
            <ProtectedRoute>
              <UserOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/wishlist"
          element={
            <ProtectedRoute>
              <UserWishlist />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/addresses"
          element={
            <ProtectedRoute>
              <UserAddresses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/wallet"
          element={
            <ProtectedRoute>
              <UserWallet />
            </ProtectedRoute>
          }
        />

        {/* Admin Panel Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute isAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute isAdmin={true}>
              <OrderManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute isAdmin={true}>
              <ProductManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <ProtectedRoute isAdmin={true}>
              <CategoryManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/customers"
          element={
            <ProtectedRoute isAdmin={true}>
              <CustomerManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/coupons"
          element={
            <ProtectedRoute isAdmin={true}>
              <CouponManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/banners"
          element={
            <ProtectedRoute isAdmin={true}>
              <BannerManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reviews"
          element={
            <ProtectedRoute isAdmin={true}>
              <ReviewManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute isAdmin={true}>
              <Analytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute isAdmin={true}>
              <Settings />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
