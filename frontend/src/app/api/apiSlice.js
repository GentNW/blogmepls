import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setCredentials } from '../../features/auth/authSlice'
const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:3500',
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        //Obtaining the auth token if successful
        const token = getState().auth.token
        //console.log({token})
        //setting auth header
        if(token){
            headers.set("authorization",`Bearer ${token}`)
        }
        
        return headers
    }
})
const baseQueryWithReauth = async (args,api,extraOptions) =>{

    //console.log(args)
    //console.log(api)
    let result = await baseQuery(args,api,extraOptions)
    if(result?.error?.status === 403){
        console.log('sending Refresh token')


        const refreshResult = await baseQuery('/auth/refresh', api, extraOptions)

        if(refreshResult?.data){

            // Storing new token
            api.dispatch(setCredentials({...refreshResult.data}))

            // Retry original query with new access token
            result = await baseQuery(args, api, extraOptions)
        }else{
            if(refreshResult?.error?.status === 403){
                refreshResult.error.data.message = "Your login has expired. "
            }

            return refreshResult

        }
    }

    return result
}

export const apiSlice= createApi({
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Blog','User'],
    endpoints: builder => ({})
})