import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../slices/authSlice'
import { closeAuthModal } from '../slices/uiSlice'
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import { ClipLoader } from 'react-spinners'

const LoginForm = ({ toggleForm }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { clickedRole } = useSelector((state) => state.ui)
  const { userInfo, loading, error } = useSelector((state) => state.auth)

  useEffect(() => {
    if (userInfo) {
      dispatch(closeAuthModal())
      // Navigate based on original intent
      if (clickedRole === 'seller') navigate('/seller')
      else navigate('/buyer')
    }
  }, [userInfo, clickedRole, dispatch, navigate])

  const handleSubmit = (e) => {
    e.preventDefault()
    // Convert 'buyer' click to 'user' role (matches backend)
    const expectedRole = clickedRole === 'buyer' ? 'user' : clickedRole
    dispatch(loginUser({ email, password, expectedRole }))
  }

  return (
    <div className="max-w-md w-full mx-4 sm:mx-auto bg-white rounded-lg shadow-lg overflow-hidden p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Welcome Back</h2>
        <p className="text-gray-500 mt-2">
          Sign in to your {clickedRole === 'seller' ? 'seller account' : 'account'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ${
            isHovered ? 'bg-indigo-700' : 'bg-indigo-600'
          }`}
          disabled={loading}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {loading ? (
            <>
              <ClipLoader size={18} color="#ffffff" className="mr-2" />
              Signing in...
            </>
          ) : (
            'Sign in'
          )}
        </button>

        <div className="text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <button
            type="button"
            className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none"
            onClick={toggleForm}
          >
            Sign up
          </button>
        </div>
      </form>
    </div>
  )
}

export default LoginForm