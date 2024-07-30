import { useSelector } from 'react-redux'
import { selectAllUsers } from '../users/usersApiSlice'
import NewUserForm from './newUserForm'


const NewUser = () => {
  const users = useSelector(selectAllUsers)

  const content = users ? <NewUserForm users={users}/> : <p> Loading... </p>
  
  return content
}

export default NewUser