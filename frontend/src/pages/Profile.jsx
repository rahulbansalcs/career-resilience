import {useEffect,useState} from "react"
import {CheckCircle2,ExternalLink,Code2,BriefcaseBusiness,MapPin,Save,UserRound} from "lucide-react"
import API from "../config/api"
export default function Profile(){
const [profile,setProfile]=useState({headline:"",bio:"",education:"",experienceYears:0,location:"",linkedinUrl:"",githubUrl:"",portfolioUrl:""})
const [loading,setLoading]=useState(true)
const [saving,setSaving]=useState(false)
const [error,setError]=useState("")
const [success,setSuccess]=useState("")
const token=localStorage.getItem("token")
const headers={Authorization:`Bearer ${token}`}
useEffect(()=>{
const loadProfile=async()=>{
try{
const res=await fetch(`${API}/profile`,{headers})
if(!res.ok)throw new Error("Unable to load profile")
const data=await res.json()
const p=data.profile||{}
setProfile({headline:p.headline||"",bio:p.bio||"",education:p.education||"",experienceYears:Number(p.experience_years??p.experienceYears??0),location:p.location||"",linkedinUrl:p.linkedin_url||p.linkedinUrl||"",githubUrl:p.github_url||p.githubUrl||"",portfolioUrl:p.portfolio_url||p.portfolioUrl||""})
}catch(err){
setError(err.message||"Unable to load profile")
}finally{
setLoading(false)
}
}
loadProfile()
},[])
const updateField=e=>setProfile({...profile,[e.target.name]:e.target.value})
const saveProfile=async e=>{
e.preventDefault()
setSaving(true)
setError("")
setSuccess("")
try{
const payload={headline:profile.headline||undefined,bio:profile.bio||undefined,education:profile.education||undefined,experienceYears:Number(profile.experienceYears||0),location:profile.location||undefined,linkedinUrl:profile.linkedinUrl||undefined,githubUrl:profile.githubUrl||undefined,portfolioUrl:profile.portfolioUrl||undefined}
const res=await fetch(`${API}/profile`,{method:"PUT",headers:{"Content-Type":"application/json",...headers},body:JSON.stringify(payload)})
const data=await res.json()
if(!res.ok)throw new Error(data.error||"Unable to update profile")
setSuccess("Profile updated successfully.")
}catch(err){
setError(err.message||"Unable to update profile")
}finally{
setSaving(false)
}
}
if(loading)return <div className="page-loading"><div className="loading-spinner"/><p>Loading your profile...</p></div>
return <div className="profile-page">
<section className="page-hero profile-hero">
<div>
<span className="eyebrow">PROFILE</span>
<h1>Your professional profile</h1>
<p>Manage the information that shapes your career recommendations and development plan.</p>
</div>
</section>
{error&&<div className="alert-error">{error}</div>}
{success&&<div className="skills-success"><CheckCircle2 size={16}/><span>{success}</span></div>}
<div className="profile-layout">
<aside className="profile-summary-card">
<div className="profile-avatar-large"><UserRound size={30}/></div>
<h2>{profile.headline||"Career-focused professional"}</h2>
<p>{profile.location||"Location not added"}</p>
<div className="profile-summary-meta">
<div><span>Experience</span><strong>{profile.experienceYears||0} years</strong></div>
<div><span>Education</span><strong>{profile.education||"Not added"}</strong></div>
</div>
<div className="profile-links">
{profile.linkedinUrl&&<a href={profile.linkedinUrl} target="_blank" rel="noreferrer"><BriefcaseBusiness size={16}/>LinkedIn<ExternalLink size={13}/></a>}
{profile.githubUrl&&<a href={profile.githubUrl} target="_blank" rel="noreferrer"><Code2 size={16}/>GitHub<ExternalLink size={13}/></a>}
{profile.portfolioUrl&&<a href={profile.portfolioUrl} target="_blank" rel="noreferrer"><ExternalLink size={16}/>Portfolio<ExternalLink size={13}/></a>}
</div>
</aside>
<form className="profile-form-card" onSubmit={saveProfile}>
<div className="profile-section">
<div className="profile-section-header"><div><span className="card-eyebrow">PROFESSIONAL INFORMATION</span><h2>Profile details</h2><p>Keep this information current so career recommendations stay relevant.</p></div></div>
<div className="profile-form-grid">
<div className="profile-field full"><label>Professional headline</label><input name="headline" value={profile.headline} onChange={updateField} placeholder="e.g. Full Stack Developer focused on scalable web applications"/></div>
<div className="profile-field full"><label>Bio</label><textarea name="bio" value={profile.bio} onChange={updateField} placeholder="Write a short professional summary about your background, strengths and career goals."/></div>
<div className="profile-field"><label>Education</label><input name="education" value={profile.education} onChange={updateField} placeholder="e.g. MBA in Information Technology"/></div>
<div className="profile-field"><label>Years of experience</label><input name="experienceYears" type="number" min="0" max="60" step="0.5" value={profile.experienceYears} onChange={updateField}/></div>
<div className="profile-field full"><label>Location</label><div className="profile-input-icon"><MapPin size={16}/><input name="location" value={profile.location} onChange={updateField} placeholder="e.g. Pune, Maharashtra"/></div></div>
</div>
</div>
<div className="profile-section">
<div className="profile-section-header"><div><span className="card-eyebrow">PROFESSIONAL LINKS</span><h2>Online presence</h2><p>Add links that represent your professional work and profile.</p></div></div>
<div className="profile-form-grid">
<div className="profile-field full"><label>LinkedIn</label><div className="profile-input-icon"><BriefcaseBusiness size={16}/><input name="linkedinUrl" type="url" value={profile.linkedinUrl} onChange={updateField} placeholder="https://linkedin.com/in/your-profile"/></div></div>
<div className="profile-field full"><label>GitHub</label><div className="profile-input-icon"><Code2 size={16}/><input name="githubUrl" type="url" value={profile.githubUrl} onChange={updateField} placeholder="https://github.com/your-username"/></div></div>
<div className="profile-field full"><label>Portfolio</label><div className="profile-input-icon"><ExternalLink size={16}/><input name="portfolioUrl" type="url" value={profile.portfolioUrl} onChange={updateField} placeholder="https://yourportfolio.com"/></div></div>
</div>
</div>
<div className="profile-form-footer">
<button type="submit" className="primary-button" disabled={saving}><Save size={16}/>{saving?"Saving...":"Save changes"}</button>
</div>
</form>
</div>
</div>
}