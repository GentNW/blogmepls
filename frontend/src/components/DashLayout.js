import { Outlet } from 'react-router-dom'
import DashHeader from './DashHeader'
import DashFooter from './DashFooter'

const DashLayout = () => {
  return (
    <>
        <DashHeader/> {/* Dash will appear above every page in the site*/}
        <div className='dash-container'>
            <Outlet />
        </div>
        <DashFooter />
    </>
  )
}

export default DashLayout
