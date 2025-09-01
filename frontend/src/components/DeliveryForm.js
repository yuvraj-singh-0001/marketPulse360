import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Truck,
  CheckCircle,
  XCircle,
  User,
  Package,
  List,
} from "lucide-react";

function Delivery() {
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    delivery_address: "",
    product_name: "",
    quantity: 1,
    delivery_date: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [deliveries, setDeliveries] = useState([]);
  const [view, setView] = useState("form"); // "form" | "track"

  // Fetch orders on load
  useEffect(() => {
    fetchDeliveries();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Submit new order
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setSuccess(false);

    try {
      const response = await fetch("http://localhost:5000/deliveries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Delivery order created successfully!");
        setSuccess(true);

        setFormData({
          customer_name: "",
          customer_email: "",
          customer_phone: "",
          delivery_address: "",
          product_name: "",
          quantity: 1,
          delivery_date: "",
        });

        fetchDeliveries(); // refresh table
      } else {
        setMessage(`❌ ${data.message || "Failed to create delivery order"}`);
        setSuccess(false);
      }
    } catch (error) {
      console.error("Error creating delivery:", error);
      setMessage("❌ Network error. Please check if server is running");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  // Fetch deliveries
  const fetchDeliveries = async () => {
    try {
      const response = await fetch("http://localhost:5000/deliveries");
      const data = await response.json();
      setDeliveries(data);
    } catch (error) {
      console.error("Error fetching deliveries:", error);
      setMessage("❌ Failed to load delivery orders");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center bg-white/20 rounded-lg px-6 py-3 shadow">
          <h1 className="text-2xl font-bold text-gray-800">Manage Your Orders</h1>
          <div className="flex gap-3">
            <button
              onClick={() => setView("form")}
              className={`px-4 py-2 rounded-lg font-medium ${
                view === "form"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Create Order
            </button>
            <button
              onClick={() => setView("track")}
              className={`px-4 py-2 rounded-lg font-medium ${
                view === "track"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Track Orders
            </button>
          </div>
        </div>

        {/* Create Order Form */}
        {view === "form" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-xl"
          >
            <div className="flex items-center gap-2 mb-4">
              <Truck size={22} className="text-blue-600" />
              <h2 className="text-xl font-bold text-gray-800">
                Create Delivery Order
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Info */}
                <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                  <div className="flex items-center gap-2 mb-4">
                    <User size={18} className="text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-800">
                      Customer Information
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <input
                      type="text"
                      name="customer_name"
                      value={formData.customer_name}
                      onChange={handleChange}
                      placeholder="Full Name"
                      required
                      className="w-full p-3 text-sm border rounded-lg"
                    />
                    <input
                      type="email"
                      name="customer_email"
                      value={formData.customer_email}
                      onChange={handleChange}
                      placeholder="Email"
                      required
                      className="w-full p-3 text-sm border rounded-lg"
                    />
                    <input
                      type="tel"
                      name="customer_phone"
                      value={formData.customer_phone}
                      onChange={handleChange}
                      placeholder="Phone"
                      required
                      className="w-full p-3 text-sm border rounded-lg"
                    />
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                  <div className="flex items-center gap-2 mb-4">
                    <Package size={18} className="text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-800">
                      Delivery Details
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <input
                      type="text"
                      name="product_name"
                      value={formData.product_name}
                      onChange={handleChange}
                      placeholder="Product Name"
                      required
                      className="w-full p-3 text-sm border rounded-lg"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        min="1"
                        required
                        className="w-full p-3 text-sm border rounded-lg"
                      />
                      <input
                        type="date"
                        name="delivery_date"
                        value={formData.delivery_date}
                        onChange={handleChange}
                        required
                        className="w-full p-3 text-sm border rounded-lg"
                      />
                    </div>
                    <textarea
                      name="delivery_address"
                      value={formData.delivery_address}
                      onChange={handleChange}
                      placeholder="Delivery Address"
                      rows="3"
                      required
                      className="w-full p-3 text-sm border rounded-lg resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-4">
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className="w-full max-w-md px-6 py-3 bg-blue-600 text-white font-medium rounded-lg transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 text-base hover:bg-blue-700"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Creating Order...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={18} />
                      Create Delivery Order
                    </>
                  )}
                </motion.button>
              </div>

              {message && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-lg border text-sm flex items-center gap-2 mt-3"
                  style={{
                    backgroundColor: success
                      ? "rgba(34, 197, 94, 0.1)"
                      : "rgba(239, 68, 68, 0.1)",
                    borderColor: success
                      ? "rgba(34, 197, 94, 0.3)"
                      : "rgba(239, 68, 68, 0.3)",
                    color: success ? "rgb(34, 197, 94)" : "rgb(239, 68, 68)",
                  }}
                >
                  {success ? (
                    <CheckCircle size={16} className="text-green-500" />
                  ) : (
                    <XCircle size={16} className="text-red-500" />
                  )}
                  <span>{message}</span>
                </motion.div>
              )}
            </form>
          </motion.div>
        )}

        {/* Orders Table */}
        {view === "track" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-xl"
          >
            <div className="flex items-center gap-2 mb-4">
              <List size={22} className="text-blue-600" />
              <h2 className="text-xl font-bold text-gray-800">
                Delivery Orders ({deliveries.length})
              </h2>
            </div>

            {deliveries.length === 0 ? (
              <p className="text-gray-600">No delivery orders yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-800">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-4 py-2">Customer</th>
                      <th className="px-4 py-2">Product</th>
                      <th className="px-4 py-2">Quantity</th>
                      <th className="px-4 py-2">Delivery Date</th>
                      <th className="px-4 py-2">Address</th>
                      <th className="px-4 py-2">Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deliveries.map((delivery) => (
                      <tr
                        key={delivery.id}
                        className="border-b border-gray-300 hover:bg-gray-100"
                      >
                        <td className="px-4 py-2">
                          {delivery.customer_name}
                        </td>
                        <td className="px-4 py-2">
                          {delivery.product_name}
                        </td>
                        <td className="px-4 py-2">{delivery.quantity}</td>
                        <td className="px-4 py-2">
                          {formatDate(delivery.delivery_date)}
                        </td>
                        <td className="px-4 py-2">
                          {delivery.delivery_address}
                        </td>
                        <td className="px-4 py-2">
                          {formatDate(delivery.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Delivery;
