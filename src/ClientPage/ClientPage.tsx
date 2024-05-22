import { Outlet } from 'react-router-dom'
import './ClientPage.css'
import AppNavbar from '../AppNavbar/AppNavbar'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function ClientPage() {
  return (
        <div className='appLayout'>
            <div className='appLayoutNavbar'>
                <AppNavbar/>
            </div>
            <div className='appOutletWrapper' style={{flexGrow: 9, overflowY: 'scroll'}}>
                <Outlet/>
            </div>
            <ToastContainer/>
        </div>
        
    
  )
}
