import React, { useState } from "react";
import AdminLayout from "../../components/AdminLayout";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">System Settings</h1>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === "general"
              ? "text-indigo-600 border-b-2 border-indigo-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("general")}
        >
          General
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === "payment"
              ? "text-indigo-600 border-b-2 border-indigo-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("payment")}
        >
          Payment & Shipping
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === "roles"
              ? "text-indigo-600 border-b-2 border-indigo-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("roles")}
        >
          Role Management
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        {activeTab === "general" && <GeneralSettings />}
        {activeTab === "payment" && <PaymentShipping />}
        {activeTab === "roles" && <RoleManagement />}
      </div>
    </AdminLayout>
  );
};

const GeneralSettings = () => (
  <form className="space-y-4 max-w-lg">
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Store Name
      </label>
      <input
        type="text"
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        defaultValue="My Ecommerce Store"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Logo URL
      </label>
      <input
        type="text"
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        placeholder="https://..."
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Currency
      </label>
      <select className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
        <option>USD ($)</option>
        <option>EUR (€)</option>
        <option>INR (₹)</option>
      </select>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Social Links
      </label>
      <div className="space-y-2">
        <input
          type="text"
          className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
          placeholder="Facebook URL"
        />
        <input
          type="text"
          className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
          placeholder="Twitter URL"
        />
        <input
          type="text"
          className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
          placeholder="Instagram URL"
        />
      </div>
    </div>
    <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
      Save Changes
    </button>
  </form>
);

const PaymentShipping = () => (
  <form className="space-y-6 max-w-lg">
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Payment Gateways
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Stripe API Key
          </label>
          <input
            type="password"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            PayPal Client ID
          </label>
          <input
            type="text"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
      </div>
    </div>
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">Shipping</h3>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Flat Rate Shipping Cost
        </label>
        <input
          type="number"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          defaultValue="50"
        />
      </div>
      <div className="mt-2">
        <label className="block text-sm font-medium text-gray-700">
          Free Shipping Threshold
        </label>
        <input
          type="number"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          defaultValue="500"
        />
      </div>
    </div>
    <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
      Save Changes
    </button>
  </form>
);

const RoleManagement = () => (
  <div>
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-medium text-gray-900">Staff Roles</h3>
      <button className="text-sm text-indigo-600 hover:text-indigo-800">
        + Add New Role
      </button>
    </div>
    <table className="min-w-full divide-y divide-gray-200">
      <thead>
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Role
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Permissions
          </th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        <tr>
          <td className="px-6 py-4 text-sm font-medium text-gray-900">Admin</td>
          <td className="px-6 py-4 text-sm text-gray-500">Full Access</td>
          <td className="px-6 py-4 text-right text-sm font-medium text-gray-500">
            Locked
          </td>
        </tr>
        <tr>
          <td className="px-6 py-4 text-sm font-medium text-gray-900">
            Editor
          </td>
          <td className="px-6 py-4 text-sm text-gray-500">
            Products, Categories, Banners
          </td>
          <td className="px-6 py-4 text-right text-sm font-medium">
            <button className="text-indigo-600 hover:text-indigo-900 mr-2">
              Edit
            </button>
            <button className="text-red-600 hover:text-red-900">Delete</button>
          </td>
        </tr>
        <tr>
          <td className="px-6 py-4 text-sm font-medium text-gray-900">
            Support
          </td>
          <td className="px-6 py-4 text-sm text-gray-500">
            Orders, Customers, Reviews
          </td>
          <td className="px-6 py-4 text-right text-sm font-medium">
            <button className="text-indigo-600 hover:text-indigo-900 mr-2">
              Edit
            </button>
            <button className="text-red-600 hover:text-red-900">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default Settings;
