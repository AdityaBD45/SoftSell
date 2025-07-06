import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminMarkAsPaid = () => {
  const [licenses, setLicenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(null);

  const token = JSON.parse(localStorage.getItem('userInfo'))?.token;

  const fetchLicenses = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('http://localhost:5000/api/licenses/expired-sold', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLicenses(data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch licenses');
      toast.error('Failed to fetch licenses', { position: 'top-center' });
    } finally {
      setLoading(false);
    }
  };

  const markAsPaid = async (licenseId) => {
    if (!window.confirm('Are you sure you want to mark this license as paid?')) return;

    try {
      setProcessing(licenseId);
      const { data } = await axios.put(
        `http://localhost:5000/api/licenses/mark-paid/${licenseId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      toast.success(data.message, { position: 'top-center' });
      fetchLicenses(); // refresh list
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error marking as paid', { position: 'top-center' });
    } finally {
      setProcessing(null);
    }
  };

  useEffect(() => {
    fetchLicenses();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white px-4 sm:px-6 py-8 sm:py-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-indigo-800 flex items-center">
            <span className="bg-indigo-100 p-2 rounded-full mr-3">🧾</span>
            Mark Licenses as Paid
          </h2>
          <p className="text-gray-600 mt-2">Process payments for expired sold licenses</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
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
                <p className="text-sm text-blue-700">No licenses pending payment</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {licenses.map((license) => (
              <div
                key={license._id}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-800">{license.title}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      license.paidToSeller ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {license.paidToSeller ? 'Paid' : 'Pending'}
                    </span>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Category:</span>
                      <span className="font-medium">{license.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Price:</span>
                      <span className="font-medium">₹{license.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Seller:</span>
                      <span className="font-medium">{license.seller?.name || 'Unknown'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Buyer:</span>
                      <span className="font-medium">{license.buyer?.name || 'Unknown'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Expired On:</span>
                      <span className="font-medium">{new Date(license.expiryDate).toLocaleDateString('en-IN')}</span>
                    </div>
                  </div>

                  {!license.paidToSeller && (
                    <button
                      onClick={() => markAsPaid(license._id)}
                      disabled={processing === license._id}
                      className={`mt-6 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        processing === license._id
                          ? 'bg-green-400 cursor-not-allowed'
                          : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                      }`}
                    >
                      {processing === license._id ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        'Mark as Paid'
                      )}
                    </button>
                  )}
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

export default AdminMarkAsPaid;