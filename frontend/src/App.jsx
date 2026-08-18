import {useEffect,useState} from "react"
import {BrowserRouter,Routes,Route,Navigate} from "react-router-dom"
import "./App.css"
import AppLayout from "./components/layout/AppLayout"
import Dashboard from "./pages/Dashboard"
import Careers from "./pages/Careers"
import Skills from "./pages/Skills"
import Roadmaps from "./pages/Roadmaps"
import Profile from "./pages/Profile"
import Login from "./pages/Login"
import Register from "./pages/Register"
import API from "./config/api"

function ProtectedApp(){
const [user,setUser]=useState(null)
const [loading,setLoading]=useState(true)
const token=localStorage.getItem("token")
useEffect(()=>{
if(!token){
setLoading(false)
return
}
fetch(`${API}/auth/me`,{headers:{Authorization:`Bearer ${token}`}}).then(res=>{
if(!res.ok)throw new Error("AUTH_FAILED")
return res.json()
}).then(data=>setUser(data.user)).catch(()=>{
localStorage.removeItem("token")
setUser(null)
}).finally(()=>setLoading(false))
},[])
if(loading)return <div className="app-loading"><div className="loading-spinner"/><span>Loading Career Resilience...</span></div>
if(!token||!user)return <Navigate to="/login" replace/>
return <AppLayout user={user}/>
}
function PublicOnly({children}){
const token=localStorage.getItem("token")
return token?<Navigate to="/" replace/>:children
}
export default function App(){
return <BrowserRouter><Routes><Route path="/login" element={<PublicOnly><Login/></PublicOnly>}/><Route path="/register" element={<PublicOnly><Register/></PublicOnly>}/><Route element={<ProtectedApp/>}><Route path="/" element={<Dashboard/>}/><Route path="/careers" element={<Careers/>}/><Route path="/skills" element={<Skills/>}/><Route path="/roadmaps" element={<Roadmaps/>}/><Route path="/profile" element={<Profile/>}/></Route><Route path="*" element={<Navigate to="/" replace/>}/></Routes></BrowserRouter>
}