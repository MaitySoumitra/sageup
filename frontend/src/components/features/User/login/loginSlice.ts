// loginSlice.ts (Updated)
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// --- INTERFACE DEFINITIONS ---

// NOTE: Adjusted role for consistency with registration
interface UserProfile {
    name: string,
    email: string,
    role: "admin" | "tutor" | "student" | "institute", // Added institute for completeness
    lastLogin: number | null
}

// Define the shape of the successful API response payload
interface LoginSuccessPayload {
    user: UserProfile;
    // 🎯 NEW: Assuming the backend returns the JWT token here
    token: string; 
    redirectTo: string;
    message: string;
}

interface AuthState {
    user: UserProfile | null,
    isAuthenticated: boolean,
    loading: 'idle' | 'pending' | 'successed' | 'failed',
    error: string | null,
    token: string | null, // 🎯 NEW: State to hold the token
    redirectTo: string | null, // Field to store the path for navigation
}

// --- INITIAL STATE ---

// 1. Initialize the token from Local Storage on application startup
const tokenFromStorage = localStorage.getItem("jwtToken");

const initialState: AuthState = {
    user: null,
    isAuthenticated: !!tokenFromStorage, // Set true if token exists
    loading: 'idle',
    error: null,
    token: tokenFromStorage, // Store the retrieved token
    redirectTo: null,
}

// --- ASYNC THUNK (loginUsers) ---

export const loginUsers = createAsyncThunk<
    LoginSuccessPayload, // Return type includes user, token, and redirectTo
    { email: string, password: string },
    { rejectValue: string }
>('auth/loginUsers', async ({ email, password }, { rejectWithValue }) => {

    try {
        const res = await axios.post("http://localhost:5000/api/users/login", {
            email,
            password,
        })
        
        // 🎯 CRITICAL: Destructure 'token' from the response data
        const { token } = res.data as LoginSuccessPayload;
        
        // 🚀 CRITICAL: Store the JWT Token in Local Storage immediately after success
        localStorage.setItem("jwtToken", token);

        // Backend should return { user: {...}, token: '...', redirectTo: '/path' }
        return res.data as LoginSuccessPayload;
    }
    catch (err: any) {
        // Clear token from storage if login failed
        localStorage.removeItem("jwtToken"); 
        return rejectWithValue(err.response?.data?.message || err.message)
    }
})

// --- REDUX SLICE ---

const loginSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setAuthState: (state, action: PayloadAction<UserProfile | null>) => {
            state.user = action.payload;
            state.isAuthenticated = !!action.payload;
            state.loading = 'idle';
            state.error = null;
            state.redirectTo = null;
        },
        logout: (state) => {
            // 🚀 CRITICAL: Remove token from Local Storage on logout
            localStorage.removeItem("jwtToken");

            state.user = null;
            state.isAuthenticated = false;
            state.loading = 'idle';
            state.error = null;
            state.token = null; // Clear token from state
            state.redirectTo = null;
        },
        clearError: (state) => {
            state.error = null
        }

    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUsers.pending, (state) => {
                state.loading = 'pending';
                state.error = null;
                state.redirectTo = null;
            })
            // 🎯 CRITICAL: Handle the fulfilled state
            .addCase(loginUsers.fulfilled, (state, action: PayloadAction<LoginSuccessPayload>) => {
                state.loading = 'successed';
                state.isAuthenticated = true
                state.user = action.payload.user;
                state.token = action.payload.token; // Store token in Redux state
                state.redirectTo = action.payload.redirectTo;
                state.error = null
            })
            // 🎯 CRITICAL: Handle the rejected state
            .addCase(loginUsers.rejected, (state, action) => {
                state.loading = 'failed';
                state.isAuthenticated = false
                state.user = null;
                state.token = null; // Ensure token is null on failure
                state.error = (action.payload as string) || 'Login failed';
                state.redirectTo = null;
            })

    }

})
export default loginSlice.reducer
export const { setAuthState, logout, clearError } = loginSlice.actions