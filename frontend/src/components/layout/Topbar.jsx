import {useState} from "react"
import {Search,UserRound} from "lucide-react"
import {useNavigate} from "react-router-dom"
export default function Topbar({user}){
const navigate=useNavigate()
const [search,setSearch]=useState("")
const firstName=user?.first_name||user?.firstName||"User"
const lastName=user?.last_name||user?.lastName||""
const handleSearch=e=>{
e.preventDefault()
const query=search.trim()
if(!query)return
navigate(`/careers?search=${encodeURIComponent(query)}`)
}
return <header className="topbar">
<div className="mobile-title">Career Resilience</div>
<form className="topbar-search" onSubmit={handleSearch}>
<Search size={17}/>
<input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search careers, skills or industries"/>
</form>
<div className="topbar-actions">
<button className="icon-button topbar-profile-button" onClick={()=>navigate("/profile")} aria-label="Open profile"><UserRound size={18}/></button>
<button className="user-menu user-menu-button" onClick={()=>navigate("/profile")}>
<div className="avatar">{firstName.charAt(0).toUpperCase()}</div>
<div className="user-info"><strong>{firstName} {lastName}</strong><span>View profile</span></div>
</button>
</div>
</header>
}