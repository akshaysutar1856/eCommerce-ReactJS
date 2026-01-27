import React, { useState, useEffect } from "react";
import UserLayout from "./UserLayout";

const UserWallet = () => {
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    if (userInfo) {
      fetchWalletData();
    }
  }, []);

  const fetchWalletData = async () => {
    try {
      // Fetch Balance (from User Profile)
      const userRes = await fetch("http://localhost:5000/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      const userData = await userRes.json();
      setBalance(userData.walletBalance || 0);

      // Fetch Transactions
      const transRes = await fetch("http://localhost:5000/api/transactions", {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      const transData = await transRes.json();
      setTransactions(transData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching wallet data:", error);
      setLoading(false);
    }
  };

  return (
    <UserLayout>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg p-8 text-white">
          <h2 className="text-lg font-medium opacity-90">Available Balance</h2>
          <div className="text-4xl font-bold mt-2">₹{balance.toFixed(2)}</div>
          <p className="text-sm opacity-75 mt-1">
            Loyalty Points: {Math.floor(balance * 10)} pts
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-800">
              Transaction History
            </h3>
          </div>
          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading...</div>
          ) : (
            <div className="divide-y divide-gray-200">
              {transactions.length > 0 ? (
                transactions.map((t) => (
                  <div
                    key={t._id}
                    className="p-4 flex justify-between items-center hover:bg-gray-50"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {t.description}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(t.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`font-bold ${
                        t.type === "credit" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {t.type === "credit" ? "+" : "-"}₹{t.amount.toFixed(2)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-gray-500">
                  No transactions found.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </UserLayout>
  );
};

export default UserWallet;
