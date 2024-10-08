import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'


const Welcome = () => {

  const { username, isBlogger, isAdmin } = useAuth()

  const date = new Date()
  const today = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'long',timeZone:"Africa/Cairo"}).format(date)

  const content = (
    <section className='welcome'>

        <p>{today}</p>

        <h1>Welcome {username} !</h1>

        <p><Link to="/dash/blogs"> View Blogs</Link></p>

        <p><Link to="/dash/blogs/new"> Add New Blog </Link></p>


        {(isAdmin) && <p><Link to="/dash/users"> View User Settings</Link></p>}

        {(isAdmin) && <p><Link to="/dash/users/new"> Add New User</Link></p>}


    </section>
  )
  return content
}

export default Welcome
