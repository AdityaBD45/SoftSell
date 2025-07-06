import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import AddListing from '../components/AddListing';
import MyLicenses from '../components/MyLicenses';
import AdminDashboard from '../components/AdminDashboard';
import AdminVerifyPayments from '../components/AdminVerifyPayments';
import AdminMarkPaid from '../components/MarkAsPaidView';

const Overview = ({
  onAddClick,
  onViewClick,
  onAdminClick,
  onVerifyPaymentsClick,
  onMarkPaidClick,
}) => {
  const [sellerName, setSellerName] = useState('Seller');
  const [isAdmin, setIsAdmin] = useState(false);
  const [hoverStates, setHoverStates] = useState({
    add: false,
    view: false,
    admin: false,
    verifyPayments: false,
    markPaid: false
  });

  const handleHover = (button, isHovering) => {
    setHoverStates(prev => ({ ...prev, [button]: isHovering }));
  };

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo?.name) setSellerName(userInfo.name);
    if (userInfo?.role === 'admin') setIsAdmin(true);
  }, []);

  const actionButtons = [
    {
      id: 'add',
      onClick: onAddClick,
      icon: '➕',
      text: 'Add Licenses',
      baseClass: 'bg-gradient-to-r from-indigo-500 to-indigo-600',
      hoverClass: 'hover:from-indigo-600 hover:to-indigo-700'
    },
    {
      id: 'view',
      onClick: onViewClick,
      icon: '📊',
      text: 'My Licenses',
      baseClass: 'bg-gradient-to-r from-purple-500 to-purple-600',
      hoverClass: 'hover:from-purple-600 hover:to-purple-700'
    },
    ...(isAdmin ? [
      {
        id: 'admin',
        onClick: onAdminClick,
        icon: '🔍',
        text: 'Verify Licenses',
        baseClass: 'bg-gradient-to-r from-green-500 to-green-600',
        hoverClass: 'hover:from-green-600 hover:to-green-700'
      },
      {
        id: 'verifyPayments',
        onClick: onVerifyPaymentsClick,
        icon: '🧾',
        text: 'Verify Payments',
        baseClass: 'bg-gradient-to-r from-green-500 to-green-600',
        hoverClass: 'hover:from-green-600 hover:to-green-700'
      },
      {
        id: 'markPaid',
        onClick: onMarkPaidClick,
        icon: '💰',
        text: 'Mark as Paid',
        baseClass: 'bg-gradient-to-r from-green-500 to-green-600',
        hoverClass: 'hover:from-green-600 hover:to-green-700'
      }
    ] : [])
  ];

  const processSteps = [
    {
      icon: '📝',
      title: '1. Submit Your License',
      description: 'Simply enter your software license details. It takes less than a minute!',
      highlight: 'We keep all information encrypted and secure.',
      gradient: 'from-indigo-100 to-indigo-50'
    },
    {
      icon: '🔍',
      title: '2. Verification',
      description: 'Our admin team personally checks each listing to ensure authenticity.',
      highlight: 'Typically completed within 24 hours.',
      gradient: 'from-blue-100 to-blue-50'
    },
    {
      icon: '🛒',
      title: '3. Go On Sale',
      description: 'Your license becomes visible to thousands of potential buyers.',
      highlight: 'We handle all listing promotions for you.',
      gradient: 'from-purple-100 to-purple-50'
    },
    {
      icon: '💸',
      title: '4. Get Paid',
      description: 'Receive payment directly to your account after sale completion.',
      highlight: 'No hidden fees - you get the full amount.',
      gradient: 'from-green-100 to-green-50'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-indigo-50 to-white px-4 md:px-6 py-10">
      <div className="space-y-10">
        <div className="text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-indigo-800"
          >
            Welcome to SoftSell, <span className="text-indigo-600">{sellerName}</span>! 👋
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-indigo-700 max-w-2xl mx-auto text-base md:text-lg mt-3"
          >
            Turn your unused software licenses into cash - safely and securely.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto"
        >
          {processSteps.map((step, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`bg-gradient-to-br ${step.gradient} rounded-xl p-6 shadow-lg border border-indigo-100 hover:shadow-xl transition-all h-full`}
            >
              <div className="text-3xl md:text-4xl mb-4 text-indigo-600">{step.icon}</div>
              <h3 className="font-bold text-md md:text-lg text-indigo-800 mb-2">{step.title}</h3>
              <p className="text-gray-700 mb-3 text-sm md:text-base">{step.description}</p>
              <p className="text-xs md:text-sm bg-white/50 text-indigo-700 rounded-lg px-3 py-2 backdrop-blur-sm">
                {step.highlight}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-xl p-6 border border-indigo-200 shadow-md max-w-3xl mx-auto"
        >
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="text-2xl text-indigo-600 bg-indigo-100 p-3 rounded-full">🔒</div>
            <div>
              <h3 className="text-lg md:text-xl font-semibold text-indigo-800 mb-2">Your Safety is Our Priority</h3>
              <p className="text-gray-700 text-sm md:text-base">
                All credentials are encrypted end-to-end. Only our verified administrators can view your details during the verification process.
                We never store sensitive information after verification is complete.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">256-bit Encryption</span>
                <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">GDPR Compliant</span>
                <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">Secure Payments</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="fixed bottom-4 left-4 flex flex-col gap-3 z-50">
        {actionButtons.map((button) => (
          <div key={button.id} className="relative">
            <motion.button
              onClick={button.onClick}
              onMouseEnter={() => handleHover(button.id, true)}
              onMouseLeave={() => handleHover(button.id, false)}
              className={`flex items-center justify-center h-12 text-white rounded-full shadow-lg transition-all duration-300 ease-out ${
                button.baseClass
              } ${button.hoverClass} ${
                hoverStates[button.id] ? 'px-6 pr-8' : 'w-12'
              }`}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
            >
              <span className="flex-shrink-0">{button.icon}</span>
              <span
                className={`overflow-hidden whitespace-nowrap transition-all duration-300 ease-out ${
                  hoverStates[button.id] ? 'max-w-[7.5rem] ml-2 opacity-100' : 'max-w-0 opacity-0'
                }`}
              >
                {button.text}
              </span>
            </motion.button>
          </div>
        ))}
      </div>
    </div>
  );
};

const AddLicenseView = ({ onBack }) => {
  const [successMessage, setSuccessMessage] = useState('');
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen px-4 md:px-6 py-10 bg-gradient-to-b from-indigo-50 to-white"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-indigo-700">Add New License</h2>
          <button
            onClick={onBack}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg hover:bg-indigo-700 transition shadow-md"
          >
            <span>←</span>
            <span className="hidden sm:inline">Back to Dashboard</span>
          </button>
        </div>
        
        {successMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg border border-green-200"
          >
            {successMessage}
          </motion.div>
        )}
        
        <div className="bg-white rounded-xl p-6 shadow-md border border-indigo-100">
          <AddListing onSuccess={(msg) => setSuccessMessage(msg)} />
        </div>
      </div>
    </motion.div>
  );
};

