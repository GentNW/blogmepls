import { useState, useEffect } from "react"
import { useAddNewBlogsMutation } from "./blogsApiSlice"
import { useGetUsersQuery } from "../users/usersApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSave } from "@fortawesome/free-solid-svg-icons"
import useAuth from '../../hooks/useAuth'

const TITLE_REGEX = /^[A-z ]{3,20}$/
const TEXT_REGEX = /^[A-z0-9,.:!@#$%\n ]{3,1000}$/


const NewBlogForm = ({users}) => {
    const {id,username} = useAuth()
    const [AddNewBlogs, {
        isLoading,
        isSuccess,
        isError,
        error
        }] = useAddNewBlogsMutation()

    const author = id
    
    const navigate = useNavigate()
    
    
    const [userID,setUserID]= useState('')
    const [validUserID, setValidUserID] = useState(false)
    const [title, setTitle] = useState('')
    const [validTitle, setValidTitle] = useState(false)
    const [textContent, setTextContent] = useState('')
    const [validText, setValidText] = useState(false)

    //useEffect(() =>{
    //    setValidUserID(USERID_REGEX.test(userID))
    //}, [userID])

    useEffect(() =>{
        setValidTitle(TITLE_REGEX.test(title))
    }, [title])

    useEffect(() =>{
      setValidText(TEXT_REGEX.test(title))
  }, [title])
    
    useEffect(() =>{
        if(isSuccess){
            setUserID('')
            setTitle('')
            setTextContent('')
            navigate('/dash/blogs')
        }
    }, [isSuccess, navigate])

    const onTitleChange = e => setTitle(e.target.value)

    const onTextContentChange = e => setTextContent(e.target.value)


    const canSave = [validTitle,validText].every(Boolean) && !isLoading

    const onSaveUserClicked = async (e) => {
        e.preventDefault()
        if(canSave){
            console.log(id.type)
            await AddNewBlogs({author, title, textContent})
            
        }
    }
    const errClass = isError ? "errmsg" : "offscreen"
    const validUserIDClass = !validUserID ? 'form_input--incomplete' : ''
    const validTitleClass = !validTitle ? 'form_input--incomplete' : ''
    const validTextClass = !validText ? 'form_input--incomplete' : ''
    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>
            
            <form className="form" onSubmit={onSaveUserClicked}>
                <div className="form__title-row">
                    <h2>New Blog</h2>
                    <div className="form__action-buttons">
                        <button
                            className="icon-button"
                            title="Save"
                            disabled={!canSave}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                    </div>
                </div>

                <label className="form__label" htmlFor="title">Title: <span className="nowrap">[5-15 chars]</span></label>
                <input
                    className={`form_input ${validTitleClass}`}
                    author
="title"
                    name="title"
                    type="title"
                    value={title}
                    onChange={onTitleChange}
                />

                <label className="form__label" htmlFor="text">Text: <span className="nowrap">[5-15 chars incl. !@#$%]</span></label>
                <textarea
                  className={`form_input form__input--text ${validTextClass}`}
                  author
="text"
                  name="text"
                  type="text"
                  value={textContent}
                  onChange={onTextContentChange}
                />

            </form>
        </>
    )

    return content
}

export default NewBlogForm