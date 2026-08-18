import {useState} from "react"
import {Link,useNavigate} from "react-router-dom"
import {ArrowRight,BriefcaseBusiness,Eye,EyeOff,LockKeyhole,Mail} from "lucide-react"
import API from "../config/api"
export default function Login(){
const navigate=useNavigate()
const [email,setEmail]=useState("")
const [password,setPassword]=useState("")
const [showPassword,setShowPassword]=useState(false)
const [loading,setLoading]=useState(false)
const [error,setError]=useState("")
const handleSubmit=async e=>{
e.preventDefault()
setLoading(true)
setError("")
try{
const res=await fetch(`${API}/auth/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,password})})
const data=await res.json()
if(!res.ok)throw new Error(data.error||"Unable to sign in")
localStorage.setItem("token",data.token)
navigate("/",{replace:true})
}catch(error){
setError(error.message)
}finally{
setLoading(false)
}
}
return <div className="auth-page"><section className="auth-brand-panel"><div className="auth-brand"><div className="auth-logo">CR</div><span>Career Resilience</span></div><div className="auth-brand-content"><span className="auth-eyebrow">CAREER DEVELOPMENT PLATFORM</span><h1>Build skills for the career that's next.</h1><p>Understand your career readiness, identify skill gaps, and follow a personalized roadmap toward your next opportunity.</p><div className="auth-feature"><BriefcaseBusiness size={18}/><div><strong>Career intelligence</strong><span>Compare your skills against high-growth career paths.</span></div></div><div className="auth-preview"><div><span>Career readiness</span><strong>71%</strong></div><div className="auth-preview-bar"><span/></div><small>9 required skills matched</small></div></div><div className="auth-brand-footer">Career Resilience · Professional Development</div></section><section className="auth-form-panel"><div className="auth-form-wrapper"><div className="auth-mobile-logo"><div className="auth-logo">CR</div><span>Career Resilience</span></div><div className="auth-form-heading"><span className="eyebrow">WELCOME BACK</span><h2>Sign in to your account</h2><p>Continue building your career development plan.</p></div>{error&&<div className="auth-error">{error}</div>}<form onSubmit={handleSubmit} className="auth-form"><div className="auth-field"><label>Email address</label><div className="auth-input"><Mail size={17}/><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" required autoComplete="email"/></div></div><div className="auth-field"><div className="auth-label-row"><label>Password</label></div><div className="auth-input"><LockKeyhole size={17}/><input type={showPassword?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter your password" required autoComplete="current-password"/><button type="button" onClick={()=>setShowPassword(!showPassword)}>{showPassword?<EyeOff size={17}/>:<Eye size={17}/>}</button></div></div><button type="submit" className="auth-submit" disabled={loading}>{loading?"Signing in...":<>Sign in <ArrowRight size={17}/></>}</button></form><p className="auth-switch">Don't have an account? <Link to="/register">Create account</Link></p></div></section></div>
}