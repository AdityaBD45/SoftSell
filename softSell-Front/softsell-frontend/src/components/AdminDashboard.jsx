import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const formatDate = (date) => new Date(date).toLocaleDateString();

const AdminDashboard = () => {
  const [licenses, setLicenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [priceInputs, setPriceInputs] = useState({});

  useEffect(() => {
    const fetchPendingLicenses = async () => {
      setLoading(true);
      setError('');
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const res = await fetch('http://localhost:5000/api/licenses', {
          headers: {
            Authorization: `Bearer ${userInfo?.token}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch licenses');

        const data = await res.json();
        const pending = data.filter((lic) => lic.status === 'pending');
        setLicenses(pending);
        
        // Initialize price inputs
        const initialPrices = {};
        pending.forEach(lic => {
          initialPrices[lic._id] = '';
        });
        setPriceInputs(initialPrices);
      } catch (err) {
        setError(err.message);
        toast.error(err.message, { position: 'top-center' });
      } finally {
        setLoading(false);
      }
    };

    fetchPendingLicenses();
  }, []);

  const handlePriceChange = (licenseId, value) => {
    setPriceInputs(prev => ({
      ...prev,
      [licenseId]: value
    }));
  };

  const handleApprove = async (licenseId) => {
    if (!priceInputs[licenseId] || isNaN(priceInputs[licenseId])) {
      toast.error('Please enter a valid price', { position: 'top-center' });
      return;
    }

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const res = await fetch(`http://localhost:5000/api/licenses/${licenseId}/approve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo?.token}`,
        },
        body: JSON.stringify({ price: priceInputs[licenseId] }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Approval failed');
      
      toast.success(`✅ License approved: ${data.license.title}`, { position: 'top-center' });
      setLicenses(licenses.filter(lic => lic._id !== licenseId));
    } catch (err) {
      toast.error(err.message, { position: 'top-center' });
    }
  };

  const handleReject = async (licenseId) => {
    if (!window.confirm('Are you sure you want to reject this license?')) return;

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const res = await fetch(`http://localhost:5000/api/licenses/${licenseId}/reject`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Rejection failed');
      
      toast.success(`❌ License rejected: ${data.license.title}`, { position: 'top-center' });
      setLicenses(licenses.filter(lic => lic._id !== licenseId));
    } catch (err) {
      toast.error(err.message, { position: 'top-center' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 sm:px-6 py-8 sm:py-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-indigo-800 flex items-center">
            <span className="bg-indigo-100 p-2 rounded-full mr-3">🛡️</span>
            Admin License Approval
          </h1>
          <p className="text-gray-600 mt-2">Review and approve pending license submissions</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        ) : licenses.length === 0 ? (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">No pending licenses to approve</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {licenses.map((lic) => (
              <div
                key={lic._id}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-bold text-gray-800">{lic.title}</h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      {formatDate(lic.createdAt)}
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      {lic.seller?.name || 'Unknown'} ({lic.seller?.email || 'N/A'})
                    </div>

                    {lic.contactNumber && (
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        {lic.contactNumber}
                      </div>
                    )}

                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Credentials:</h4>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-500">Username:</span>
                          <span className="font-medium">{lic.credentials?.username || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Password:</span>
                          <span className="font-medium">{lic.credentials?.password || 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      {lic.daysToSell} days to sell
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="flex items-center mb-2">
                      <input
                        type="number"
                        min="1"
                        placeholder="Set price (₹)"
                        value={priceInputs[lic._id] || ''}
                        onChange={(e) => handlePriceChange(lic._id, e.target.value)}
                        className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                      <button
                        onClick={() => handleApprove(lic._id)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        Approve
                      </button>
                    </div>
                    <button
                      onClick={() => handleReject(lic._id)}
                      className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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

export default AdminDashboard;