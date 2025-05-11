import React, { useState } from 'react';
import { FaShieldAlt, FaThumbsUp, FaRegClock } from 'react-icons/fa';
import { motion } from 'framer-motion';

const reasons = [
  {
    icon: <FaShieldAlt size={32} className="text-indigo-600 dark:text-indigo-400" />,
    title: 'Secure Transactions',
    desc: 'All your transactions are secured with industry-standard encryption.',
    tooltip: 'Your data is protected with the highest security standards.',
  },
  {
    icon: <FaThumbsUp size={32} className="text-purple-600 dark:text-purple-400" />,
    title: 'Trusted by Thousands',
    desc: 'Join a community of happy users who trust SoftSell for quick, fair reselling.',
    tooltip: 'A growing community of satisfied users worldwide.',
  },
  {
    icon: <FaRegClock size={32} className="text-blue-600 dark:text-blue-400" />,
    title: 'Fast Payments',
    desc: 'Get paid within 24 hours after we accept your license.',
    tooltip: 'Receive your payment quickly after approval.',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: 'easeOut',
    },
  }),
};

const WhyChooseUs = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <section className="py-16 px-6 bg-gradient-to-b from-blue-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-10 text-center">Why Choose Us?</h2>
      <div className="flex flex-col md:flex-row justify-center gap-10">
        {reasons.map((reason, idx) => (
          <motion.div
            key={idx}
            className="relative flex flex-col items-center max-w-xs mx-auto p-4 rounded-xl bg-white dark:bg-gray-800 shadow-md hover:scale-105 transition-transform"
            custom={idx}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={cardVariants}
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="mb-4">{reason.icon}</div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{reason.title}</h3>
            <p className="text-gray-600 dark:text-gray-300">{reason.desc}</p>

            {hoveredIndex === idx && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full bg-gray-900 text-white text-sm rounded-md px-3 py-2 shadow-lg z-10"
              >
                {reason.tooltip}
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseUs;
