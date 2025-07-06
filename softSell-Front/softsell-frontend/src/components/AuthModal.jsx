import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { closeAuthModal } from '../slices/uiSlice'

const AuthModal = () => {
  const dispatch = useDispatch()
  const { clickedRole } = useSelector((state) => state.ui)
  const [showLogin, setShowLogin] = useState(true)

  const handleClose = () => dispatch(closeAuthModal())

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
        <button onClick={handleClose} className="absolute top-3 right-3 text-gray-600 font-bold">
          ×
        </button>

        <h2 className="text-xl font-semibold text-center mb-4 text-indigo-600">
          {showLogin ? 'Login' : 'Sign Up'} as {clickedRole === 'seller' ? 'Seller' : 'Buyer'}
        </h2>

        {showLogin ? (
          <LoginForm toggleForm={() => setShowLogin(false)} />
        ) : (
          <RegisterForm toggleForm={() => setShowLogin(true)} />
        )}
      </div>
    </div>
  )
}

export default AuthModal

// Lazy import actual login/register components in next step
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
