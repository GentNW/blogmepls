import { configureStore } from "@reduxjs/toolkit"
import { apiSlice } from "./api/apiSlice"
import { apiSlicenoauth } from "./api/noAuthApiSlice"
import { setupListeners } from "@reduxjs/toolkit/query"
import authReducer from '../features/auth/authSlice'
export const Store = configureStore({
  reducer: { 
    [apiSlicenoauth.reducerPath]: apiSlicenoauth.reducer, 
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
  },
  middleware: getDefaultMiddleware => 
    getDefaultMiddleware()
    .concat(apiSlice.middleware),
    
    devTools: false
})

setupListeners(Store.dispatch)