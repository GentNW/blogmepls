import { useSelector } from 'react-redux'
import {selectCurrentToken} from '../features/auth/authSlice'
import {jwtDecode} from 'jwt-decode'

 

const useAuth = () => {
    const token = useSelector(selectCurrentToken)
    let isBlogger = false
    let isAdmin = false
    let status = "Blogger"
    
    if(token){
        const decoded = jwtDecode(token)
        const {username, roles } = decoded.UserInfo

        isBlogger = roles.includes('Blogger')
        isAdmin = roles.includes('Admin')

        if(isBlogger) status = "Blogger"
        if(isAdmin) status = "Admin"


        return {username,roles,status, isBlogger, isAdmin}
    }

    return {username:'',roles: [],isBlogger,isAdmin,status }
}
export default useAuth