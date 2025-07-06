import React, { useEffect, useState } from 'react';
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

const formatDate = (date) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(date).toLocaleDateString(undefined, options);
};

const statusBadge = (expiryDate) => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const daysLeft = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
  
  if (daysLeft < 0) {
    return {
      text: 'Expired',
      color: 'bg-red-100 text-red-800',
      icon: '❌'
    };
  } else if (daysLeft <= 7) {
    return {
      text: `Expiring in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}`,
      color: 'bg-orange-100 text-orange-800',
      icon: '⚠️'
    };
  } else {
    return {
      text: 'Active',
      color: 'bg-green-100 text-green-800',
      icon: '✅'
    };
  }
};

const MyPurchases = () => {
  const [licenses, setLicenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchMyPurchases = async () => {
      setLoading(true);
      setError('');
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const res = await fetch('http://localhost:5000/api/licenses/mypurchases', {
          headers: {
            Authorization: `Bearer ${userInfo?.token}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch purchases');

        const data = await res.json();
        setLicenses(data);
      } catch (err) {
        setError(err.message);
        toast.error(err.message, { position: 'top-center' });
      } finally {
        setLoading(false);
      }
    };

    fetchMyPurchases();
  }, []);

  const filteredLicenses = licenses
    .filter(lic => filter === 'all' || lic.category === filter)
    .filter(lic => 
      lic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lic.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 px-4 md:px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-indigo-900 flex items-center gap-3">
              <span className="bg-indigo-100 p-3 rounded-full">🛒</span>
              <span>My Purchases</span>
            </h1>
            <p className="text-indigo-600 mt-1">View all your purchased licenses</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search purchases..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-indigo-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-white border-2 border-indigo-200 rounded-lg px-4 py-2 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Categories</option>
              {Array.from(new Set(licenses.map(l => l.category))).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        ) : filteredLicenses.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No purchases found</h3>
            <p className="text-gray-600">
              {searchQuery ? 'Try a different search term' : filter !== 'all' ? 'No purchases match your filter' : 'You haven\'t made any purchases yet'}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredLicenses.map((lic) => {
              const logo = categoryLogos[lic.category] || categoryLogos['Other'];
              const status = statusBadge(lic.expiryDate);
              
              return (
                <div
                  key={lic._id}
                  className="relative bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 group"
                >
                  <div 
                    className="h-40 w-full bg-cover bg-center relative"
                    style={{
                      backgroundImage: `linear-gradient(rgba(79, 70, 229, 0.1), rgba(79, 70, 229, 0.1)), url(${logo})`
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-xl font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {lic.title}
                      </h3>
                    </div>
                    <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-sm font-bold ${status.color}`}>
                      {status.icon} {status.text}
                    </span>
                  </div>
                  
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">
                      {lic.title}
                    </h3>
                    <p className="text-sm text-indigo-600 font-medium mb-3">{lic.category}</p>
                    
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Seller:</span>
                        <span className="font-medium">{lic.seller?.name || 'Unknown'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Price Paid:</span>
                        <span className="font-bold text-indigo-700">₹{lic.price || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Expiry Date:</span>
                        <span className="font-medium">{formatDate(lic.expiryDate)}</span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm font-bold text-indigo-700 mb-2">🔐 Your Credentials:</p>
                      <div className="bg-indigo-50 rounded-lg p-3 space-y-2 border border-indigo-100">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Username:</span>
                          <span className="font-mono text-sm">{lic.credentials?.username || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Password:</span>
                          <span className="font-mono text-sm">{lic.credentials?.password || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => navigator.clipboard.writeText(`${lic.credentials?.username || ''}\n${lic.credentials?.password || ''}`)}
                      className="w-full py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-medium rounded-lg transition flex items-center justify-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy Credentials
                    </button>
                  </div>
                </div>
              );
            })}
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

export default MyPurchases;