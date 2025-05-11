import React, { useState, useEffect } from 'react';
import HeroSection from './sections/HeroSection';
import HowItWorks from './sections/HowItWorks';
import WhyChooseUs from './sections/WhyChooseUs';
import CustomerTestimonials from './components/CustomerTestimonials';
import ContactForm from './components/ContactForm';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedMode);
    document.documentElement.classList.toggle('dark', savedMode);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
    localStorage.setItem('darkMode', newMode);
  };

  return (
    <div className="transition-colors duration-300">
      <button
        onClick={toggleDarkMode}
        className="fixed top-4 right-4 p-2 bg-gray-800 text-white dark:bg-white dark:text-gray-800 rounded-md transition-colors duration-300 z-50"
      >
        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
      </button>

      <HeroSection />
      <HowItWorks />
      <WhyChooseUs />
      <CustomerTestimonials />
      <ContactForm />
    </div>
  );
}

export default App;
