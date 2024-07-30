import{
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit"

import { apiSlice } from "../../app/api/apiSlice"

const blogsAdapter = createEntityAdapter({})

const initialState = blogsAdapter.getInitialState()

export const blogsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getBlogs: builder.query({
            query: () => ({
                url: '/blogs',
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            transformResponse: responseData => {
                const loadedBlogs = responseData.map(blog => {
                    blog.id = blog._id
                    return blog
                });
                return blogsAdapter.setAll(initialState,loadedBlogs)
                
            },
            providesTags:(result,error,arg) => {
                if(result?.ids){
                    return [
                        {type:'blog', id:'LIST'},
                        result.ids.map(id => ({ type:'blog', id}))
                    ]
                } else return [{ type: 'blog',id: 'LIST'}]
            }
        }),
        
        AddNewBlogs: builder.mutation({
                query: initialBlogData =>({
                    url: '/blogs',
                    method:'POST',
                    body: {
                        ...initialBlogData
                    }
                }),
                invalidatesTags:[
                    { type: 'Blog', id: "LIST"}
                ]
        }),

        UpdateBlog: builder.mutation({
            query: initialBlogData =>({
                url: '/blogs',
                method:'PATCH',
                body: {
                    ...initialBlogData
                }
            }),
            invalidatesTags:(result,error,arg) => [
                { type: 'Blog', id: arg.id}
            ]
        }),
        
        DeleteBlog: builder.mutation({
            query: ({ id }) =>({
                url: '/blogs',
                method:'DELETE',
                body: { id }
            }),
            invalidatesTags:(result,error,arg) => [
                { type: 'Blog', id: arg.id}
            ]
        })
    }),
})

export const {
    useGetBlogsQuery,
    useAddNewBlogsMutation,
    useUpdateBlogMutation,
    useDeleteBlogMutation,
} = blogsApiSlice

// returns the query result object
export const selectBlogResult =blogsApiSlice.endpoints.getBlogs.select()

// creates memoized selector 
const selectBlogsData = createSelector(
    selectBlogResult,
    blogsResult => blogsResult.data // normalized state object with ids entity 
)

// getSelectors creates these selectors and we rename them with aliases using destructuring 
export const {
    selectAll: selectAllBlogs,
    selectById: selectBlogById,
    selectIds: selectBlogIds
    // Pass in a selector that returns the blogs slice of state
} = blogsAdapter.getSelectors(state => selectBlogsData(state) ?? initialState)