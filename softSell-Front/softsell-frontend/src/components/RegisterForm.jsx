import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { registerUser } from '../slices/authSlice'
import { closeAuthModal } from '../slices/uiSlice'

const RegisterForm = ({ toggleForm }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [qrFile, setQrFile] = useState(null) // File object

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

      // Convert file to base64 during submit
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
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-600 font-medium text-center">{error}</div>}

      <div>
        <label className="block text-sm font-medium text-gray-700">Full Name</label>
        <input
          type="text"
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {clickedRole === 'seller' && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Upload your UPI QR Code</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setQrFile(e.target.files[0])}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
          {qrFile && (
            <img
              src={URL.createObjectURL(qrFile)}
              alt="QR Preview"
              className="mt-2 w-32 h-32 object-contain border border-dashed border-purple-300 rounded"
            />
          )}
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition"
        disabled={loading || (clickedRole === 'seller' && !qrFile)}
      >
        {loading ? 'Signing up...' : 'Sign Up'}
      </button>

      <p className="text-sm text-center text-gray-600">
        Already have an account?{' '}
        <button
          type="button"
          className="text-purple-600 font-semibold"
          onClick={toggleForm}
        >
          Login
        </button>
      </p>
    </form>
  )
}

export default RegisterForm
