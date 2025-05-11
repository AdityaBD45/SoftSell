import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    licenseType: '',
    message: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    let formErrors = {};
    if (!formData.name) formErrors.name = 'Name is required';
    if (!formData.email) formErrors.email = 'Email is required';
    if (!formData.company) formErrors.company = 'Company is required';
    if (!formData.licenseType) formErrors.licenseType = 'License Type is required';
    if (!formData.message) formErrors.message = 'Message is required';
    return formErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length === 0) {
      alert('Form submitted successfully!');
    } else {
      setErrors(formErrors);
    }
  };

  return (
    <section className="py-16 px-6 bg-gradient-to-b from-blue-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-10 text-center">Contact Us</h2>

      <motion.div
        className="max-w-lg mx-auto bg-gradient-to-r from-indigo-400 to-purple-500 dark:from-gray-800 dark:to-gray-600 p-8 shadow-xl rounded-xl transition-all duration-300 transform hover:scale-105"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <form onSubmit={handleSubmit}>
          {['name', 'email', 'company'].map((field) => (
            <div className="mb-6" key={field}>
              <label htmlFor={field} className="block text-left font-semibold text-gray-700 dark:text-gray-300 capitalize">
                {field}
              </label>
              <input
                type={field === 'email' ? 'email' : 'text'}
                name={field}
                id={field}
                value={formData[field]}
                onChange={handleChange}
                className="w-full p-4 mt-2 border-2 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500"
              />
              {errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]}</p>}
            </div>
          ))}

          <div className="mb-6">
            <label htmlFor="licenseType" className="block text-left font-semibold text-gray-700 dark:text-gray-300">
              License Type
            </label>
            <select
              name="licenseType"
              id="licenseType"
              value={formData.licenseType}
              onChange={handleChange}
              className="w-full p-4 mt-2 border-2 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select License Type</option>
              <option value="Software">Software</option>
              <option value="Operating System">Operating System</option>
              <option value="Antivirus">Antivirus</option>
            </select>
            {errors.licenseType && <p className="text-red-500 text-sm mt-1">{errors.licenseType}</p>}
          </div>

          <div className="mb-6">
            <label htmlFor="message" className="block text-left font-semibold text-gray-700 dark:text-gray-300">
              Message
            </label>
            <textarea
              name="message"
              id="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full p-4 mt-2 border-2 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500"
            />
            {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
          </div>

          <motion.button
            type="submit"
            className="w-full p-4 bg-indigo-600 dark:bg-indigo-700 text-white rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-800 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Submit
          </motion.button>
        </form>
      </motion.div>
    </section>
  );
};

export default ContactForm;
