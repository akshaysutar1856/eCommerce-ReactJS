import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const [email, setEmail] = useState("");
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const fetchBanners = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/banners");
        const data = await res.json();
        const activeBanners = data.filter(
          (banner) => banner.status === "Active"
        );
        setBanners(activeBanners);
      } catch (error) {
        console.error("Error fetching banners:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/categories");
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchProducts();
    fetchBanners();
    fetchCategories();
  }, []);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    alert(`Subscribed with ${email}`);
    setEmail("");
  };

  const handleAddToCart = async (product) => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo) {
      navigate("/login");
    } else if (userInfo.role === "admin") {
      alert("Admins cannot add items to cart.");
      return;
    } else {
      try {
        const res = await fetch("http://localhost:5000/api/cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
          body: JSON.stringify({ productId: product._id, quantity: 1 }),
        });
        if (res.ok) alert(`Added ${product.name} to cart!`);
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    }
  };

  // 3. Reviews Data
  const reviews = [
    {
      id: 1,
      user: "Alice M.",
      rating: 5,
      text: "Absolutely love the quality! Fast shipping too.",
      image: "https://via.placeholder.com/50",
    },
    {
      id: 2,
      user: "David K.",
      rating: 4,
      text: "Great fit, true to size. Will buy again.",
      image: "https://via.placeholder.com/50",
    },
    {
      id: 3,
      user: "Sarah J.",
      rating: 5,
      text: "Customer service was super helpful with my return.",
      image: "https://via.placeholder.com/50",
    },
  ];

  return (
    <div className="bg-white min-h-screen font-sans text-gray-800">
      {/* 1. Announcement Bar */}
      <div className="bg-gray-900 text-white text-center py-2 text-sm font-medium tracking-wide">
        Winter Sale: 20% Off - Use Code WINTER20 | Free Shipping on orders over
        ₹500
      </div>

      {/* 2. Hero Section */}
      <div className="relative bg-gray-100">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover"
            src={
              banners.length > 0
                ? banners[0].imageUrl
                : "https://via.placeholder.com/1600x600?text=Lifestyle+Banner"
            }
            alt="Hero Banner"
          />
          <div className="absolute inset-0 bg-gray-900 opacity-40"></div>
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Sustainable Style for Every Body
          </h1>
          <p className="mt-6 text-xl text-gray-200 max-w-3xl mx-auto">
            Discover our new collection of eco-friendly apparel designed for
            comfort and durability.
          </p>
          <div className="mt-10">
            <a
              href="#trending"
              className="inline-block bg-white border border-transparent rounded-md py-3 px-8 text-base font-medium text-indigo-600 hover:bg-gray-50 md:text-lg transition duration-300 shadow-lg"
            >
              Shop Now
            </a>
          </div>
        </div>
      </div>

      {/* 3. Product Discovery - Category Clusters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="group flex flex-col items-center cursor-pointer"
            >
              <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-transparent group-hover:border-indigo-600 transition duration-300">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
              </div>
              <span className="mt-4 text-lg font-medium text-gray-700 group-hover:text-indigo-600">
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Trending / New Arrivals */}
      <div id="trending" className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Featured Products
            </h2>
            <Link
              to="/products"
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              View All &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.length > 0 ? (
              products.map((product) => (
                <div
                  key={product._id}
                  className="group bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-xl transition duration-300 relative"
                >
                  <div className="relative aspect-w-1 aspect-h-1">
                    <Link to={`/product/${product._id}`}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-64 object-cover object-center"
                      />
                    </Link>
                    {product.tag && (
                      <span className="absolute top-2 left-2 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded">
                        {product.tag}
                      </span>
                    )}
                    {/* Quick View Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition duration-300 flex items-end justify-center pb-4 pointer-events-none">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="bg-white text-gray-900 px-6 py-2 rounded-full font-bold shadow-lg opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-indigo-600 hover:text-white pointer-events-auto"
                      >
                        Quick Add
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900 truncate">
                      <Link to={`/product/${product._id}`}>{product.name}</Link>
                    </h3>
                    <p className="text-gray-500 mt-1">₹{product.price}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">
                No products found. (Try visiting /api/products/seed to populate
                data)
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 5. Personalized Feeds (Mock) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Recommended for You
        </h2>
        <div className="bg-indigo-50 rounded-xl p-8 flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0">
            <h3 className="text-xl font-bold text-indigo-900">
              Complete Your Look
            </h3>
            <p className="text-indigo-700 mt-2">
              Based on your recent views, we think you'll love these
              accessories.
            </p>
          </div>
          <button className="bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700 transition shadow-md">
            View Recommendations
          </button>
        </div>
      </div>

      {/* 6. Trust & Social Proof */}
      <div className="bg-white py-16 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Trust Badges */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mb-16">
            <div className="flex flex-col items-center">
              <div className="bg-green-100 p-4 rounded-full mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-lg font-bold">Secure Payment</h3>
              <p className="text-gray-500 text-sm">
                100% secure payment with SSL
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                  ></path>
                </svg>
              </div>
              <h3 className="text-lg font-bold">Free Shipping</h3>
              <p className="text-gray-500 text-sm">On all orders over ₹500</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-purple-100 p-4 rounded-full mb-4">
                <svg
                  className="w-8 h-8 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  ></path>
                </svg>
              </div>
              <h3 className="text-lg font-bold">Easy Returns</h3>
              <p className="text-gray-500 text-sm">
                30-day money back guarantee
              </p>
            </div>
          </div>

          {/* Customer Reviews */}
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            What Our Customers Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-gray-50 p-6 rounded-lg shadow-sm"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={review.image}
                    alt={review.user}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <h4 className="font-bold text-sm">{review.user}</h4>
                    <div className="text-yellow-400 text-xs">
                      {"★".repeat(review.rating)}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{review.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 7. Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Newsletter */}
            <div className="col-span-1 md:col-span-1">
              <h3 className="text-lg font-bold mb-4">Stay in the Loop</h3>
              <p className="text-gray-400 text-sm mb-4">
                Join our list for 10% off your first order.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-gray-800 text-white px-4 py-2 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
                >
                  Subscribe
                </button>
              </form>
            </div>

            {/* Links Columns */}
            <div>
              <h3 className="text-lg font-bold mb-4">Shop</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a href="#" className="hover:text-white">
                    New Arrivals
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Best Sellers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Sale
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a href="#" className="hover:text-white">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Shipping & Returns
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Order Tracking
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a href="#" className="hover:text-white">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Terms of Service
                  </a>
                </li>
              </ul>
              <div className="mt-6 flex space-x-4">
                {/* Social Icons (Mock) */}
                <div className="w-6 h-6 bg-gray-700 rounded-full hover:bg-indigo-600 cursor-pointer"></div>
                <div className="w-6 h-6 bg-gray-700 rounded-full hover:bg-indigo-600 cursor-pointer"></div>
                <div className="w-6 h-6 bg-gray-700 rounded-full hover:bg-indigo-600 cursor-pointer"></div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
            <p>&copy; 2023 Ecommerce Store. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
