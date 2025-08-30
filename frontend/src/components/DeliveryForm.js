import React, { useState } from "react";
import { motion } from "framer-motion";
import { Truck, CheckCircle, XCircle, Calendar, MapPin, Phone, User, Mail, Package, Info } from 'lucide-react';

function Delivery() {
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    delivery_address: '',
    product_name: '',
    quantity: 1,
    delivery_date: '',
    special_instructions: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setSuccess(false);

    try {
      const response = await fetch('http://localhost:5000/deliveries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('✅ Delivery order created successfully!');
        setSuccess(true);
        
        // Reset form
        setFormData({
          customer_name: '',
          customer_email: '',
          customer_phone: '',
          delivery_address: '',
          product_name: '',
          quantity: 1,
          delivery_date: '',
          special_instructions: ''
        });

        // Clear success message after 3 seconds
        setTimeout(() => {
          setMessage('');
          setSuccess(false);
        }, 3000);

      } else {
        setMessage(`❌ ${data.message || 'Failed to create delivery order'}`);
        setSuccess(false);
      }
    } catch (error) {
      console.error('Error creating delivery:', error);
      setMessage('❌ Network error. Please check your connection and try again.');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        
      </motion.div>

      {/* Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-4xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full mb-4"
          >
            <Truck size={32} className="text-white" />
          </motion.div>
          <h2 className="text-2xl font-semibold text-white">📦 Create New Delivery Order</h2>
          <p className="text-gray-300">Fill in the details to schedule a delivery</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Information */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
              <User size={20} />
              Customer Information
            </h3>
          </div>

          <div>
            <label className="block text-gray-200 font-medium mb-2 flex items-center gap-2">
              <User size={16} />
              Customer Name *
            </label>
            <input
              type="text"
              name="customer_name"
              value={formData.customer_name}
              onChange={handleChange}
              required
              placeholder="Enter full name"
              className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-gray-200 font-medium mb-2 flex items-center gap-2">
              <Mail size={16} />
              Email Address *
            </label>
            <input
              type="email"
              name="customer_email"
              value={formData.customer_email}
              onChange={handleChange}
              required
              placeholder="customer@email.com"
              className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-gray-200 font-medium mb-2 flex items-center gap-2">
              <Phone size={16} />
              Phone Number *
            </label>
            <input
              type="tel"
              name="customer_phone"
              value={formData.customer_phone}
              onChange={handleChange}
              required
              placeholder="+1 234 567 8900"
              className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-gray-200 font-medium mb-2 flex items-center gap-2">
              <Calendar size={16} />
              Delivery Date *
            </label>
            <input
              type="date"
              name="delivery_date"
              value={formData.delivery_date}
              onChange={handleChange}
              required
              className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
          </div>

          {/* Delivery Details */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
              <Package size={20} />
              Delivery Details
            </h3>
          </div>

          <div>
            <label className="block text-gray-200 font-medium mb-2">
              Product Name *
            </label>
            <input
              type="text"
              name="product_name"
              value={formData.product_name}
              onChange={handleChange}
              required
              placeholder="Enter product name"
              className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-gray-200 font-medium mb-2">
              Quantity *
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
              required
              className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-200 font-medium mb-2 flex items-center gap-2">
              <MapPin size={16} />
              Delivery Address *
            </label>
            <textarea
              name="delivery_address"
              value={formData.delivery_address}
              onChange={handleChange}
              required
              rows="3"
              placeholder="Enter complete delivery address"
              className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              disabled={loading}
            ></textarea>
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-200 font-medium mb-2 flex items-center gap-2">
              <Info size={16} />
              Special Instructions
            </label>
            <textarea
              name="special_instructions"
              value={formData.special_instructions}
              onChange={handleChange}
              rows="3"
              placeholder="Any special instructions for delivery..."
              className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              disabled={loading}
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 flex justify-end">
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition duration-200 shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Creating Order...
                </>
              ) : (
                <>
                  <CheckCircle size={20} />
                  Create Delivery Order
                </>
              )}
            </motion.button>
          </div>

          {/* Message */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`md:col-span-2 p-4 rounded-lg border ${
                success 
                  ? 'bg-green-500/10 border-green-500/30 text-green-200' 
                  : 'bg-red-500/10 border-red-500/30 text-red-200'
              } flex items-center gap-3`}
            >
              {success ? (
                <CheckCircle size={20} className="text-green-400" />
              ) : (
                <XCircle size={20} className="text-red-400" />
              )}
              <span>{message}</span>
            </motion.div>
          )}
        </form>
      </motion.div>

      {/* Success Toast Notification */}
      {success && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50"
        >
          <div className="flex items-center gap-2">
            <CheckCircle size={20} />
            <span>Delivery order created successfully!</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default Delivery;