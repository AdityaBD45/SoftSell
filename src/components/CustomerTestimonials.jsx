import React from 'react';

// Dummy testimonial data
const testimonials = [
  {
    name: 'John Doe',
    role: 'CEO',
    company: 'TechCo',
    review: 'SoftSell made it incredibly easy to resell our software licenses, and the process was seamless. Highly recommended!',
  },
  {
    name: 'Jane Smith',
    role: 'Product Manager',
    company: 'InnovateX',
    review: 'The team at SoftSell is super responsive and helped us get the best price for our unused software licenses. Great experience!',
  },
];

const CustomerTestimonials = () => {
  return (
    <section className="py-16 px-6 bg-gradient-to-b from-blue-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-10 text-center">Customer Testimonials</h2>
      <div className="flex flex-col md:flex-row justify-center gap-10">
        {testimonials.map((testimonial, idx) => (
          <div
            key={idx}
            className="relative flex flex-col items-center max-w-xs mx-auto p-6 rounded-xl bg-white dark:bg-gray-800 shadow-md hover:scale-105 transition-transform"
          >
            <p className="text-gray-600 dark:text-gray-300 mb-4">{`"${testimonial.review}"`}</p>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">{testimonial.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {testimonial.role}, {testimonial.company}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CustomerTestimonials;
