import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { Settings, LogOut, User, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import EditProfileModal from './EditProfileModal';
import logo from '../assets/logo.png';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isHoveringProfile, setIsHoveringProfile] = useState(false);
  const [isHoveringTitle, setIsHoveringTitle] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const getRoleBadgeColor = () => {
    switch(userInfo?.role) {
      case 'admin':
        return 'bg-gradient-to-r from-purple-500 to-purple-600 text-white';
      case 'seller':
        return 'bg-gradient-to-r from-green-500 to-green-600 text-white';
      default:
        return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white';
    }
  };

  const getRoleDisplayText = () => {
    switch(userInfo?.role) {
      case 'admin':
        return 'Administrator';
      case 'seller':
        return 'Verified Seller';
      default:
        return 'Buyer Account';
    }
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-3 flex justify-between items-center bg-gradient-to-r from-blue-700 to-indigo-800 shadow-xl backdrop-blur-sm">
        
        {/* Left Logo */}
        <motion.div 
          className="flex items-center gap-2 sm:gap-3 cursor-pointer"
          onClick={() => navigate('/')}
          onMouseEnter={() => setIsHoveringTitle(true)}
          onMouseLeave={() => setIsHoveringTitle(false)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.img 
            src={logo} 
            alt="SoftSell Logo" 
            className="h-8 w-8 sm:h-10 sm:w-10 object-contain"
            animate={{ 
              rotate: isHoveringTitle ? [0, 15, -15, 0] : 0,
              scale: isHoveringTitle ? [1, 1.1, 1] : 1
            }}
            transition={{ duration: 0.5 }}
          />
          <div className="flex flex-col">
            <motion.span 
              className="text-xl sm:text-2xl font-bold text-white tracking-tight"
              animate={isHoveringTitle ? { x: [0, 3, -3, 0] } : {}}
              transition={{ duration: 0.4 }}
            >
              SoftSell
            </motion.span>
            <span className="text-[10px] sm:text-xs text-blue-200 font-medium">
              License Marketplace
            </span>
          </div>
        </motion.div>

        {/* Right Profile */}
        <div className="relative">
          <motion.button
            onClick={toggleDropdown}
            onMouseEnter={() => setIsHoveringProfile(true)}
            onMouseLeave={() => setIsHoveringProfile(false)}
            className="flex items-center gap-2 group relative"
            aria-label="User menu"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div 
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-semibold overflow-hidden"
              animate={{
                scale: isHoveringProfile ? 1.1 : 1,
                backgroundColor: isHoveringProfile ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.2)',
              }}
              transition={{ duration: 0.2 }}
            >
              {userInfo?.avatar ? (
                <img src={userInfo.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </motion.div>

            {!isMobile && (
              <motion.div 
                className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-indigo-800"
                animate={{
                  scale: isHoveringProfile ? [1, 1.3, 1] : 1,
                  opacity: dropdownOpen ? 1 : isHoveringProfile ? 1 : 0.8
                }}
                transition={{ duration: 0.3 }}
              />
            )}

            {isMobile && (
              <motion.div
                animate={{ rotate: dropdownOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {dropdownOpen ? (
                  <ChevronUp className="w-4 h-4 text-white" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-white" />
                )}
              </motion.div>
            )}
          </motion.button>

          {/* Dropdown */}
          <AnimatePresence>
            {dropdownOpen && userInfo && (
              <motion.div 
                className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={dropdownVariants}
                transition={{ duration: 0.2 }}
              >
                {/* User Info */}
                <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
                  <div className="flex items-center gap-3">
                    <motion.div 
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg shadow-inner overflow-hidden"
                      whileHover={{ rotate: 5 }}
                    >
                      {userInfo.avatar ? (
                        <img src={userInfo.avatar} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-5 h-5" />
                      )}
                    </motion.div>
                    <div className="overflow-hidden">
                      <p className="font-semibold text-gray-800 truncate">{userInfo.name}</p>
                      <p className="text-xs text-gray-500 truncate">{userInfo.email}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-2 space-y-1">
                  <motion.button
                    onClick={() => {
                      setShowEditModal(true);
                      setDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Settings className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">Edit Profile</span>
                  </motion.button>

                  <motion.button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <LogOut className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">Logout</span>
                  </motion.button>
                </div>

                {/* Role Badge */}
                <motion.div 
                  className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex justify-center"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${getRoleBadgeColor()} shadow-sm`}>
                    <span className="text-xs font-semibold uppercase tracking-wider truncate">
                      {getRoleDisplayText()}
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Edit Profile Modal */}
      <EditProfileModal isOpen={showEditModal} onClose={() => setShowEditModal(false)} />
    </>
  );
};

export default Navbar;