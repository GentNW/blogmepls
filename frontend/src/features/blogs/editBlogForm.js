import { useState, useEffect } from "react"
import { useUpdateBlogMutation } from "./blogsApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSave } from "@fortawesome/free-solid-svg-icons"

const TITLE_REGEX = /^[A-z]{3,20}$/
const TEXT_REGEX = /^[A-z0-9!@#$%\n]{3,1000}$/


const EditBlogForm = ({blog}) => {
    
    const [UpdateBlog, {
        isLoading,
        isSuccess,
        isError,
        error
        }] = useUpdateBlogMutation()

    const navigate = useNavigate()

    const [userID,setUserID]= useState('')
    const [validUserID, setValidUserID] = useState(false)
    const [title, setTitle] = useState(blog.title)
    const [validTitle, setValidTitle] = useState(false)
    const [textContent, setTextContent] = useState(blog.textContent)
    const [validText, setValidText] = useState(false)

    //useEffect(() =>{
    //    setValidUserID(USERID_REGEX.test(userID))
    //}, [userID])

    useEffect(() =>{
        setValidTitle(TITLE_REGEX.test(title))
    }, [title])

    useEffect(() =>{
      setValidText(TEXT_REGEX.test(textContent))
  }, [textContent])
    
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

    const onSaveBlogClicked = async (e) => {
        e.preventDefault()
        if(canSave){
            await UpdateBlog({ id:blog.id, title, textContent})
        }
    }
    const errClass = isError ? "errmsg" : "offscreen"
    //const validUserIDClass = !validUserID ? 'form_input--incomplete' : ''
    const validTitleClass = !validTitle ? 'form_input--incomplete' : ''
    const validTextClass = !validText ? 'form_input--incomplete' : ''
    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>
            
            <form className="form" onSubmit={onSaveBlogClicked}>
                <div className="form__title-row">
                    <h2>Edit Blog</h2>
                    <div className="form__action-buttons">
                        <button
                            className="icon-button"
                            title="Save"
                            disabled={!canSave}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                        <p>{validText.toString()}</p>
                    </div>
                </div>

                <label className="form__label" htmlFor="title">Title: <span className="nowrap">[5-15 chars]</span></label>
                <input
                    className={`form_input ${validTitleClass}`}
                    id="title"
                    name="title"
                    type="title"
                    value={title}
                    onChange={onTitleChange}
                />

                <label className="form__label" htmlFor="text">Text: <span className="nowrap">[5-15 chars incl. !@#$%]</span></label>
                <textarea
                  className={`form_input form__input--text ${validTextClass}`}
                  id="text"
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

export default EditBlogForm