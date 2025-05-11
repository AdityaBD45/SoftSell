import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { ArrowRight } from 'lucide-react'; // optional icon

const HeroSection = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <section
      className="min-h-screen flex flex-col justify-center items-center text-center px-6 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300"
      data-aos="fade-up"
    >
      <h1
        className="text-4xl md:text-6xl font-extrabold text-gray-800 dark:text-white mb-4 tracking-tight leading-tight"
        data-aos="fade-down"
      >
        Unlock Value from Unused Software Licenses
      </h1>
      <p
        className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl"
        data-aos="fade-up"
      >
        SoftSell helps you resell unused software licenses in minutes. Fast, legal, and hassle-free.
      </p>
      <button
        className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-full font-semibold shadow-md hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
        data-aos="zoom-in"
      >
        Sell My Licenses <ArrowRight size={20} />
      </button>
    </section>
  );
};

export default HeroSection;
