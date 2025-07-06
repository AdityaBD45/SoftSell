import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import SellerDashboard from './pages/SellerDashboard'
import BuyerDashboard from './pages/BuyerDashboard'
import { useSelector } from 'react-redux'
import AuthModal from './components/AuthModal'
import LicenseDetails from './components/LicenseDetails'

const App = () => {
  const showModal = useSelector((state) => state.ui.showModal)

  return (
    <BrowserRouter>
      {showModal && <AuthModal />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/seller" element={<SellerDashboard />} />
        <Route path="/buyer" element={<BuyerDashboard />} />
        <Route path="/license/:id" element={<LicenseDetails />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
