import { useState } from 'react'
import { useSelector } from 'react-redux'

const EditProfileModal = ({ isOpen, onClose }) => {
  const { userInfo } = useSelector((state) => state.auth)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [qrFile, setQrFile] = useState(null)
  const [qrBase64, setQrBase64] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleQRUpload = (e) => {
    const file = e.target.files[0]
    setQrFile(file)

    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => setQrBase64(reader.result)
    reader.onerror = () => alert('QR Code file reading failed')
  }

  const handleSubmit = async () => {
    if (password && password !== confirmPassword) {
      alert("Passwords don't match")
      return
    }

    setLoading(true)

    try {
      const payload = {}
      if (password) payload.password = password
      if (userInfo.role === 'seller' && qrBase64) payload.qrBase64 = qrBase64

      const res = await fetch('http://localhost:5000/api/auth/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message)

      alert('Profile updated successfully')
      setPassword('')
      setConfirmPassword('')
      setQrBase64('')
      setQrFile(null)
      onClose()
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 space-y-4 relative">
        <h2 className="text-xl font-bold text-center text-blue-800">Edit Profile</h2>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-xl font-bold"
        >
          ×
        </button>

        {/* Password Input */}
        <div>
          <label className="block text-sm font-medium mb-1">New Password</label>
          <input
            type="password"
            className="w-full border border-gray-300 rounded p-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium mb-1">Confirm Password</label>
          <input
            type="password"
            className="w-full border border-gray-300 rounded p-2"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        {/* QR Upload (Seller Only) */}
        {userInfo.role === 'seller' && (
          <div>
            <label className="block text-sm font-medium mb-1">New UPI QR Code</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleQRUpload}
              className="w-full"
            />
            {qrBase64 && (
              <img
                src={qrBase64}
                alt="QR Preview"
                className="mt-2 w-32 h-32 object-contain border border-gray-300 rounded"
              />
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 text-gray-700 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 rounded bg-blue-700 text-white hover:bg-blue-800 disabled:opacity-60"
          >
            {loading ? 'Updating...' : 'Update'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditProfileModal
