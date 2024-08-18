

import { apiSlicenoauth } from "../../app/api/noAuthApiSlice"

export const RegisterApiSlice = apiSlicenoauth.injectEndpoints({
    endpoints: builder => ({
        AddNewUsers: builder.mutation({
                query: initialUserData =>({
                    url: '/register',
                    method:'POST',
                    body: {
                        ...initialUserData
                    }
                }),
                invalidatesTags:[
                    { type: 'User', id: "LIST"}
                ]
        })
    })
})
export const {
    useAddNewUsersMutation
} = RegisterApiSlice