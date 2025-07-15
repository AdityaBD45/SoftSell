import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { registerUser } from '../slices/authSlice'
import { closeAuthModal } from '../slices/uiSlice'
import { FiUser, FiMail, FiLock, FiUpload, FiArrowRight } from 'react-icons/fi'
import { ClipLoader } from 'react-spinners'

const RegisterForm = ({ toggleForm }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [qrFile, setQrFile] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { clickedRole } = useSelector((state) => state.ui)
  const { userInfo, loading, error } = useSelector((state) => state.auth)

  useEffect(() => {
    if (userInfo) {
      dispatch(closeAuthModal())
      navigate(clickedRole === 'seller' ? '/seller' : '/buyer')
    }
  }, [userInfo, clickedRole, dispatch, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()

    let finalQrBase64 = ''

    if (clickedRole === 'seller') {
      if (!qrFile) {
        alert('Please upload your UPI QR code before signing up as a seller.')
        return
      }

      finalQrBase64 = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.onerror = () => reject('QR Code file reading failed')
        reader.readAsDataURL(qrFile)
      })
    }

    const newUser = {
      name,
      email,
      password,
      role: clickedRole,
      ...(clickedRole === 'seller' && { qrBase64: finalQrBase64 }),
    }

    dispatch(registerUser(newUser))
  }

  return (
    <div className="max-w-md w-full mx-4 sm:mx-auto bg-white rounded-xl shadow-lg overflow-hidden p-6 sm:p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Create Your Account</h2>
        <p className="text-gray-500 mt-2">
          {clickedRole === 'seller' ? 'Set up your seller profile' : 'Join our community'}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
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
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
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
                  <FiLock className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <FiLock className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
          </div>

          {clickedRole === 'seller' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                UPI QR Code
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  {qrFile ? (
                    <div className="flex flex-col items-center">
                      <img
                        src={URL.createObjectURL(qrFile)}
                        alt="QR Preview"
                        className="w-40 h-40 object-contain mb-2"
                      />
                      <button
                        type="button"
                        onClick={() => setQrFile(null)}
                        className="text-sm text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-center">
                        <FiUpload className="h-12 w-12 text-gray-400" />
                      </div>
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="qr-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none"
                        >
                          <span>Upload a file</span>
                          <input
                            id="qr-upload"
                            name="qr-upload"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setQrFile(e.target.files[0])}
                            className="sr-only"
                            required
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG up to 5MB
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 ${
            isHovered ? 'bg-purple-700' : 'bg-purple-600'
          } ${loading || (clickedRole === 'seller' && !qrFile) ? 'opacity-70 cursor-not-allowed' : ''}`}
          disabled={loading || (clickedRole === 'seller' && !qrFile)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {loading ? (
            <>
              <ClipLoader size={18} color="#ffffff" className="mr-2" />
              Creating account...
            </>
          ) : (
            <>
              Get Started <FiArrowRight className="ml-2" />
            </>
          )}
        </button>

        <div className="text-center text-sm text-gray-500">
          Already have an account?{' '}
          <button
            type="button"
            className="font-medium text-purple-600 hover:text-purple-500 focus:outline-none"
            onClick={toggleForm}
          >
            Sign in
          </button>
        </div>
      </form>
    </div>
  )
}

export default RegisterForm