import { createSlice } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    clickedRole: null,
    isAuthModalOpen: false,
  },
  reducers: {
    setClickedRole: (state, action) => {
      state.clickedRole = action.payload
    },
    resetClickedRole: (state) => {
      state.clickedRole = null
    },
    openAuthModal: (state) => {
      state.isAuthModalOpen = true
    },
    closeAuthModal: (state) => {
      state.isAuthModalOpen = false
    },
  },
})

export const {
  setClickedRole,
  resetClickedRole,
  openAuthModal,
  closeAuthModal,
} = uiSlice.actions

export default uiSlice.reducer
