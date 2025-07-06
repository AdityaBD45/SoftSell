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

const calculateDays = (startDate, endDate) => {
  const diff = new Date(endDate) - new Date(startDate);
  return Math.max(Math.floor(diff / (1000 * 60 * 60 * 24)), 0);
};

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

const statusColors = {
  'pending': 'bg-yellow-100 text-yellow-800',
  'approved': 'bg-blue-100 text-blue-800',
  'sold': 'bg-green-100 text-green-800',
  'rejected': 'bg-red-100 text-red-800'
};

const statusIcons = {
  'pending': '⏳',
  'approved': '✅',
  'sold': '💰',
  'rejected': '❌'
};

const MyLicenses = () => {
  const [licenses, setLicenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchLicenses = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const token = userInfo?.token;

        const res = await fetch('http://localhost:5000/api/licenses', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch licenses');
        const data = await res.json();
        setLicenses(data);
      } catch (err) {
        setError(err.message);
        toast.error(err.message, { position: 'top-center' });
      } finally {
        setLoading(false);
      }
    };

    fetchLicenses();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this license?')) return;

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const token = userInfo?.token;
      const res = await fetch(`http://localhost:5000/api/licenses/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Failed to delete license');
      setLicenses(licenses.filter(l => l._id !== id));
      toast.success('License deleted successfully', { position: 'top-center' });
    } catch (err) {
      toast.error(err.message, { position: 'top-center' });
    }
  };

  const filteredLicenses = licenses
    .filter((l) => filter === 'all' || l.status === filter)
    .filter((l) => 
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="min-h-screen px-4 md:px-6 py-8 bg-gradient-to-br from-indigo-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-indigo-900 flex items-center gap-3">
              <span className="bg-indigo-100 p-3 rounded-full">📋</span>
              <span>My Licenses</span>
            </h2>
            <p className="text-indigo-600 mt-1">Manage all your submitted licenses in one place</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search licenses..."
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
              <option value="all">All Licenses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="sold">Sold</option>
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
            <h3 className="text-xl font-bold text-gray-700 mb-2">No licenses found</h3>
            <p className="text-gray-600">
              {searchQuery ? 'Try a different search term' : filter !== 'all' ? 'No licenses match your filter' : 'You haven\'t submitted any licenses yet'}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredLicenses.map((lic) => {
              const totalDays = lic.daysToSell;
              const expiry = lic.expiryDate ? new Date(lic.expiryDate) : null;
              const start = expiry ? new Date(expiry.getTime() - totalDays * 86400000) : null;
              const daysCompleted = start ? calculateDays(start, new Date()) : 0;
              const progress = start ? Math.min((daysCompleted / totalDays) * 100, 100) : 0;

              const logo = categoryLogos[lic.category] || categoryLogos['Other'];

              return (
                <div
                  key={lic._id}
                  className="relative bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1"
                >
                  <div 
                    className="h-32 w-full bg-cover bg-center"
                    style={{
                      backgroundImage: `linear-gradient(rgba(79, 70, 229, 0.2), rgba(79, 70, 229, 0.2)), url(${logo})`
                    }}
                  >
                    <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-sm font-bold ${statusColors[lic.status]}`}>
                      {statusIcons[lic.status]} {lic.status.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 truncate" title={lic.title}>
                      {lic.title}
                    </h3>
                    
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
                      </svg>
                      Submitted: {new Date(lic.createdAt).toLocaleDateString()}
                    </div>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Category:</span>
                        <span className="font-medium">{lic.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Price:</span>
                        <span className="font-medium">₹{lic.price ?? 'Not Set'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Days to Sell:</span>
                        <span className="font-medium">{totalDays}</span>
                      </div>
                      {expiry && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Expiry Date:</span>
                          <span className="font-medium">{expiry.toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                    
                    {lic.status === 'sold' && (
                      <div className="mt-3 bg-green-50 border border-green-100 rounded-lg p-2 text-center">
                        <p className="text-green-700 font-medium text-sm">💰 Payment after expiry</p>
                      </div>
                    )}
                    
                    {progress > 0 && (
                      <div className="mt-4">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Progress: {daysCompleted}/{totalDays} days</span>
                          <span>{Math.round(progress)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full transition-all duration-500 ease-in-out"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    {lic.status === 'pending' && (
                      <button
                        onClick={() => handleDelete(lic._id)}
                        className="mt-4 w-full py-2 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-lg transition flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                        Delete Listing
                      </button>
                    )}
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

export default MyLicenses;