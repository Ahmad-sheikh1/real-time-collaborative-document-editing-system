import { configureStore } from '@reduxjs/toolkit'
import LoginSlice from './Slices/LoginSlice'
import SearchSlice from './Slices/SearchSlice'

const combinedReducer = {
    login: LoginSlice,
    search: SearchSlice
}

export const store = configureStore({
    reducer: combinedReducer,
})