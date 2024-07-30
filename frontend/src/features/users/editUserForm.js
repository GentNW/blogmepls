import { useState, useEffect } from "react"
import { useUpdateUserMutation, useDeleteUserMutation} from "./usersApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons"
import { ROLES } from "../../config/roles"

const USER_REGEX = /^[A-z]{3,20}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/

// User editing form

const EditUserForm = ({ user }) => {
    
    // mutation states when updating user information
    const [updateUser,{
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateUserMutation()

    // mutation states when deleting user information
    const [deleteUser,{
        isSuccess:isDelSuccess,
        isError:isDelError,
        error:delError
    }] = useDeleteUserMutation()

    const navigate = useNavigate()

    // Use state hook for value assignment/update
    const [username,setUsername]= useState(user.username)
    const [validUsername, setValidUsername] = useState(false)
    const [password, setPassword] = useState('')
    const [validPassword, setValidPassword] = useState(false)
    const [roles, setRoles] = useState(user.roles)

    useEffect(() =>{
        setValidUsername(USER_REGEX.test(username))
    }, [username])

    useEffect(() =>{
        setValidPassword(PWD_REGEX.test(password))
    }, [password])

    useEffect(() =>{
        if(isSuccess || isDelSuccess){
            setUsername('')
            setPassword('')
            setRoles([])
            navigate('/dash/users')
        }
    }, [isSuccess,isDelSuccess,navigate])

    const onUsernameChanged = e => setUsername(e.target.value)
    const onPasswordChange = e => setPassword(e.target.value)

    const onRolesChanged = e => {
        const values = Array.from(
            e.target.selectedOptions, //HTML Collection
            (option) => option.value
        )
        setRoles(values)
    }

    

    const onSaveUserClicked = async (e) => {
        if(password){
            await updateUser({ id: user.id,username,password, roles })
        } else{
            await updateUser({id:user.id,username,roles})
            
        }
    }

    const onDeleteUserClick = async () => {
        await deleteUser({ id: user.id})
    }

    const options = Object.values(ROLES).map(role => {
        return(
            <option 
                key={role}
                value={role}
            >
                {role}
            </option> 
        )
    })

    let canSave

    if (password){
        canSave = [roles.length, validUsername, validPassword].every(Boolean) && !isLoading
    }else{
        canSave = [roles.length,validUsername].every(Boolean) && !isLoading
    }
    const errClass = (isError || isDelError) ? "errmsg" : "offscreen"
    const validUsernameClass = !validUsername ? 'form_input--incomplete' : ''
    const validPasswordClass = password && !validPassword ? 'form_input--incomplete' : ''
    const validRolesClass = !Boolean(roles.length) ? 'form_input--incomplete' : ''

    const errContent = (error?.data?.message || delError?.data?.message) ?? ''

    const content = (
        <>
            <p className={errClass}>{errContent}</p>
            
            <form className="form" onSubmit={onSaveUserClicked}>
                <div className="form__title-row">
                    <h2>Edit User</h2>
                    <div className="form__action-buttons">
                        <button
                            className="icon-button"
                            title="Save"
                            onClick={onSaveUserClicked}
                            disabled = {!canSave}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                        <button
                            className="icon-button"
                            title="Delete"
                            onClick={onDeleteUserClick}
                        >
                            <FontAwesomeIcon icon={faTrashCan}/>

                        </button>
                    </div>
                </div>
                <label className="form__label" htmlFor="username">Username: <span className="nowrap">[3-20 letters]</span></label>
                <input
                    className={`form_input ${validUsernameClass}`}
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="off"
                    value={username}
                    onChange={onUsernameChanged}
                />

                <label className="form__label" htmlFor="password">Password: <span className="nowrap">[Empty = No change] [5-15 chars incl. !@#$%]</span></label>
                <input
                    className={`form_input ${validPasswordClass}`}
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={onPasswordChange}
                />

                <label className="form__label" htmlFor="roles">
                    ASSIGNED ROLES:
                </label>
                <select
                    id="roles"
                    name="roles"
                    className={`form__select ${validRolesClass}`}
                    multiple={true}
                    size="3"
                    value={roles}
                    onChange={onRolesChanged}
                >
                    {options}
                </select>
                
            </form>
        </>
    )

    return content
}

export default EditUserForm