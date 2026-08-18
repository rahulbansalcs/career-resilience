import {useState} from "react"
import {Link,useNavigate} from "react-router-dom"
import {ArrowRight,CheckCircle2,Eye,EyeOff,LockKeyhole,Mail,UserRound} from "lucide-react"
import API from "../config/api"
export default function Register(){
const navigate=useNavigate()
const [form,setForm]=useState({firstName:"",lastName:"",email:"",password:""})
const [showPassword,setShowPassword]=useState(false)
const [loading,setLoading]=useState(false)
const [error,setError]=useState("")
const update=e=>setForm({...form,[e.target.name]:e.target.value})
const handleSubmit=async e=>{
e.preventDefault()
setLoading(true)
setError("")
try{
const registerRes=await fetch(`${API}/auth/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)})
const registerData=await registerRes.json()
if(!registerRes.ok)throw new Error(registerData.error||"Unable to create account")
const loginRes=await fetch(`${API}/auth/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:form.email,password:form.password})})
const loginData=await loginRes.json()
if(!loginRes.ok)throw new Error(loginData.error||"Account created. Please sign in.")
localStorage.setItem("token",loginData.token)
navigate("/",{replace:true})
}catch(error){
setError(error.message)
}finally{
setLoading(false)
}
}
return <div className="auth-page"><section className="auth-brand-panel"><div className="auth-brand"><div className="auth-logo">CR</div><span>Career Resilience</span></div><div className="auth-brand-content"><span className="auth-eyebrow">START YOUR CAREER JOURNEY</span><h1>Turn your career goals into an actionable plan.</h1><p>Create your professional skill profile and discover what you need to learn for the roles you want.</p><div className="auth-benefits"><div><CheckCircle2 size={17}/><span>Career fit analysis</span></div><div><CheckCircle2 size={17}/><span>Skill gap identification</span></div><div><CheckCircle2 size={17}/><span>Personalized roadmaps</span></div><div><CheckCircle2 size={17}/><span>Progress tracking</span></div></div></div><div className="auth-brand-footer">Career Resilience · Professional Development</div></section><section className="auth-form-panel"><div className="auth-form-wrapper"><div className="auth-mobile-logo"><div className="auth-logo">CR</div><span>Career Resilience</span></div><div className="auth-form-heading"><span className="eyebrow">GET STARTED</span><h2>Create your account</h2><p>Start building your professional development profile.</p></div>{error&&<div className="auth-error">{error}</div>}<form onSubmit={handleSubmit} className="auth-form"><div className="auth-name-grid"><div className="auth-field"><label>First name</label><div className="auth-input"><UserRound size={17}/><input name="firstName" value={form.firstName} onChange={update} placeholder="First name" required/></div></div><div className="auth-field"><label>Last name</label><div className="auth-input"><UserRound size={17}/><input name="lastName" value={form.lastName} onChange={update} placeholder="Last name"/></div></div></div><div className="auth-field"><label>Email address</label><div className="auth-input"><Mail size={17}/><input name="email" type="email" value={form.email} onChange={update} placeholder="you@example.com" required/></div></div><div className="auth-field"><label>Password</label><div className="auth-input"><LockKeyhole size={17}/><input name="password" type={showPassword?"text":"password"} value={form.password} onChange={update} placeholder="Minimum 8 characters" minLength="8" required/><button type="button" onClick={()=>setShowPassword(!showPassword)}>{showPassword?<EyeOff size={17}/>:<Eye size={17}/>}</button></div></div><button type="submit" className="auth-submit" disabled={loading}>{loading?"Creating account...":<>Create account <ArrowRight size={17}/></>}</button></form><p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p></div></section></div>
}