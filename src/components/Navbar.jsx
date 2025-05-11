import React from 'react';
import logo from '../assets/logo.png'; // Update path if needed

const Navbar = ({ isDarkMode, toggleDarkMode }) => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-gray-800 dark:to-gray-700 p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo + Gradient Text */}
        <button
          onClick={scrollToTop}
          className="flex items-center space-x-3 focus:outline-none"
        >
          <img
            src={logo}
            alt="SoftSell Logo"
            className="h-10 w-10 rounded-full shadow-md"
          />
          <span className="text-2xl font-bold bg-gradient-to-r from-indigo-200 via-purple-300 to-blue-200 bg-clip-text text-transparent transition-all duration-300 hover:opacity-80">
            SoftSell
          </span>
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 bg-gray-800 text-white dark:bg-white dark:text-gray-800 rounded-md transition-colors duration-300"
        >
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
