import {Route,Routes} from 'react-router-dom'
import Layout from './components/Layout'
import Public from './components/Public'
import Login from './features/auth/Login'
import DashLayout from './components/DashLayout'
import Welcome from './features/auth/Welcome'
import BlogsList from './features/blogs/blogsList'
import UsersList from './features/users/usersList'
import EditUser from './features/users/editUser'
import NewUserForm from './features/users/newUserForm'
import EditBlog from './features/blogs/editBlog'
import NewBlog from './features/blogs/newBlog'
import Prefetch from './features/auth/prefetch'
import PersistLogin from './features/auth/persistLogin'
import { ROLES } from './config/roles'
import RequireAuth from './features/auth/requireAuth'
import useTitle from './hooks/useTitle'

function App() {
  useTitle('blogmepls')
  return (
    <Routes>  
      <Route path="/" element={<Layout/>}>
        {/* Public Routes */} 
        <Route index element={<Public />}/>
        {/* Login page */}
        
        <Route path="login" element={<Login />}/>
          {/* Protected Routes */}
          <Route element={<PersistLogin/>}>
            <Route element={<RequireAuth allowedRoles={[...Object.values(ROLES)]}/>}> 
              <Route element={<Prefetch/>}>
              
                <Route path = "dash" element={<DashLayout />}>
                useTitle('Home')
                  <Route index element={<Welcome />}/>

                  <Route element={<RequireAuth allowedRoles={[ROLES.Admin]}/>}>
                    {/* User display */}
                    <Route path = "users">

                      <Route index element={<UsersList />}/>
                      {/* User edit */}
                      <Route path = ":id" element= {<EditUser/>}/>
                      {/* User creation */}
                      <Route path = "new" element= {<NewUserForm/>}/>


                    </Route> {/* End user */}
                  </Route>
                  <Route element={<RequireAuth allowedRoles={[ROLES.Admin,ROLES.Blogger]}/>}>
                    {/* Blogs display */}
                    <Route path = "blogs">
                      
                      <Route index element={<BlogsList />}/>
                      {/* Blog edit */}
                      <Route path = ":id" element= {<EditBlog/>}/>
                      {/* Blogs creation */}
                      <Route path = "new" element= {<NewBlog/>}/>

                    </Route> {/* End blogs */}
                  </Route>
                  
                  
                </Route>{/* End dash */}
                </Route>
              </Route>{/* End Prefetch */}
            </Route> {/* end PersistLogin && end protected routes*/}
      {/**/}</Route>{/**/}{/* End layout */}
    </Routes>//End
  );
}

export default App;
