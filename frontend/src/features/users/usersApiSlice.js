import{
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit"

import { apiSlice } from "../../app/api/apiSlice"

const usersAdapter = createEntityAdapter({})

const initialState = usersAdapter.getInitialState()

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getUsers: builder.query({
            query: () => '/users',
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            transformResponse: responseData => {
                const loadedUsers = responseData.map(user => {
                    user.id = user._id
                    return user
                });
                return usersAdapter.setAll(initialState,loadedUsers)
                
            },
            providesTags:(result,error,arg) => {
                if(result?.ids){
                    return [
                        {type:'User', id:'LIST'},
                        result.ids.map(id => ({ type:'User', id}))
                    ]
                } else return [{ type: 'User',id: 'LIST'}]
            }
        }),

        AddNewUsers: builder.mutation({
                query: initialUserData =>({
                    url: '/users',
                    method:'POST',
                    body: {
                        ...initialUserData
                    }
                }),
                invalidatesTags:[
                    { type: 'User', id: "LIST"}
                ]
        }),

        UpdateUser: builder.mutation({
            query: initialUserData =>({
                url: '/users',
                method:'PATCH',
                body: {
                    ...initialUserData
                }
            }),
            invalidatesTags:(result,error,arg) => [
                { type: 'User', id: arg.id}
            ]
        }),
        
        DeleteUser: builder.mutation({
            query: ({ id }) =>({
                url: '/users',
                method:'DELETE',
                body: { id }
            }),
            invalidatesTags:(result,error,arg) => [
                { type: 'User', id: arg.id}
            ]
        })
    })
})
export const {
    useGetUsersQuery,
    useAddNewUsersMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
} = usersApiSlice

// returns the query result object
export const selectUserResult =usersApiSlice.endpoints.getUsers.select()

// creates memoized selector 
const selectUsersData = createSelector(
    selectUserResult,
    usersResult => usersResult.data // normalized state object with ids entity 
)

// getSelectors creates these selectors and we rename them with aliases using destructuring 
export const {
    selectAll: selectAllUsers,
    selectById: selectUserById,
    selectIds: selectUserIds
    // Pass in a selector that returns the users slice of state
} = usersAdapter.getSelectors(state => selectUsersData(state) ?? initialState)