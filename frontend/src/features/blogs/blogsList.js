import React from 'react'
import { useGetBlogsQuery } from './blogsApiSlice'
import Blog  from './Blog'
import useAuth from '../../hooks/useAuth'
const BlogsList = () => {

  const { username, isBlogger, isAdmin} = useAuth()

  const {
    data: blogs,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetBlogsQuery('blogsList',
    {
      pollingInterval: 15000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true
    }
  )

  let content
  
  if(isLoading) content = <p>Loading...</p>
  
  if(isError){
    content = <p className={isError ? "errmsg" : "offscreen"}>{error?.data?.message}</p>
  }

  if(isSuccess){
    const { ids, entities } = blogs

    let filteredIds
    if(isBlogger||isAdmin){
      filteredIds = [...ids]
    } else{
      filteredIds = ids.filter(blogId => entities[blogId].username === username)
    }


    const tableContent = ids?.length && filteredIds.map(blogId => <Blog key={blogId} blogId={blogId}/>)
    content = (
      <table className='table-blogs table--blog.blogs'>
        <thead className="table__thead">
          <tr>
            <th scope='col' className='table__th blog__blogName'>Blog-Title</th>
            {/*<th scope='col' className='table__th blog__roles'>Title</th>*/}
            <th scope='col' className='table__th blog__created'>Created</th>
            <th scope='col' className='table__th blog__updated'>Updated</th>
            <th scope='col' className='table__th blog__edit'>Edit</th>
          </tr>
        </thead>
        <tbody>
          {tableContent}
        </tbody>
      </table>
    )
  }

  return content
}

export default BlogsList
