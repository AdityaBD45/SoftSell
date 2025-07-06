import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddListing = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    daysToSell: '',
    username: '',
    password: '',
    contactNumber: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const categories = [
    'Netflix', 'Hotstar', 'Amazon Prime', 'JioCinema', 'Sony LIV', 'ZEE5', 
    'YouTube Premium', 'Spotify', 'Apple Music', 'Microsoft 365', 
    'Google Workspace', 'Canva Pro', 'Grammarly Premium', 'Adobe Creative Cloud',
    'Notion Pro', 'Figma Pro', 'JetBrains', 'GitHub Copilot', 'ChatGPT Plus', 
    'NordVPN', 'Surfshark', 'Udemy', 'Coursera Plus', 'Skillshare', 
    'Unacademy', 'Byju\'s', 'LinkedIn Learning', 'PlayStation Plus', 
    'Xbox Game Pass', 'Steam Shared', 'Audible', 'Kindle Unlimited', 'Other',
  ];

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.daysToSell || isNaN(formData.daysToSell) || Number(formData.daysToSell) < 1)
      newErrors.daysToSell = 'Days to sell must be a positive number';
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    if (!formData.contactNumber.trim()) newErrors.contactNumber = 'Contact number is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);

    const payload = {
      title: formData.title,
      category: formData.category,
      daysToSell: Number(formData.daysToSell),
      credentials: {
        username: formData.username,
        password: formData.password,
      },
      contactNumber: formData.contactNumber,
    };

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const token = userInfo?.token;

      if (!token) throw new Error('User token not found. Please log in again.');

      const response = await fetch('https://softsell-api.onrender.com/api/licenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit license');
      }

      setFormData({
        title: '',
        category: '',
        daysToSell: '',
        username: '',
        password: '',
        contactNumber: '',
      });

      toast.success('License submitted successfully!', { position: 'top-center' });
      if (onSuccess) onSuccess('License submitted successfully!');
    } catch (error) {
      setErrorMessage(error.message);
      toast.error(error.message, { position: 'top-center' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6">
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white">Submit a New License</h2>
          <p className="text-indigo-100 mt-1">Fill in the details to list your license for sale</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
          {errorMessage && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-red-700 font-medium">{errorMessage}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="title"
                id="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Netflix Premium Account"
                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.title && <p className="text-red-600 text-sm">{errors.title}</p>}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category <span className="text-red-600">*</span>
              </label>
              <select
                name="category"
                id="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  errors.category ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && <p className="text-red-600 text-sm">{errors.category}</p>}
            </div>

            {/* Days to Sell */}
            <div className="space-y-2">
              <label htmlFor="daysToSell" className="block text-sm font-medium text-gray-700">
                Days to Sell <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                name="daysToSell"
                id="daysToSell"
                min="1"
                value={formData.daysToSell}
                onChange={handleChange}
                placeholder="e.g. 7"
                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  errors.daysToSell ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.daysToSell && <p className="text-red-600 text-sm">{errors.daysToSell}</p>}
            </div>

            {/* Contact Number */}
            <div className="space-y-2">
              <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">
                Contact Number <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="contactNumber"
                id="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                placeholder="Your phone number"
                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  errors.contactNumber ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.contactNumber && <p className="text-red-600 text-sm">{errors.contactNumber}</p>}
            </div>

            {/* Username */}
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="username"
                id="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Account username"
                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  errors.username ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.username && <p className="text-red-600 text-sm">{errors.username}</p>}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Account password"
                  className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-70 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                'Submit License'
              )}
            </button>
          </div>
        </form>
      </div>

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default AddListing;