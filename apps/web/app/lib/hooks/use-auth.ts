// apps/web/store/authSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface User {
  id: string;
  fullName: string;
  email: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isFetching: boolean;
}

const initialState: AuthState = {
  user: null,
  isFetching: true,
};

export const fetchUser = createAsyncThunk("auth/fetchUser", async () => {
  const response = await fetch("/api/auth/me", { credentials: "include" });
  if (!response.ok) throw new Error("Not authenticated");
  return response.json();
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isFetching = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isFetching = false;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.user = null;
        state.isFetching = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
