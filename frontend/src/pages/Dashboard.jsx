import {useEffect,useState} from "react"
import {useNavigate,useOutletContext} from "react-router-dom"
import {Target,BrainCircuit,Map,ArrowUpRight,CheckCircle2,Clock3,PlayCircle} from "lucide-react"
import ProgressBar from "../components/ui/ProgressBar"
import StatCard from "../components/ui/StatCard"
import API from "../config/api"
export default function Dashboard(){
const navigate=useNavigate()
const {user}=useOutletContext()
const [skills,setSkills]=useState([])
const [roadmap,setRoadmap]=useState(null)
const [career,setCareer]=useState(null)
const [analysis,setAnalysis]=useState(null)
const [loading,setLoading]=useState(true)
const [error,setError]=useState("")
const token=localStorage.getItem("token")
useEffect(()=>{
const loadDashboard=async()=>{
const headers={Authorization:`Bearer ${token}`}
try{
const [skillRes,roadmapRes,careerRes]=await Promise.all([fetch(`${API}/profile/skills`,{headers}),fetch(`${API}/roadmaps`,{headers}),fetch(`${API}/careers`)])
if(!skillRes.ok||!roadmapRes.ok)throw new Error("Unable to load dashboard data")
const skillData=await skillRes.json()
const roadmapData=await roadmapRes.json()
const careerData=careerRes.ok?await careerRes.json():{roles:[]}
setSkills(skillData.skills||[])
const roadmapList=roadmapData.roadmaps||[]
const active=roadmapList.find(item=>item.status==="active")||roadmapList[0]
if(active){
const detailRes=await fetch(`${API}/roadmaps/${active.id}`,{headers})
if(detailRes.ok){
const detailData=await detailRes.json()
const detailedRoadmap=detailData.roadmap
setRoadmap(detailedRoadmap)
const target=(careerData.roles||[]).find(item=>item.id===detailedRoadmap.career_role_id)
setCareer(target||null)
if(detailedRoadmap.career_role_id){
const analysisRes=await fetch(`${API}/careers/${detailedRoadmap.career_role_id}/analyze`,{headers})
if(analysisRes.ok){
const analysisData=await analysisRes.json()
setAnalysis(analysisData)
}
}
}
}
}catch(err){
setError(err.message||"Unable to load dashboard")
}finally{
setLoading(false)
}
}
loadDashboard()
},[])
const firstName=user?.first_name||user?.firstName||"there"
const items=roadmap?.items||[]
const totalItems=items.length
const completedItems=items.filter(item=>item.status==="completed").length
const inProgressItems=items.filter(item=>item.status==="in_progress").length
const pendingItems=items.filter(item=>item.status==="pending").length
const roadmapProgress=totalItems?Math.round(completedItems/totalItems*100):0
const averageSkill=skills.length?(skills.reduce((sum,skill)=>sum+Number(skill.proficiency_level||0),0)/skills.length).toFixed(1):"0.0"
const readiness=Number(analysis?.matchScore||0)
const requiredSkills=analysis?.summary?.totalRequiredSkills||0
const matchedSkills=analysis?.summary?.matchedSkills||0
const skillCoverage=requiredSkills?Math.round(matchedSkills/requiredSkills*100):0
const currentFocus=items.find(item=>item.status==="in_progress")||items.find(item=>item.status==="pending")
const readinessLabel=readiness>=80?"Excellent career fit":readiness>=70?"Strong career fit":readiness>=50?"Developing career fit":readiness>0?"Skill development needed":"Analyze a career to get started"
if(loading)return <div className="page-loading"><div className="loading-spinner"/><p>Loading your career overview...</p></div>
return <div className="dashboard-page">
<section className="welcome-section">
<div><span className="eyebrow">CAREER OVERVIEW</span><h1>Good morning, {firstName}</h1><p>Build the skills and experience needed for the career you want next.</p></div>
<button className="primary-button" onClick={()=>navigate("/careers")}>Explore careers <ArrowUpRight size={17}/></button>
</section>
{error&&<div className="alert-error">{error}</div>}
<section className="stats-grid">
<StatCard label="Career readiness" value={analysis?`${readiness.toFixed(1)}%`:"—"} description={readinessLabel} icon={Target} accent="blue"/>
<StatCard label="Skills tracked" value={skills.length} description={`${averageSkill}/5 average proficiency`} icon={BrainCircuit} accent="purple"/>
<StatCard label="Roadmap progress" value={roadmap?`${roadmapProgress}%`:"—"} description={roadmap?`${completedItems}/${totalItems} milestones completed`:"No active roadmap"} icon={Map} accent="green"/>
<StatCard label="Active focus" value={currentFocus?.title?.replace("Learn ","")||"—"} description={currentFocus?.status==="in_progress"?"Currently in progress":roadmap?"Next recommended milestone":"Generate a roadmap"} icon={Clock3} accent="orange"/>
</section>
<section className="dashboard-grid">
<div className="dashboard-card readiness-card">
<div className="card-header">
<div><span className="card-eyebrow">READINESS</span><h2>Career readiness</h2></div>
<button className="text-button" onClick={()=>navigate("/careers")}>View analysis <ArrowUpRight size={15}/></button>
</div>
<div className="readiness-content">
<div className="score-ring" style={{background:`conic-gradient(#2563eb 0 ${readiness}%,#e5e7eb ${readiness}% 100%)`}}><div className="score-value"><strong>{analysis?Math.round(readiness):"—"}</strong><span>/100</span></div></div>
<div className="readiness-details">
<h3>{career?.title||"Choose your target career"}</h3>
<p>{analysis?`${readinessLabel}. Your profile currently matches ${matchedSkills} of ${requiredSkills} required skills.`:"Explore career paths and analyze your current skill profile to calculate your readiness score."}</p>
<div className="mini-metric"><div><span>Skill coverage</span><strong>{requiredSkills?`${matchedSkills}/${requiredSkills}`:"—"}</strong></div><ProgressBar value={skillCoverage}/></div>
</div>
</div>
</div>
<div className="dashboard-card skills-card">
<div className="card-header">
<div><span className="card-eyebrow">SKILLS</span><h2>Skill proficiency</h2></div>
<button className="text-button" onClick={()=>navigate("/skills")}>View all <ArrowUpRight size={15}/></button>
</div>
<div className="skill-list">
{skills.slice(0,6).map(skill=><div className="skill-row" key={skill.id}><div className="skill-name"><span>{skill.name}</span><small>{skill.proficiency_level}/5</small></div><ProgressBar value={Number(skill.proficiency_level)*20}/></div>)}
{skills.length===0&&<div className="empty-state"><BrainCircuit size={28}/><p>Add your first skill to start building your career profile.</p><button className="secondary-button" onClick={()=>navigate("/skills")}>Add skills</button></div>}
</div>
</div>
</section>
<section className="dashboard-card roadmap-preview">
<div className="card-header">
<div><span className="card-eyebrow">YOUR ROADMAP</span><h2>{roadmap?.title||"No roadmap yet"}</h2><p>{roadmap?.description||"Analyze a career to generate your personalized development roadmap."}</p></div>
{roadmap&&<button className="primary-button" onClick={()=>navigate("/roadmaps")}>Continue roadmap <ArrowUpRight size={17}/></button>}
</div>
{roadmap?<><div className="roadmap-progress-header"><span>{roadmapProgress}% complete</span><span>{completedItems} completed · {inProgressItems} in progress · {pendingItems} pending</span></div><ProgressBar value={roadmapProgress}/><div className="roadmap-items">{items.slice(0,4).map(item=><div className={`roadmap-item roadmap-${item.status}`} key={item.id}><div className="roadmap-status">{item.status==="completed"?<CheckCircle2 size={19}/>:item.status==="in_progress"?<PlayCircle size={18}/>:<span/>}</div><div><strong>{item.title}</strong><p>{item.estimated_hours} hours · {item.priority} priority · {item.status==="in_progress"?"in progress":item.status}</p></div></div>)}</div></>:<div className="empty-roadmap"><Map size={30}/><h3>Your personalized roadmap starts here</h3><p>Analyze a career and we'll identify the skills you should focus on next.</p><button className="primary-button" onClick={()=>navigate("/careers")}>Explore careers</button></div>}
</section>
</div>
}