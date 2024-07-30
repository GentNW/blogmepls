
import { useParams } from "react-router-dom"
import EditUserForm  from "./editUserForm"
import { useGetUsersQuery } from './usersApiSlice'
import PulseLoader from 'react-spinners/PulseLoader'

// User editing information
const EditUser = () => {
    const{ id } = useParams()
    
    const { user } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            user:data?.entities[id]
        }),
    })

    if(!user){
        return <PulseLoader color={"#FFF"} />
    }

    const content = user ? <EditUserForm user={user}/> : <p>Loading...</p>
    return content
}

export default EditUser