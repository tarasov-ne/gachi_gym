import { Outlet } from 'react-router-dom'
import AdminPageNavbar from '../AdminPageNavbar/AdminPageNavbar'
import './AdminPageLayout.css'
import { useAtom } from 'jotai'
import { clientAtom } from '../../App'

export default function AdminPageLayout() {
    const [clientInfo] = useAtom(clientAtom)
    if (clientInfo.login !== 'admin' && clientInfo.password !== 'admin'){
      console.log(clientInfo.login, clientInfo.password)
        return <div>
            Error 401. You have to be admin to visit this page!
        </div>
    }

  return (
    <div className='adminPageLayout'>
      <div className='adminPageNavbarMain'>
        <AdminPageNavbar />
      </div>
      <div className='outletAdminPageLayout'>
        <Outlet />
      </div>
    </div>
  )
}
