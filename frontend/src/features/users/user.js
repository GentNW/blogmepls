import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { useGetUsersQuery } from './usersApiSlice'
import { memo } from 'react'

const User = ({ userId }) => { 
    const {user} = useGetUsersQuery("userslist",{
        selectFromResult:({data}) => ({
            user: data?.entities[userId]
        }),
    })

    const navigate = useNavigate()

    if(user){
        const handleEdit = () => navigate(`/dash/users/${userId}`)
        
        const userRolesString = user.roles.toString().replaceAll(',', ',')

        const cellStatus = user.active ? '' : 'table__cell--inactive'

        return(
            <tr className='table__row user'>
                <td className={`table__cell table__username`}>{user.username}</td>
                <td className={`table__cell user__roles ${cellStatus}`}>{userRolesString}</td>
                <td className={`table__cell`}>
                    <button
                        className='icon-button table__button'
                        onClick={handleEdit}
                    >
                        <FontAwesomeIcon icon = {faPenToSquare}/>
                    </button>
                </td>
            </tr>
        )
    } else return null
}
//Avoiding unecessary component pre-renders
const memoizedUser = memo(User)
export default memoizedUser
