import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
  profile: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      // CRITICAL: Always use deep cloning to avoid reference issues
      state.user = JSON.parse(JSON.stringify(action.payload));
      state.isAuthenticated = !!action.payload;
      // Store profile data if available
      if (action.payload?.profile) {
        state.profile = action.payload.profile;
      }
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.profile = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;

const initialState = {
  user: null,
  isAuthenticated: false,
  profile: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      // CRITICAL: Always use deep cloning to avoid reference issues
      // This prevents potential issues with object mutations
      const userData = JSON.parse(JSON.stringify(action.payload));
      state.user = userData;
      state.isAuthenticated = !!action.payload;
      // Store profile data if included in payload
      state.profile = userData?.profile || null;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.profile = null;
    },
    updateProfile: (state, action) => {
      // Allow updating profile data separately
      state.profile = JSON.parse(JSON.stringify(action.payload));
      if (state.user) {
        state.user.profile = state.profile;
      }
    },
  },
});

export const { setUser, clearUser, updateProfile } = userSlice.actions;
export default userSlice.reducer;