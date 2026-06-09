import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "../services/auth.api";

export const checkAuth = createAsyncThunk("auth/checkAuth", async () => {
  const data = await authApi.getMe();
  return data.user;
});

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    const data = await authApi.login(email, password);
    if (!data.success) return rejectWithValue(data.message || "Login failed");
    const me = await authApi.getMe();
    return me.user;
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async ({ fullname, email, password }, { rejectWithValue }) => {
    const data = await authApi.register(fullname, email, password);
    if (!data.success)
      return rejectWithValue(
        data.message || data.errors?.[0]?.msg || "Registration failed"
      );
    const me = await authApi.getMe();
    return me.user;
  }
);

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  await authApi.logout();
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isLoading: true,
    isSubmitting: false,
    error: null,
  },
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // checkAuth
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.user = null;
        state.isLoading = false;
      })
      // login
      .addCase(loginUser.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isSubmitting = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload;
      })
      // register
      .addCase(registerUser.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isSubmitting = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload;
      })
      // logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