const MyLicensesView = ({ onBack }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen px-4 md:px-6 py-10 bg-gradient-to-b from-indigo-50 to-white"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-indigo-700">Your Licenses</h2>
            <p className="text-indigo-600 text-sm mt-1">View and manage all your listed licenses</p>
          </div>
          <button
            onClick={onBack}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition shadow-md"
          >
            <span>←</span>
            <span className="hidden sm:inline">Back to Dashboard</span>
          </button>
        </div>
        
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-md border border-indigo-100">
          <MyLicenses />
        </div>
      </div>
    </motion.div>
  );
};

const SellerDashboard = () => {
  const [view, setView] = useState('overview');
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo || (userInfo.role !== 'seller' && userInfo.role !== 'admin')) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <Layout>
      <div className="w-full">
        {view === 'overview' && (
          <Overview
            onAddClick={() => setView('add')}
            onViewClick={() => setView('licenses')}
            onAdminClick={() => setView('admin')}
            onVerifyPaymentsClick={() => setView('verifyPayments')}
            onMarkPaidClick={() => setView('markPaid')}
          />
        )}
        {view === 'add' && <AddLicenseView onBack={() => setView('overview')} />}
        {view === 'licenses' && <MyLicensesView onBack={() => setView('overview')} />}
        {view === 'admin' && <AdminDashboard />}
        {view === 'verifyPayments' && <AdminVerifyPayments />}
        {view === 'markPaid' && <AdminMarkPaid />}
      </div>
    </Layout>
  );
};

export default SellerDashboard;