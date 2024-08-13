import { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import{ faCircleArrowUp, faCirclePlus, faFilePen, faRightFromBracket, faUserGear, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useSendLogoutMutation } from '../features/auth/authApiSlice'
import useAuth from '../hooks/useAuth'
const DASH_REGEX = /^\/dash(\/)?$/
const BLOGS_REGEX = /^\/dash\/blogs(\/)?$/
const USERS_REGEX = /^\/dash\/users(\/)?$/


const DashHeader = () => {

  const { isBlogger, isAdmin} = useAuth()

  const navigate = useNavigate()
  const { pathname } = useLocation()

  const [sendLogout,{
    isLoading,
    isSuccess,
    isError,
    error
  }] = useSendLogoutMutation()

  useEffect(() =>{
    if(isSuccess){
      navigate('/')
    }
  }, [isSuccess,navigate])

  const onLogoutClicked = async () => {
    try {
        await sendLogout().unwrap();
        // Navigate back or to a specific route after successful logout
        navigate('/'); // or navigate(-1) to go back to the previous page
    } catch (err) {
        console.error('Failed to logout', err);
    }
  }
  



  const onNewBlogClicked=() => navigate('./blogs/new')
  const onNewUserClicked=() => navigate('./users/new')
  const onBlogsClicked=() => navigate('./blogs')
  const onUsersClicked=() => navigate('./users')
  const onLoginClicked = () => navigate('/login')

  let loginButton = null
  if(pathname !== '/dash'){
    loginButton = (
        <button
            className='dash-footer__button icon-button'
            title="Login"
            onClick={onLoginClicked}
        />
    )
}
  let dashClass = null
  if(!DASH_REGEX.test(pathname) && !BLOGS_REGEX.test(pathname) && !USERS_REGEX.test(pathname)){
    dashClass = "dash-header__container--small"
  }

  let newBlogButton = null
  if(BLOGS_REGEX.test(pathname)){
    newBlogButton = (
      <button
        className='icon-button'
        title = "New Blog"
        onClick={onNewBlogClicked}
      >
        <FontAwesomeIcon icon={faCirclePlus}/>
      </button>
    )
  }

  let newUserButton = null
  if(USERS_REGEX.test(pathname)){
    newUserButton = (
      <button
        className='icon-button'
        title = "New User"
        onClick={onNewUserClicked}
      >
        <FontAwesomeIcon icon={faUserPlus}/>
      </button>
    )
  }

  let userButton = null
  if(isAdmin){
    if(!USERS_REGEX.test(pathname) && pathname.includes('/dash')){
      userButton= (
        <button
          className='icon-button'
          title='Users'
          onClick={onUsersClicked}
        >
          <FontAwesomeIcon icon={faUserGear} />
        </button>
      )
    }
  }

  let blogButton = null
  if(isBlogger || isAdmin){
    if(!BLOGS_REGEX.test(pathname) && pathname.includes('/dash')){
      blogButton= (
        <button
          className='icon-button'
          title='Blogs'
          onClick={onBlogsClicked}
        >
          <FontAwesomeIcon icon={faFilePen} />
        </button>
      )
    }
  }


  const logoutButton = (
    <button
      className='icon-button'
      title="Logout"
      onClick={onLogoutClicked}
    >
        <FontAwesomeIcon icon={faRightFromBracket}/>
    </button>
  )




  const errClass = isError ? "errmsg" : "offscreen"

  let buttonContent
  if(isLoading){
    buttonContent = <p>Loggin out...</p>
  }else{
    buttonContent = (
      <>
        {newBlogButton}
        {newUserButton}
        {userButton}
        {blogButton}
        {logoutButton}
      </>
    )
  }

  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>

      <header className='dash-header'>
          <div className={`dash-header__container ${dashClass}`}>

              <Link to="/dash">
                  <h1 className='dash-header__title'>blogmepls</h1>
              </Link>
              <nav className='dash-header__nav'>
                  {buttonContent}
              </nav>
          </div>
      </header>
    </>
  )
  return content
}

export default DashHeader
