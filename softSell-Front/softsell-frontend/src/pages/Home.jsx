import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setClickedRole, openAuthModal } from '../slices/uiSlice'
import AuthModal from '../components/AuthModal'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { motion } from 'framer-motion'

const Home = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthModalOpen } = useSelector((state) => state.ui)
  const { userInfo } = useSelector((state) => state.auth)

  useEffect(() => {
    if (userInfo) {
      if (userInfo.role === 'seller') {
        navigate('/seller', { replace: true })
      } else if (userInfo.role === 'user') {
        navigate('/buyer', { replace: true })
      } else if (userInfo.role === 'admin') {
        navigate('/seller', { replace: true })
      }
    }
  }, [userInfo, navigate])

  const handleClick = (role) => {
    dispatch(setClickedRole(role))
    dispatch(openAuthModal())
  }

  return (
    <Layout>
      <main className="relative min-h-screen w-full overflow-hidden">
        {/* Blurred + Dimmed Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center z-0 blur-md opacity-50"
          style={{ backgroundImage: "url('/bg.png')" }}
          aria-hidden="true"
        ></div>

        {/* Main Content Layer */}
        <div className="relative z-10">
          {/* Hero Section */}
          <div className="flex flex-col items-center justify-center text-center py-20 px-4">
            <h1 className="text-5xl font-extrabold text-gray-900 mb-4 drop-shadow">Welcome to <span className="text-indigo-600">SoftSell</span> 👋</h1>
            <p className="text-gray-800 max-w-xl mb-8 text-xl font-medium">
              Rent, sublet, or resell your unused software licenses legally and easily.
            </p>
            <div className="flex gap-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleClick('seller')}
                className="bg-indigo-600 text-white px-8 py-3 rounded-full shadow-lg hover:bg-indigo-700 transition"
              >
                I’m a Seller
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleClick('user')}
                className="bg-blue-600 text-white px-8 py-3 rounded-full shadow-lg hover:bg-blue-700 transition"
              >
                I’m a Buyer
              </motion.button>
            </div>
          </div>

          {/* How It Works Section */}
          <section className="px-6 py-16 bg-white/90 backdrop-blur-sm rounded-t-3xl shadow-inner">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-8">How <span className="text-indigo-600">SoftSell</span> Works</h2>

            {/* For Sellers */}
            <h3 className="text-2xl font-bold text-indigo-700 mt-10 mb-6 text-center">🧑‍💻 For Sellers</h3>
            <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto mb-12">
              {["📝 Submit", "🔍 Verification", "🛒 Listed for Sale", "💸 Get Paid"].map((title, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-white to-indigo-100 rounded-2xl p-6 shadow-2xl hover:shadow-indigo-300 transition-all"
                >
                  <h4 className="text-xl font-bold mb-3">{title}</h4>
                  <p className="text-gray-600 text-base">
                    {[
                      "Securely submit your license credentials and UPI QR code.",
                      "Admin reviews and approves your license with pricing.",
                      "Your license is visible to buyers and ready for purchase.",
                      "After the license expires, payment is securely sent to you."
                    ][idx]}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* For Buyers */}
            <h3 className="text-2xl font-bold text-blue-700 mb-6 text-center">🛍️ For Buyers</h3>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
              {["🔎 Browse Licenses", "📤 Make Payment", "🔑 Get Access"].map((title, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-white to-blue-100 rounded-2xl p-6 shadow-2xl hover:shadow-blue-300 transition-all"
                >
                  <h4 className="text-xl font-bold mb-3">{title}</h4>
                  <p className="text-gray-600 text-base">
                    {[
                      "Explore verified licenses at cheaper prices – Netflix, Windows, etc.",
                      "Pay via UPI and upload your payment screenshot for admin review.",
                      "After approval, access license credentials until the expiry date."
                    ][idx]}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Trust Section */}
            <div className="max-w-3xl mx-auto mt-12 text-center bg-gradient-to-r from-green-50 to-green-100 border border-green-200 p-8 rounded-2xl shadow-xl">
              <h4 className="text-xl font-bold text-green-700 mb-3">🔒 Why You Can Trust Us</h4>
              <p className="text-gray-700 text-base font-medium">
                Your credentials are encrypted and only visible to our trusted admin for manual review. 
                We never share or misuse any data. Every listing is manually verified to ensure buyer and seller safety.
              </p>
            </div>
          </section>
        </div>

        {isAuthModalOpen && <AuthModal />}
      </main>
    </Layout>
  )
}

export default Home
