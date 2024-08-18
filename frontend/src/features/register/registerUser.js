import { useSelector } from 'react-redux'
import { selectAllUsers } from '../register/RegisterApiSlice'
import RegisterUserForm from './registerForm'


const RegisterUser = () => {
  const users = useSelector(selectAllUsers)
  console.log("i'm here too")
  const content = users ? <RegisterUserForm users={users}/> : <p> Loading... </p>
  
  return content
}

export default RegisterUser