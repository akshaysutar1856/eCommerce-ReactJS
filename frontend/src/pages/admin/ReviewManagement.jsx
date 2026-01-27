import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/AdminLayout";

const ReviewManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  // Fetch reviews from backend
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/reviews", {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setReviews(data);
      } else {
        alert(data.message || "Failed to fetch reviews");
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      alert("Error fetching reviews.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [userInfo?.token]);

  // Handle Status Update
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/reviews/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo?.token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchReviews();
      } else {
        const data = await res.json();
        alert(data.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating review status:", error);
      alert("Error updating review status.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        const res = await fetch(`http://localhost:5000/api/reviews/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${userInfo?.token}`,
          },
        });
        if (res.ok) {
          fetchReviews();
        } else {
          const data = await res.json();
          alert(data.message || "Failed to delete review");
        }
      } catch (error) {
        console.error("Error deleting review:", error);
        alert("Error deleting review.");
      }
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
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div>
                    <h3 className="font-bold text-gray-900">
                      {review.product?.name || "Product Not Found"}
                    </h3>
                    <div className="flex items-center mt-1">
                      <span className="text-yellow-400">
                        {"★".repeat(review.rating)}
                      </span>
                      <span className="text-gray-400 text-sm ml-2">
                        by {review.user?.name || "User Not Found"}
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
                  <div className="flex flex-shrink-0 space-x-2">
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
                    <button
                      onClick={() => handleDelete(review._id)}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-200"
                    >
                      Delete
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
