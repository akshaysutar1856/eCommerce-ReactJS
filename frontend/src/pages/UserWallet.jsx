import React from "react";
import UserLayout from "./UserLayout";

const UserWallet = () => {
  const transactions = [
    {
      id: 1,
      desc: "Refund for Order #ORD-7782",
      date: "Oct 25, 2023",
      amount: "+₹20.00",
      type: "credit",
    },
    {
      id: 2,
      desc: "Purchase Order #ORD-7783",
      date: "Nov 02, 2023",
      amount: "-₹45.50",
      type: "debit",
    },
  ];

  return (
    <UserLayout>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg p-8 text-white">
          <h2 className="text-lg font-medium opacity-90">Available Balance</h2>
          <div className="text-4xl font-bold mt-2">₹150.00</div>
          <p className="text-sm opacity-75 mt-1">Loyalty Points: 450 pts</p>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-800">
              Transaction History
            </h3>
          </div>
          <div className="divide-y divide-gray-200">
            {transactions.map((t) => (
              <div
                key={t.id}
                className="p-4 flex justify-between items-center hover:bg-gray-50"
              >
                <div>
                  <p className="font-medium text-gray-900">{t.desc}</p>
                  <p className="text-sm text-gray-500">{t.date}</p>
                </div>
                <span
                  className={`font-bold ${
                    t.type === "credit" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {t.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default UserWallet;
