import {useEffect,useMemo,useState} from "react"
import {BrainCircuit,Search,Plus,X,Trash2,Pencil,Code2,Database,Server,ToolCase,CheckCircle2} from "lucide-react"
import ProgressBar from "../components/ui/ProgressBar"
import API from "../config/api"
export default function Skills(){
const [skills,setSkills]=useState([])
const [userSkills,setUserSkills]=useState([])
const [search,setSearch]=useState("")
const [category,setCategory]=useState("all")
const [loading,setLoading]=useState(true)
const [error,setError]=useState("")
const [success,setSuccess]=useState("")
const [showModal,setShowModal]=useState(false)
const [editing,setEditing]=useState(null)
const [selectedSkill,setSelectedSkill]=useState("")
const [proficiency,setProficiency]=useState(3)
const [years,setYears]=useState(0)
const [saving,setSaving]=useState(false)
const token=localStorage.getItem("token")
const headers={Authorization:`Bearer ${token}`}
const loadData=async()=>{
try{
const [skillsRes,userSkillsRes]=await Promise.all([fetch(`${API}/skills`),fetch(`${API}/profile/skills`,{headers})])
if(!skillsRes.ok||!userSkillsRes.ok)throw new Error("Unable to load skills")
const skillsData=await skillsRes.json()
const userSkillsData=await userSkillsRes.json()
setSkills(skillsData.skills||[])
setUserSkills(userSkillsData.skills||[])
}catch(err){
setError(err.message||"Unable to load skills")
}finally{
setLoading(false)
}
}
useEffect(()=>{loadData()},[])
const categories=useMemo(()=>["all",...new Set(skills.map(skill=>skill.category).filter(Boolean))],[skills])
const filteredSkills=useMemo(()=>{
const query=search.trim().toLowerCase()
return userSkills.filter(skill=>{
const matchesSearch=!query||skill.name?.toLowerCase().includes(query)||skill.category?.toLowerCase().includes(query)
const matchesCategory=category==="all"||skill.category===category
return matchesSearch&&matchesCategory
})
},[userSkills,search,category])
const averageProficiency=userSkills.length?(userSkills.reduce((sum,skill)=>sum+Number(skill.proficiency_level||0),0)/userSkills.length).toFixed(1):"0.0"
const strongestSkill=[...userSkills].sort((a,b)=>Number(b.proficiency_level||0)-Number(a.proficiency_level||0))[0]
const availableSkills=skills.filter(skill=>!userSkills.some(userSkill=>userSkill.id===skill.id))
const getCategoryIcon=categoryName=>{
if(categoryName==="Programming")return Code2
if(categoryName==="Database")return Database
if(categoryName==="Backend")return Server
return ToolCase
}
const openAdd=()=>{
setEditing(null)
setSelectedSkill("")
setProficiency(3)
setYears(0)
setShowModal(true)
setError("")
setSuccess("")
}
const openEdit=skill=>{
setEditing(skill)
setSelectedSkill(skill.id)
setProficiency(Number(skill.proficiency_level||3))
setYears(Number(skill.years_experience||0))
setShowModal(true)
setError("")
setSuccess("")
}
const closeModal=()=>{
if(saving)return
setShowModal(false)
setEditing(null)
}
const saveSkill=async e=>{
e.preventDefault()
if(!selectedSkill)return
setSaving(true)
setError("")
setSuccess("")
try{
const url=editing?`${API}/profile/skills/${editing.id}`:`${API}/profile/skills`
const method=editing?"PUT":"POST"
const body=editing?{skillId:selectedSkill,proficiencyLevel:Number(proficiency),yearsExperience:Number(years)}:{skillId:selectedSkill,proficiencyLevel:Number(proficiency),yearsExperience:Number(years)}
const res=await fetch(url,{method,headers:{"Content-Type":"application/json",...headers},body:JSON.stringify(body)})
const data=res.status===204?{}:await res.json()
if(!res.ok)throw new Error(data.error||"Unable to save skill")
await loadData()
setShowModal(false)
setEditing(null)
setSuccess(editing?"Skill updated successfully.":"Skill added successfully.")
}catch(err){
setError(err.message||"Unable to save skill")
}finally{
setSaving(false)
}
}
const deleteSkill=async skill=>{
if(!window.confirm(`Remove ${skill.name} from your profile?`))return
setError("")
setSuccess("")
try{
const res=await fetch(`${API}/profile/skills/${skill.id}`,{method:"DELETE",headers})
if(!res.ok)throw new Error("Unable to remove skill")
setUserSkills(prev=>prev.filter(item=>item.id!==skill.id))
setSuccess(`${skill.name} removed from your profile.`)
}catch(err){
setError(err.message||"Unable to remove skill")
}
}
if(loading)return <div className="page-loading"><div className="loading-spinner"/><p>Loading your skill profile...</p></div>
return <div className="skills-page">
<section className="page-hero skills-hero">
<div>
<span className="eyebrow">MY SKILLS</span>
<h1>Your technical profile</h1>
<p>Track your proficiency and experience across the skills that define your career readiness.</p>
</div>
<button className="primary-button" onClick={openAdd}><Plus size={16}/>Add skill</button>
</section>
{error&&<div className="alert-error">{error}</div>}
{success&&<div className="skills-success"><CheckCircle2 size={16}/><span>{success}</span></div>}
<section className="skills-stats">
<div className="skill-stat-card"><div className="skill-stat-icon"><BrainCircuit size={19}/></div><div><span>Skills tracked</span><strong>{userSkills.length}</strong><small>Your professional skill set</small></div></div>
<div className="skill-stat-card"><div className="skill-stat-icon purple"><TargetIcon/></div><div><span>Average proficiency</span><strong>{averageProficiency}/5</strong><small>Across all tracked skills</small></div></div>
<div className="skill-stat-card"><div className="skill-stat-icon green"><CheckCircle2 size={19}/></div><div><span>Strongest skill</span><strong>{strongestSkill?.name||"—"}</strong><small>{strongestSkill?`${strongestSkill.proficiency_level}/5 proficiency`:"Add skills to get started"}</small></div></div>
</section>
<section className="skills-toolbar">
<div className="skills-search"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search your skills..."/>{search&&<button onClick={()=>setSearch("")}><X size={15}/></button>}</div>
<select value={category} onChange={e=>setCategory(e.target.value)}>
{categories.map(item=><option key={item} value={item}>{item==="all"?"All categories":item}</option>)}
</select>
</section>
<div className="skills-results-header"><span><strong>{filteredSkills.length}</strong> skills shown</span>{(search||category!=="all")&&<button onClick={()=>{setSearch("");setCategory("all")}}>Clear filters</button>}</div>
{filteredSkills.length===0?<section className="dashboard-card skills-empty"><div className="empty-icon"><BrainCircuit size={27}/></div><h2>{userSkills.length?"No matching skills":"Build your skill profile"}</h2><p>{userSkills.length?"Try adjusting your search or category filter.":"Add your technical skills and proficiency levels to unlock accurate career analysis."}</p>{!userSkills.length&&<button className="primary-button" onClick={openAdd}><Plus size={16}/>Add your first skill</button>}</section>:<div className="skills-grid">
{filteredSkills.map(skill=>{
const Icon=getCategoryIcon(skill.category)
return <article className="skill-profile-card" key={skill.id}>
<div className="skill-profile-header">
<div className="skill-profile-icon"><Icon size={18}/></div>
<div className="skill-profile-actions"><button onClick={()=>openEdit(skill)} aria-label={`Edit ${skill.name}`}><Pencil size={15}/></button><button className="danger" onClick={()=>deleteSkill(skill)} aria-label={`Delete ${skill.name}`}><Trash2 size={15}/></button></div>
</div>
<div className="skill-profile-content"><span>{skill.category||"Skill"}</span><h2>{skill.name}</h2><p>{skill.description||"Technical skill in your professional profile."}</p></div>
<div className="skill-proficiency-block"><div><span>Proficiency</span><strong>{skill.proficiency_level}/5</strong></div><ProgressBar value={Number(skill.proficiency_level||0)*20}/></div>
<div className="skill-profile-footer"><span>Experience</span><strong>{Number(skill.years_experience||0).toFixed(1)} years</strong></div>
</article>
})}
</div>}
{showModal&&<div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)closeModal()}}>
<div className="skill-modal">
<div className="modal-header"><div><span className="card-eyebrow">{editing?"EDIT SKILL":"ADD SKILL"}</span><h2>{editing?"Update your skill":"Add to your technical profile"}</h2></div><button className="icon-button" onClick={closeModal}><X size={18}/></button></div>
<form onSubmit={saveSkill}>
<div className="modal-body">
<div className="modal-field"><label>Skill</label><select value={selectedSkill} onChange={e=>setSelectedSkill(e.target.value)} disabled={Boolean(editing)} required><option value="">Select a skill</option>{editing&&<option value={editing.id}>{editing.name}</option>}{!editing&&availableSkills.map(skill=><option key={skill.id} value={skill.id}>{skill.name} · {skill.category}</option>)}</select></div>
<div className="modal-field"><div className="modal-label-row"><label>Proficiency level</label><strong>{proficiency}/5</strong></div><input type="range" min="1" max="5" value={proficiency} onChange={e=>setProficiency(e.target.value)}/><div className="range-labels"><span>Beginner</span><span>Expert</span></div></div>
<div className="modal-field"><label>Years of experience</label><input type="number" min="0" max="60" step="0.5" value={years} onChange={e=>setYears(e.target.value)} required/></div>
</div>
<div className="modal-footer"><button type="button" className="secondary-button modal-cancel" onClick={closeModal}>Cancel</button><button type="submit" className="primary-button" disabled={saving||!selectedSkill}>{saving?"Saving...":editing?"Save changes":"Add skill"}</button></div>
</form>
</div>
</div>}
</div>
}
function TargetIcon(){
return <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/></svg>
}