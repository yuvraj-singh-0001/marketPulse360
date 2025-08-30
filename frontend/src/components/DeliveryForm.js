import React, { useState } from "react";
import { motion } from "framer-motion";
import { Truck, CheckCircle, XCircle, List, Plus, ArrowLeft } from 'lucide-react';

function Delivery() {
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    delivery_address: '',
    product_name: '',
    quantity: 1,
    delivery_date: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [view, setView] = useState('create'); // 'create' or 'track'
  const [deliveries, setDeliveries] = useState([]);
  const [trackLoading, setTrackLoading] = useState(false);

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

    if (!formData.customer_name || !formData.customer_email || !formData.customer_phone || 
        !formData.delivery_address || !formData.product_name || !formData.quantity || !formData.delivery_date) {
      setMessage('❌ Please fill in all required fields');
      setLoading(false);
      return;
    }

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
        
        setFormData({
          customer_name: '',
          customer_email: '',
          customer_phone: '',
          delivery_address: '',
          product_name: '',
          quantity: 1,
          delivery_date: ''
        });

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
      setMessage('❌ Network error. Please check if server is running');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchDeliveries = async () => {
    setTrackLoading(true);
    try {
      const response = await fetch('http://localhost:5000/deliveries');
      const data = await response.json();
      setDeliveries(data);
      setView('track');
    } catch (error) {
      console.error('Error fetching deliveries:', error);
      setMessage('❌ Failed to load delivery orders');
    } finally {
      setTrackLoading(false);
    }
  };

  const showCreateForm = () => {
    setView('create');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'processing': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      default: return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 p-5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6 text-center"
      >
        <h1 className="text-2xl font-bold text-white">Delivery Management</h1>
        <p className="text-gray-300 text-base mt-1">
          {view === 'create' ? 'Create new delivery orders' : 'Track your delivery orders'}
        </p>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 mb-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={showCreateForm}
          className={`px-6 py-2 rounded-lg font-medium transition ${
            view === 'create' 
              ? 'bg-blue-600 text-white' 
              : 'bg-white/10 text-gray-300 hover:bg-white/20'
          }`}
        >
          <div className="flex items-center gap-2">
            <Plus size={18} />
            Create Order
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={fetchDeliveries}
          className={`px-6 py-2 rounded-lg font-medium transition ${
            view === 'track' 
              ? 'bg-blue-600 text-white' 
              : 'bg-white/10 text-gray-300 hover:bg-white/20'
          }`}
        >
          <div className="flex items-center gap-2">
            <List size={18} />
            Track Orders
            {trackLoading && (
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
            )}
          </div>
        </motion.button>
      </div>

      {/* Content Area */}
      {view === 'track' ? (
        /* Track Orders View */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-4xl mx-auto bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <List size={24} />
              Delivery Orders ({deliveries.length})
            </h2>
            <button
              onClick={showCreateForm}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition"
            >
              <Plus size={16} />
              New Order
            </button>
          </div>

          {deliveries.length === 0 ? (
            <div className="text-center py-8 text-gray-300">
              <Truck size={48} className="mx-auto mb-4 opacity-50" />
              <p>No delivery orders found</p>
              <p className="text-sm mt-2">Create your first delivery order to get started</p>
              <button
                onClick={showCreateForm}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Create First Order
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {deliveries.map((delivery) => (
                <motion.div
                  key={delivery.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-white/20 transition"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-white text-lg">{delivery.customer_name}</h3>
                      <p className="text-gray-300">{delivery.product_name} × {delivery.quantity}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(delivery.status)}`}>
                      {delivery.status.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-400">📧 {delivery.customer_email}</p>
                      <p className="text-gray-400">📞 {delivery.customer_phone}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">📅 Delivery: {formatDate(delivery.delivery_date)}</p>
                      <p className="text-gray-400">🕒 Created: {formatDate(delivery.created_at)}</p>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <p className="text-gray-300 text-sm">
                      <span className="font-medium">Delivery Address:</span> {delivery.delivery_address}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      ) : (
        /* Create Order View */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl mx-auto bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-xl"
        >
          {/* Form Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Truck size={24} className="text-blue-400" />
              <h2 className="text-xl font-semibold text-white">Create Delivery Order</h2>
            </div>
            <p className="text-gray-300 text-sm">Fill all fields to create a new delivery</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Customer Name */}
            <div>
              <label className="block text-gray-200 text-sm font-medium mb-2">
                Customer Name *
              </label>
              <input
                type="text"
                name="customer_name"
                value={formData.customer_name}
                onChange={handleChange}
                required
                placeholder="Enter full name"
                className="w-full p-3 text-base bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                disabled={loading}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-200 text-sm font-medium mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="customer_email"
                value={formData.customer_email}
                onChange={handleChange}
                required
                placeholder="email@example.com"
                className="w-full p-3 text-base bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                disabled={loading}
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-gray-200 text-sm font-medium mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="customer_phone"
                value={formData.customer_phone}
                onChange={handleChange}
                required
                placeholder="Enter phone number"
                className="w-full p-3 text-base bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                disabled={loading}
              />
            </div>

            {/* Delivery Date */}
            <div>
              <label className="block text-gray-200 text-sm font-medium mb-2">
                Delivery Date *
              </label>
              <input
                type="date"
                name="delivery_date"
                value={formData.delivery_date}
                onChange={handleChange}
                required
                className="w-full p-3 text-base bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                disabled={loading}
              />
            </div>

            {/* Product Name */}
            <div>
              <label className="block text-gray-200 text-sm font-medium mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="product_name"
                value={formData.product_name}
                onChange={handleChange}
                required
                placeholder="Enter product name"
                className="w-full p-3 text-base bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                disabled={loading}
              />
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-gray-200 text-sm font-medium mb-2">
                Quantity *
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                required
                className="w-full p-3 text-base bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                disabled={loading}
              />
            </div>

            {/* Delivery Address */}
            <div className="md:col-span-2">
              <label className="block text-gray-200 text-sm font-medium mb-2">
                Delivery Address *
              </label>
              <textarea
                name="delivery_address"
                value={formData.delivery_address}
                onChange={handleChange}
                required
                rows="3"
                placeholder="Enter complete delivery address"
                className="w-full p-3 text-base bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none"
                disabled={loading}
              />
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2 flex justify-center mt-4">
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 text-base hover:bg-blue-700"
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

            {/* Message */}
            {message && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="md:col-span-2 p-3 rounded-lg border text-sm flex items-center gap-2 mt-3"
                style={{
                  backgroundColor: success ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  borderColor: success ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)',
                  color: success ? 'rgb(187, 247, 208)' : 'rgb(254, 202, 202)'
                }}
              >
                {success ? (
                  <CheckCircle size={16} className="text-green-400" />
                ) : (
                  <XCircle size={16} className="text-red-400" />
                )}
                <span>{message}</span>
              </motion.div>
            )}
          </form>
        </motion.div>
      )}

      {/* Success Toast */}
      {success && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm"
        >
          <div className="flex items-center gap-2">
            <CheckCircle size={16} />
            <span>Order created successfully!</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default Delivery;