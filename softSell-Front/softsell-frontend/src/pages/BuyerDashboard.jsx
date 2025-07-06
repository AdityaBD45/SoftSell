import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import MyPurchases from '../components/MyPurchases';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import netflixLogo from '../assets/netflix-logo.jpg';
import hotstarLogo from '../assets/JioHotstar.webp';
import amazonLogo from '../assets/amazon-prime-logo.webp';
import youtubeLogo from '../assets/youtube-premium.webp';
import spotifyLogo from '../assets/spotify-icon.webp';
import adobeLogo from '../assets/adobe logo.png';
import canvaLogo from '../assets/Canva-logo.png';
import chatgptLogo from '../assets/chatgpt logo.jpg';
import figmaLogo from '../assets/figma logo.jpg';
import copilotLogo from '../assets/github-copilot.jpg';
import microsoftLogo from '../assets/Microsoft-Office-365-Logo.png';
import udemyLogo from '../assets/udemy logo.jpg';
import defaultLogo from '../assets/bg.png';

const categoryLogos = {
  'Netflix': netflixLogo,
  'Hotstar': hotstarLogo,
  'JioCinema': hotstarLogo,
  'Amazon Prime': amazonLogo,
  'YouTube Premium': youtubeLogo,
  'Spotify': spotifyLogo,
  'Adobe Creative Cloud': adobeLogo,
  'Canva Pro': canvaLogo,
  'ChatGPT Plus': chatgptLogo,
  'Figma Pro': figmaLogo,
  'GitHub Copilot': copilotLogo,
  'Microsoft 365': microsoftLogo,
  'Udemy': udemyLogo,
  'Other': defaultLogo,
};

const BuyerDashboard = () => {
  const [licenses, setLicenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPurchases, setShowPurchases] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo?.token || userInfo.role !== 'user') {
      navigate('/');
      return;
    }

    const fetchLicenses = async () => {
      try {
        const response = await axios.get('https://softsell-api.onrender.com/api/licenses', {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });

        if (Array.isArray(response.data)) {
          setLicenses(response.data);
        } else {
          throw new Error('Invalid response format');
        }
        setError('');
      } catch (err) {
        console.error('License fetch failed:', err);
        setError(err.response?.data?.message || 'Failed to load licenses');
        setLicenses([]);
        toast.error(err.response?.data?.message || 'Failed to load licenses', {
          position: 'top-center',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLicenses();
  }, [navigate]);

  const filteredLicenses = licenses
    .filter(license => filter === 'all' || license.category === filter)
    .filter(license =>
      license.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      license.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <Layout>
      <div className="min-h-screen px-4 md:px-6 py-8 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-blue-900 flex items-center gap-3">
                <span className="bg-blue-100 p-3 rounded-full">🛒</span>
                <span>Buyer Dashboard</span>
              </h1>
              <p className="text-blue-600 mt-1">Browse and purchase available licenses</p>
            </div>
            <button
              onClick={() => setShowPurchases(!showPurchases)}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold px-6 py-3 rounded-lg shadow-md transition duration-300 transform hover:-translate-y-1 flex items-center gap-2"
            >
              {showPurchases ? 'Back to Licenses' : 'My Purchases'}
            </button>
          </div>

          {showPurchases ? (
            <MyPurchases />
          ) : (
            <>
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    placeholder="Search licenses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                  />
                  <svg
                    className="absolute left-3 top-2.5 h-5 w-5 text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="bg-white border-2 border-blue-200 rounded-lg px-4 py-2 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Categories</option>
                  {Array.from(new Set(licenses.map(l => l.category))).map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : error ? (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              ) : filteredLicenses.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-xl font-bold text-gray-700 mb-2">No licenses found</h3>
                  <p className="text-gray-600">
                    {searchQuery ? 'Try a different search term' : filter !== 'all' ? 'No licenses match your filter' : 'No licenses available right now'}
                  </p>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredLicenses.map((license) => {
                    const logo = categoryLogos[license.category] || categoryLogos['Other'];
                    return (
                      <div
                        key={license._id}
                        className="relative bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transform transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-[1.02] hover:shadow-lg"
                      >
                        <div
                          className="h-40 w-full bg-cover bg-center"
                          style={{ backgroundImage: `linear-gradient(rgba(79,70,229,0.1), rgba(79,70,229,0.1)), url(${logo})` }}
                        />
                        <div className="p-5">
                          <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">{license.title}</h3>
                          <p className="text-sm text-blue-600 font-medium mb-3">{license.category}</p>
                          <div className="space-y-2 text-sm mb-4">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Price:</span>
                              <span className="font-bold text-blue-700">₹{license.price || 'Not Set'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Seller:</span>
                              <span className="font-medium">{license.seller?.name || 'Unknown'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Posted:</span>
                              <span className="font-medium">{new Date(license.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => navigate(`/license/${license._id}`)}
                            className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg transition flex items-center justify-center gap-2"
                          >
                            View & Buy
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
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
    </Layout>
  );
};

export default BuyerDashboard;
