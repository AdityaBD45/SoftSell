import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../slices/authSlice'
import { closeAuthModal } from '../slices/uiSlice'

const LoginForm = ({ toggleForm }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

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
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="text-red-600 font-medium text-center">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
        disabled={loading}
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>

      <p className="text-sm text-center text-gray-600">
        Don’t have an account?{' '}
        <button
          type="button"
          className="text-indigo-600 font-semibold"
          onClick={toggleForm}
        >
          Sign Up
        </button>
      </p>
    </form>
  )
}

export default LoginForm
