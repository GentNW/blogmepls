import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseQuerynoAuth =  fetchBaseQuery({baseUrl: 'http://localhost:3500'})

export const apiSlicenoauth= createApi({
    baseQuery: baseQuerynoAuth,
    tagTypes: ['User'],
    endpoints: builder => ({})
})