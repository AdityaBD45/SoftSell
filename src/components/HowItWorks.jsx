import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, DollarSign, CheckCircle } from 'lucide-react';

const steps = [
  {
    icon: <Upload size={32} className="text-indigo-500 dark:text-indigo-400" />,
    title: 'Upload License',
    desc: 'Submit your unused software license easily through our platform.',
    tooltip: 'Start by uploading your unused license',
  },
  {
    icon: <DollarSign size={32} className="text-purple-500 dark:text-purple-400" />,
    title: 'Get Valuation',
    desc: 'We’ll assess your license and provide a fair market price.',
    tooltip: 'We calculate a competitive market rate',
  },
  {
    icon: <CheckCircle size={32} className="text-blue-500 dark:text-blue-400" />,
    title: 'Get Paid',
    desc: 'Once accepted, receive payment instantly via your preferred method.',
    tooltip: 'Receive your payment quickly and securely',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.5 },
  }),
};

const HowItWorks = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-white via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-12 text-center">How It Works</h2>
      <div className="grid gap-10 md:grid-cols-3 max-w-6xl mx-auto">
        {steps.map((step, idx) => (
          <motion.div
            key={idx}
            custom={idx}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={cardVariants}
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
            className="relative flex flex-col items-center bg-white dark:bg-gray-800 rounded-2xl shadow-md dark:shadow-lg p-6 hover:scale-105 transition-transform duration-300"
          >
            <div className="mb-4">{step.icon}</div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{step.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-center">{step.desc}</p>

            {hoveredIndex === idx && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full bg-gray-900 text-white text-sm rounded-md px-3 py-2 shadow-lg z-10"
              >
                {step.tooltip}
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
