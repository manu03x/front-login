import {configureStore, createSlice} from '@reduxjs/toolkit';

const authSlice = createSlice({
    name:'auth',
    initialState: { isLoggedIn: false}, 
    reducers: {
        login(state) {
            state.isLoggedIn = true
        },
        logout(state) {
            state.isLoggedIn = false
        }
    }
})

const adminSlice = createSlice({
    name: 'admin',
    initialState: { isAdmin: false },
    reducers: {
        loginAdmin(state) {
            state.isAdmin = true;
        },
        logoutAdmin(state) {
            state.isAdmin = false;
        }
    }
});
export const authActions = authSlice.actions;
export const adminActions = adminSlice.actions;

export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        admin: adminSlice.reducer
    }
})