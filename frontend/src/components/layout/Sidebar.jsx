import {NavLink,useNavigate} from "react-router-dom"
import {LayoutDashboard,Compass,BrainCircuit,Map,UserRound,LogOut,ChevronLeft,ChevronRight} from "lucide-react"
export default function Sidebar({collapsed,setCollapsed}){
const navigate=useNavigate()
const links=[{to:"/",label:"Dashboard",icon:LayoutDashboard},{to:"/careers",label:"Career Explorer",icon:Compass},{to:"/skills",label:"My Skills",icon:BrainCircuit},{to:"/roadmaps",label:"Roadmaps",icon:Map},{to:"/profile",label:"Profile",icon:UserRound}]
const logout=()=>{
localStorage.removeItem("token")
navigate("/login",{replace:true})
}
return <aside className={`sidebar ${collapsed?"sidebar-collapsed":""}`}>
<div className="sidebar-brand"><div className="brand-mark">CR</div>{!collapsed&&<div><div className="brand-name">Career Resilience</div><div className="brand-subtitle">Career Development</div></div>}</div>
<nav className="sidebar-nav">{links.map(({to,label,icon:Icon})=><NavLink key={to} to={to} end={to==="/"} className={({isActive})=>`nav-item ${isActive?"nav-item-active":""}`}><Icon size={19}/>{!collapsed&&<span>{label}</span>}</NavLink>)}</nav>
<div className="sidebar-bottom"><button className="nav-item sidebar-action" onClick={logout}><LogOut size={19}/>{!collapsed&&<span>Sign out</span>}</button><button className="collapse-button" onClick={()=>setCollapsed(!collapsed)}>{collapsed?<ChevronRight size={18}/>:<ChevronLeft size={18}/>}</button></div>
</aside>
}