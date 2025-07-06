import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import Compressor from 'compressorjs';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LicenseDetails = () => {
  const { id } = useParams();
  const [license, setLicense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [txnId, setTxnId] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [paymentSubmitted, setPaymentSubmitted] = useState(false);
  const [previewURL, setPreviewURL] = useState('');
  const [paymentExpired, setPaymentExpired] = useState(false);

  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    if (!userInfo || userInfo.role !== 'user') {
      navigate('/');
      return;
    }

    const fetchLicense = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/licenses/${id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setLicense(data);
        setError('');
      } catch (err) {
        console.error(err);
        setError('Failed to load license');
        toast.error('Failed to load license', { position: 'top-center' });
      } finally {
        setLoading(false);
      }
    };

    fetchLicense();
  }, [id, navigate, userInfo]);

  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      new Compressor(file, {
        quality: 0.6,
        maxWidth: 800,
        success(result) {
          resolve(result);
        },
        error(err) {
          reject(err);
        },
      });
    });
  };

  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });
  };

  const handleProofSubmit = async (e) => {
    e.preventDefault();

    if (!txnId || !screenshot || !(screenshot instanceof File)) {
      toast.error('All fields are required', { position: 'top-center' });
      return;
    }

    try {
      setSubmitting(true);

      const compressed = await compressImage(screenshot);
      const base64 = await toBase64(compressed);

      await axios.post(
        'http://localhost:5000/api/purchase/proof',
        {
          licenseId: id,
          txnId,
          screenshotBase64: base64,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      setPaymentSubmitted(true);
      toast.success('Payment proof submitted successfully!', { position: 'top-center' });
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Submission failed';
      toast.error(msg, { position: 'top-center' });
    } finally {
      setSubmitting(false);
    }
  };

  const finalPrice = Math.round((license?.price || 0) * 1.1);
  const isBuyer = license?.buyer?.toString?.() === userInfo._id;
  const isAvailable = license?.status === 'approved' && !license?.buyer;

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-lg font-semibold text-gray-700">Loading license details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center p-6 bg-white rounded-xl shadow-lg max-w-md">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading License</h2>
            <p className="text-gray-700">{error}</p>
            <button 
              onClick={() => navigate('/dashboard')}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!license) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center p-6 bg-white rounded-xl shadow-lg max-w-md">
            <div className="text-gray-500 text-5xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">License Not Found</h2>
            <p className="text-gray-600">The license you're looking for doesn't exist or may have been removed.</p>
            <button 
              onClick={() => navigate('/dashboard')}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen py-10 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          {/* License Header */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
            <div className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">{license.title}</h1>
                  <div className="flex items-center mt-2 space-x-2">
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                      {license.category}
                    </span>
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${
                      license.status === 'approved' ? 'bg-green-100 text-green-800' :
                      license.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {license.status}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-800">₹{finalPrice}</p>
                  <p className="text-sm text-gray-500">includes platform fee</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* License Details */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">📋 License Details</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{license.daysToSell} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Seller:</span>
                  <span className="font-medium">{license.seller?.name || 'Unknown'}</span>
                </div>
                {isBuyer && license.expiryDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expires on:</span>
                    <span className="font-medium">{new Date(license.expiryDate).toDateString()}</span>
                  </div>
                )}
              </div>

              {isBuyer && license.credentials && (
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-lg font-bold text-blue-800 mb-3">🔐 Your Credentials</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-blue-600">Username:</span>
                      <span className="font-mono bg-blue-100 px-2 py-1 rounded">{license.credentials.username}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-600">Password:</span>
                      <span className="font-mono bg-blue-100 px-2 py-1 rounded">{license.credentials.password}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Section - Always Visible */}
            <div className="bg-white rounded-xl shadow-md p-6">
              {isAvailable ? (
                <>
                  {!paymentSubmitted ? (
                    <>
                      <h2 className="text-xl font-bold text-gray-800 mb-4">💳 Make Payment</h2>
                      <div className="text-center mb-6">
                        <p className="text-gray-700 mb-4">Scan this QR code to pay ₹{finalPrice}</p>
                        <div className="mx-auto w-48 h-48 bg-white p-3 rounded-lg border-2 border-blue-200 shadow-sm">
                          <img
                            src="/qr.jpg"
                            alt="Payment QR Code"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <p className="text-sm text-gray-500 mt-2">UPI ID: softsell@upi</p>
                      </div>

                      {showPaymentForm ? (
                        <form onSubmit={handleProofSubmit} className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Transaction ID</label>
                            <input
                              type="text"
                              value={txnId}
                              onChange={(e) => setTxnId(e.target.value)}
                              placeholder="Enter UPI Transaction Reference"
                              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Screenshot</label>
                            <div className="flex items-center justify-center w-full">
                              <label className="flex flex-col w-full border-2 border-dashed border-gray-300 hover:border-blue-500 rounded-lg cursor-pointer transition h-32">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                  {previewURL ? (
                                    <img src={previewURL} alt="Preview" className="h-20 object-contain mb-2" />
                                  ) : (
                                    <>
                                      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                      </svg>
                                      <p className="text-sm text-gray-500 mt-2">Click to upload screenshot</p>
                                    </>
                                  )}
                                </div>
                                <input 
                                  type="file" 
                                  accept="image/*" 
                                  onChange={(e) => {
                                    const file = e.target.files[0];
                                    setScreenshot(file);
                                    setPreviewURL(URL.createObjectURL(file));
                                  }}
                                  className="hidden"
                                  required
                                />
                              </label>
                            </div>
                          </div>

                          <button
                            type="submit"
                            disabled={submitting}
                            className={`w-full py-3 px-4 rounded-lg font-bold text-white transition shadow-md ${
                              submitting 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-green-600 hover:bg-green-700'
                            }`}
                          >
                            {submitting ? (
                              <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                              </span>
                            ) : (
                              'Submit Payment Proof'
                            )}
                          </button>
                        </form>
                      ) : (
                        <button
                          onClick={() => setShowPaymentForm(true)}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-bold transition shadow-md"
                        >
                          I've Made the Payment
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="text-green-500 text-5xl mb-3">✓</div>
                      <h3 className="text-xl font-bold text-green-800 mb-2">Payment Received!</h3>
                      <p className="text-gray-700 mb-4">
                        Your payment proof has been submitted. We'll verify and send your credentials soon.
                      </p>
                    </div>
                  )}
                </>
              ) : isBuyer ? (
                <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="text-xl font-bold text-blue-800 mb-2">✅ Purchase Complete</h3>
                  <p className="text-gray-700">You already own this license.</p>
                </div>
              ) : (
                <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h3 className="text-xl font-bold text-yellow-800 mb-2">Not Available</h3>
                  <p className="text-gray-700">This license is no longer available for purchase.</p>
                </div>
              )}
            </div>
          </div>
        </div>
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
    </Layout>
  );
};

export default LicenseDetails;