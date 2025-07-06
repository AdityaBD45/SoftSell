import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// Get user info from localStorage if available
const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null

// 🔐 Login Thunk
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password, expectedRole }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      })

      const user = data

      // Check for role access
      const isAdmin = user.role === 'admin'
      const isSellerLogin = expectedRole === 'seller' && user.role === 'seller'
      const isBuyerLogin = expectedRole === 'user' && user.role === 'user'

      if (!(isAdmin || isSellerLogin || isBuyerLogin)) {
        return rejectWithValue(
          `You are not authorized to log in as a ${expectedRole === 'user' ? 'buyer' : expectedRole}.`
        )
      }

      localStorage.setItem('userInfo', JSON.stringify(user))
      return user
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Login failed')
    }
  }
)

// 📝 Register Thunk
// 📝 Fixed Register Thunk
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/register', userData)

      localStorage.setItem('userInfo', JSON.stringify(data))
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Registration failed')
    }
  }
)


const authSlice = createSlice({
  name: 'auth',
  initialState: {
    userInfo: userInfoFromStorage,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.userInfo = null
      localStorage.removeItem('userInfo')
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.userInfo = action.payload
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.userInfo = action.payload
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer
