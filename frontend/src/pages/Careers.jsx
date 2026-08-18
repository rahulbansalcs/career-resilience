import {useEffect,useMemo,useState} from "react"
import {useSearchParams} from "react-router-dom"
import {useNavigate} from "react-router-dom"
import {Search,Briefcase,TrendingUp,ArrowUpRight,CheckCircle2,CircleAlert,Target,SlidersHorizontal,X,Map,Loader2} from "lucide-react"
import API from "../config/api"
export default function Careers(){
const navigate=useNavigate()
const [careers,setCareers]=useState([])
const [searchParams]=useSearchParams()
const [search,setSearch]=useState(()=>searchParams.get("search")||"")
const [industry,setIndustry]=useState("all")
const [growth,setGrowth]=useState("all")
const [loading,setLoading]=useState(true)
const [error,setError]=useState("")
const [selectedCareer,setSelectedCareer]=useState(null)
const [analysis,setAnalysis]=useState(null)
const [analyzing,setAnalyzing]=useState(false)
const [generating,setGenerating]=useState(false)
const [roadmapMessage,setRoadmapMessage]=useState("")
const [showFilters,setShowFilters]=useState(false)
const token=localStorage.getItem("token")
useEffect(()=>{
fetch(`${API}/careers`).then(res=>{
if(!res.ok)throw new Error("Unable to load careers")
return res.json()
}).then(data=>{
setCareers(Array.isArray(data.roles)?data.roles:[])
}).catch(err=>setError(err.message)).finally(()=>setLoading(false))
},[])
useEffect(()=>{
    setSearch(searchParams.get("search")||"")
    },[searchParams])
const industries=useMemo(()=>["all",...new Set(careers.map(c=>c.industry).filter(Boolean))],[careers])
const filteredCareers=useMemo(()=>{
const query=search.trim().toLowerCase()
return careers.filter(career=>{
const matchesSearch=!query||career.title?.toLowerCase().includes(query)||career.description?.toLowerCase().includes(query)||career.industry?.toLowerCase().includes(query)
const matchesIndustry=industry==="all"||career.industry===industry
const matchesGrowth=growth==="all"||career.growth_outlook===growth
return matchesSearch&&matchesIndustry&&matchesGrowth
})
},[careers,search,industry,growth])
const analyzeCareer=async career=>{
setSelectedCareer(career)
setAnalysis(null)
setRoadmapMessage("")
setAnalyzing(true)
setError("")
try{
const res=await fetch(`${API}/careers/${career.id}/analyze`,{headers:{Authorization:`Bearer ${token}`}})
const data=await res.json()
if(!res.ok)throw new Error(data.error||"Unable to analyze career")
setAnalysis(data)
setTimeout(()=>document.querySelector(".career-analysis-panel")?.scrollIntoView({behavior:"smooth",block:"start"}),50)
}catch(err){
setError(err.message)
}finally{
setAnalyzing(false)
}
}
const generateRoadmap=async()=>{
if(!selectedCareer)return
setGenerating(true)
setError("")
setRoadmapMessage("")
try{
const existingRes=await fetch(`${API}/roadmaps`,{headers:{Authorization:`Bearer ${token}`}})
if(existingRes.ok){
const existingData=await existingRes.json()
const existing=(existingData.roadmaps||[]).find(roadmap=>roadmap.career_role_id===selectedCareer.id)
if(existing){
navigate("/roadmaps")
return
}
}
const res=await fetch(`${API}/roadmaps/generate`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${token}`},body:JSON.stringify({careerRoleId:selectedCareer.id})})
const data=await res.json()
if(!res.ok){
if(data.error==="No skill gaps found for this career role"){
setRoadmapMessage("Your current skill profile already meets the roadmap requirements for this career.")
return
}
throw new Error(data.error||"Unable to generate roadmap")
}
setRoadmapMessage("Your personalized roadmap has been created successfully.")
setTimeout(()=>navigate("/roadmaps"),700)
}catch(err){
setError(err.message)
}finally{
setGenerating(false)
}
}
const clearFilters=()=>{
setSearch("")
setIndustry("all")
setGrowth("all")
}
const closeAnalysis=()=>{
setAnalysis(null)
setSelectedCareer(null)
setRoadmapMessage("")
}
if(loading)return <div className="page-loading"><div className="loading-spinner"/><p>Loading career opportunities...</p></div>
return <div className="careers-page">
<section className="page-hero career-explorer-hero">
<div>
<span className="eyebrow">CAREER EXPLORER</span>
<h1>Explore career paths</h1>
<p>Discover roles that match your skills and understand where you can grow next.</p>
</div>
<div className="career-hero-stat">
<Briefcase size={19}/>
<div><strong>{careers.length}</strong><span>career paths</span></div>
</div>
</section>
{error&&<div className="alert-error">{error}</div>}
<section className="career-search-card">
<div className="career-search-main">
<Search size={19}/>
<input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by career or industry..."/>
{search&&<button className="search-clear" onClick={()=>setSearch("")} aria-label="Clear search"><X size={16}/></button>}
</div>
<button className={`filter-toggle ${showFilters?"active":""}`} onClick={()=>setShowFilters(!showFilters)}><SlidersHorizontal size={17}/>Filters</button>
</section>
{showFilters&&<section className="career-filters">
<div className="filter-group">
<label>Industry</label>
<select value={industry} onChange={e=>setIndustry(e.target.value)}>
{industries.map(item=><option key={item} value={item}>{item==="all"?"All industries":item}</option>)}
</select>
</div>
<div className="filter-group">
<label>Growth outlook</label>
<select value={growth} onChange={e=>setGrowth(e.target.value)}>
<option value="all">All outlooks</option>
<option value="Very High">Very High</option>
<option value="High">High</option>
<option value="Medium">Medium</option>
</select>
</div>
<button className="clear-filters" onClick={clearFilters}>Clear filters</button>
</section>}
<div className="career-results-header">
<div><strong>{filteredCareers.length}</strong> career paths found</div>
{(search||industry!=="all"||growth!=="all")&&<button onClick={clearFilters}>Clear all</button>}
</div>
{filteredCareers.length===0?<section className="dashboard-card career-empty">
<div className="empty-icon"><Search size={25}/></div>
<h2>No careers found</h2>
<p>Try searching for another role or industry.</p>
<button className="secondary-button" onClick={clearFilters}>Reset search</button>
</section>:<div className="career-grid">
{filteredCareers.map(career=><article className="career-card" key={career.id}>
<div className="career-card-top">
<div className="career-icon"><Briefcase size={20}/></div>
<span className="growth-badge"><TrendingUp size={14}/>{career.growth_outlook}</span>
</div>
<div className="career-card-content">
<span className="career-industry">{career.industry}</span>
<h2>{career.title}</h2>
<p>{career.description}</p>
</div>
<div className="career-card-footer">
<div className="career-meta"><span><Target size={15}/>Career fit</span><strong>Analyze</strong></div>
<button className="career-action" onClick={()=>analyzeCareer(career)}>Analyze Career <ArrowUpRight size={16}/></button>
</div>
</article>)}
</div>}
{(analyzing||analysis)&&<section className="career-analysis-panel">
<div className="analysis-header">
<div>
<span className="card-eyebrow">CAREER FIT ANALYSIS</span>
<h2>{selectedCareer?.title}</h2>
<p>Compare your current skills against the requirements for this career.</p>
</div>
<button className="icon-button" onClick={closeAnalysis} aria-label="Close analysis"><X size={18}/></button>
</div>
{analyzing?<div className="analysis-loading"><div className="loading-spinner"/><h3>Analyzing your career fit...</h3><p>Comparing your skills with the role requirements.</p></div>:analysis&&<div className="analysis-content">
<div className="analysis-score-card">
<div className="score-ring" style={{background:`conic-gradient(#2563eb 0 ${Math.min(100,Math.max(0,Number(analysis.matchScore)||0))}%,#e5e7eb ${Math.min(100,Math.max(0,Number(analysis.matchScore)||0))}% 100%)`}}>
<div><strong>{Math.round(Number(analysis.matchScore)||0)}</strong><span>%</span></div>
</div>
<div>
<span className="card-eyebrow">YOUR CAREER FIT</span>
<h3>{analysis.matchScore>=80?"Excellent match":analysis.matchScore>=70?"Strong match":analysis.matchScore>=50?"Developing match":"Significant skill development needed"}</h3>
<p>{analysis.summary?.matchedSkills||0} matched skills · {analysis.summary?.missingSkills||0} missing skills</p>
</div>
</div>
<div className="analysis-columns">
<div>
<h3><CheckCircle2 size={18}/>Matched skills</h3>
{analysis.matchedSkills?.length?analysis.matchedSkills.map(skill=><div className="skill-result matched" key={skill.id}><CheckCircle2 size={16}/><span>{skill.name}</span></div>):<p className="muted-text">No matched skills yet.</p>}
</div>
<div>
<h3><CircleAlert size={18}/>Skills to develop</h3>
{analysis.missingSkills?.length?analysis.missingSkills.map(skill=><div className="skill-result missing" key={skill.id}><CircleAlert size={16}/><span>{skill.name}</span><small>{skill.importance}/5 importance</small></div>):<p className="muted-text">You currently have all required skills for this role. Your roadmap can still help strengthen lower proficiency areas.</p>}
</div>
</div>
{roadmapMessage&&<div className="roadmap-success-message"><CheckCircle2 size={17}/><span>{roadmapMessage}</span></div>}
<div className="analysis-actions">
<button className="secondary-button analysis-secondary-action" onClick={()=>navigate("/skills")}>Review my skills</button>
<button className="primary-button" disabled={generating} onClick={generateRoadmap}>{generating?<><Loader2 size={16} className="spin"/>Generating roadmap...</>:<><Map size={16}/>Generate roadmap <ArrowUpRight size={16}/></>}</button>
</div>
</div>}
</section>}
</div>
}