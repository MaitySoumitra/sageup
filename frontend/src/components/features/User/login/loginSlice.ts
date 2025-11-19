import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface UserProfile {
    name: string,
    email: string,
    role: "admin" | "teacher" | "student",
    lastLogin: number | null
}

interface AuthState {
    user: UserProfile | null,
    isAuthenticated: boolean,
    loading: 'idle' | 'pending' | 'successed' | 'failed',
    error: string | null
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    loading: 'idle',
    error: ''
}

export const loginUsers = createAsyncThunk('auth/loginUsers', async ({ email, password }: { email: string, password: string }, { rejectWithValue }) => {


    try {
        const res = await axios.post("http://localhost:5000/api/users/login", {
            email,
            password,
        })
        return res.data.user
    }
    catch (err: any) {
        return rejectWithValue(err.response?.data?.message || err.message)
    }



    // try {
    //     const res = await fetch("http://localhost:3000/api/users/login", {
    //         method: "POST",
    //         headers: {
    //             'Content-Type': "application/json"
    //         },
    //         body: JSON.stringify({ email, password }),

    //     })
    //     const userProfile:UserProfile=await res.json();

    //     return userProfile
    // }
    // catch(err: any){
    //     return err.message
    // }


})

const loginSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setAuthState: (state, action:PayloadAction<UserProfile | null>) => {
            state.user = action.payload;
            state.isAuthenticated = !!action.payload;
            state.loading = 'idle';
            state.error = null;

        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.loading = 'idle';
            state.error = null
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
            })
            .addCase(loginUsers.fulfilled, (state, action:PayloadAction<UserProfile>) => {
                state.loading = 'successed';
                state.isAuthenticated = true
                state.user = action.payload;
                state.error = null
            })
            .addCase(loginUsers.rejected, (state, action) => {
                state.loading = 'failed';
                state.isAuthenticated = false
                state.user = null;
                state.error = (action.payload as string) || 'Login failed';
            })

    }

})
export default loginSlice.reducer
export const {setAuthState, logout, clearError}=loginSlice.actions

