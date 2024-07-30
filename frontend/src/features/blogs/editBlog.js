import {useParams} from 'react-router-dom'
import EditBlogForm from './editBlogForm'

import { useGetBlogsQuery } from './blogsApiSlice'
import { useGetUsersQuery } from '../users/usersApiSlice'
import useAuth from '../../hooks/useAuth'
import PulseLoader from 'react-spinners/PulseLoader'

const EditBlog = () => {
  const { id } = useParams()

  const { username, isAdmin, isBlogger} = useAuth()

  const {blog} = useGetBlogsQuery("blogsList", {
    selectFromResult: ({ data }) => ({
      blog: data?.entities[id]
    }),
  })
  const {users} = useGetUsersQuery("usersList",{
    selectFromResult: ({ data }) => ({
        users: data?.ids.map(id => data?.entities[id])
    }),
  })


  if(!blog || !users?.length){
    return <PulseLoader color={"#FFF"}/>
  }

  if(!isAdmin || !isBlogger){
    if(blog.username !== username){
      return <p className='errmsg'>No Access</p>
    }
  }
  const content = blog && users ? <EditBlogForm blog = { blog } users = {users}/> : <EditBlogForm>Loading...</EditBlogForm>

  return content
}

export default EditBlog