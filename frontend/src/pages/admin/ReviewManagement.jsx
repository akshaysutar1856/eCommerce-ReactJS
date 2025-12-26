import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/AdminLayout";

const ReviewManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch reviews from backend
  const fetchReviews = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/reviews");
      const data = await response.json();
      setReviews(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Handle Status Update
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/reviews/${id}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      if (response.ok) {
        // Update local state to reflect change
        setReviews(
          reviews.map((r) => (r._id === id ? { ...r, status: newStatus } : r))
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Customer Reviews
      </h1>
      {loading ? (
        <p>Loading reviews...</p>
      ) : (
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-gray-500">No reviews found.</p>
          ) : (
            reviews.map((review) => (
              <div
                key={review._id}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900">
                      {review.product}
                    </h3>
                    <div className="flex items-center mt-1">
                      <span className="text-yellow-400">
                        {"★".repeat(review.rating)}
                      </span>
                      <span className="text-gray-400 text-sm ml-2">
                        by {review.user}
                      </span>
                      <span
                        className={`ml-3 text-xs px-2 py-1 rounded ${
                          review.status === "Approved"
                            ? "bg-green-100 text-green-800"
                            : review.status === "Rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {review.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-2">{review.comment}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleStatusUpdate(review._id, "Approved")}
                      className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm hover:bg-green-200"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(review._id, "Rejected")}
                      className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm hover:bg-red-200"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </AdminLayout>
  );
};

export default ReviewManagement;
