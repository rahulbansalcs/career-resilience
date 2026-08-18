import {useState} from "react"
import {Outlet} from "react-router-dom"
import Sidebar from "./Sidebar"
import Topbar from "./Topbar"
export default function AppLayout({user}){
const [collapsed,setCollapsed]=useState(false)
return <div className="app-shell"><Sidebar collapsed={collapsed} setCollapsed={setCollapsed}/><div className={`app-main ${collapsed?"app-main-expanded":""}`}><Topbar user={user}/><main className="page-content"><Outlet context={{user}}/></main></div></div>
}