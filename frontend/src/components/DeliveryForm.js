import React from "react";

function Delivery() {
  return (
    <div className="p-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Delivery</h1>
        <p className="text-gray-300">Manage your delivery operations</p>
      </div>

      {/* Form Card */}
      <div className="mt-6 max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          📦 New Delivery Order
        </h2>

        <form className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Customer Name *
            </label>
            <input
              type="text"
              placeholder="Enter customer name"
              className="w-full p-3 border border-gray-300 rounded-lg 
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                         text-gray-900 placeholder-gray-400"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Email *</label>
            <input
              type="email"
              placeholder="Enter email"
              className="w-full p-3 border border-gray-300 rounded-lg 
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                         text-gray-900 placeholder-gray-400"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Phone *</label>
            <input
              type="tel"
              placeholder="Enter phone number"
              className="w-full p-3 border border-gray-300 rounded-lg 
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                         text-gray-900 placeholder-gray-400"
            />
          </div>

          {/* Delivery Date */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Delivery Date *
            </label>
            <input
              type="date"
              className="w-full p-3 border border-gray-300 rounded-lg 
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                         text-gray-900"
            />
          </div>

          {/* Delivery Address */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium mb-2">
              Delivery Address *
            </label>
            <textarea
              placeholder="Enter delivery address"
              rows="3"
              className="w-full p-3 border border-gray-300 rounded-lg 
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                         text-gray-900 placeholder-gray-400"
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg 
                         hover:bg-blue-700 transition duration-200 shadow-md"
            >
              Create Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Delivery;
