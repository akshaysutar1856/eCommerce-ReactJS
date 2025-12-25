import React from "react";
import AdminLayout from "../../components/AdminLayout";

const ReviewManagement = () => {
  const reviews = [
    {
      id: 1,
      product: "Wireless Headphones",
      user: "John Doe",
      rating: 5,
      comment: "Great sound quality!",
      status: "Pending",
    },
    {
      id: 2,
      product: "Running Shoes",
      user: "Jane Smith",
      rating: 4,
      comment: "Comfortable but size runs small.",
      status: "Approved",
    },
  ];

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Customer Reviews
      </h1>
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-gray-900">{review.product}</h3>
                <div className="flex items-center mt-1">
                  <span className="text-yellow-400">
                    {"★".repeat(review.rating)}
                  </span>
                  <span className="text-gray-400 text-sm ml-2">
                    by {review.user}
                  </span>
                </div>
                <p className="text-gray-600 mt-2">{review.comment}</p>
              </div>
              <div className="flex space-x-2">
                <button className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm hover:bg-green-200">
                  Approve
                </button>
                <button className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm hover:bg-red-200">
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
};

export default ReviewManagement;
