
import NewBlogForm from './newBlogForm'
import { useGetUsersQuery } from '../users/usersApiSlice'
import PulseLoader from 'react-spinners/PulseLoader'

const NewBlog = () => {
  
  const { users } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      users: data?.ids.map(id => data?.entities[id])
    }),
  })

  if(!users?.length){
    return <PulseLoader color={"#FFF"}/>
  } 

  const content = <NewBlogForm users={users}/>
  
  return content
}

export default NewBlog