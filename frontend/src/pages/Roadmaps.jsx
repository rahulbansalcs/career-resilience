import {useEffect,useMemo,useState} from "react"
import {ArrowUpRight,CheckCircle2,Clock3,Map,Target,ChevronDown,ChevronUp,Play,Loader2} from "lucide-react"
import ProgressBar from "../components/ui/ProgressBar"
import API from "../config/api"
export default function Roadmaps(){
const [roadmaps,setRoadmaps]=useState([])
const [careers,setCareers]=useState([])
const [loading,setLoading]=useState(true)
const [error,setError]=useState("")
const [expanded,setExpanded]=useState(null)
const [updating,setUpdating]=useState(null)
const token=localStorage.getItem("token")
const headers={Authorization:`Bearer ${token}`}
const loadRoadmaps=async()=>{
try{
const [roadmapRes,careerRes]=await Promise.all([fetch(`${API}/roadmaps`,{headers}),fetch(`${API}/careers`)])
if(!roadmapRes.ok) throw new Error("Unable to load your roadmaps")
const roadmapData=await roadmapRes.json()
const careerData=careerRes.ok?await careerRes.json():{roles:[]}
setRoadmaps(roadmapData.roadmaps||[])
setCareers(careerData.roles||[])
}catch(error){
setError(error.message||"Unable to load your roadmaps")
}finally{
setLoading(false)
}
}
useEffect(()=>{loadRoadmaps()},[])
const activeRoadmap=useMemo(()=>roadmaps.find(r=>r.status==="active")||roadmaps[0],[roadmaps])
const getCareer=roadmap=>careers.find(c=>c.id===roadmap.career_role_id)
const getProgress=roadmap=>{
const items=roadmap.items||[]
const completed=items.filter(item=>item.status==="completed").length
return items.length?Math.round(completed/items.length*100):0
}
const updateStatus=async(itemId,status)=>{
setUpdating(itemId)
setError("")
try{
const res=await fetch(`${API}/roadmaps/items/${itemId}/status`,{method:"PATCH",headers:{"Content-Type":"application/json",...headers},body:JSON.stringify({status})})
const data=await res.json()
if(!res.ok) throw new Error(data.error||"Unable to update milestone")
setRoadmaps(prev=>prev.map(roadmap=>({...roadmap,items:(roadmap.items||[]).map(item=>item.id===itemId?data.item:item)})))
}catch(error){
setError(error.message||"Unable to update milestone")
}finally{
setUpdating(null)
}
}
const getNextItem=roadmap=>(roadmap.items||[]).find(item=>item.status!=="completed")
if(loading)return <div className="page-loading"><div className="loading-spinner"/><p>Loading your roadmaps...</p></div>
return <div className="roadmaps-page">
<section className="page-hero">
<div>
<span className="eyebrow">ROADMAPS</span>
<h1>Your career roadmaps</h1>
<p>Turn your career goals into measurable skill development plans.</p>
</div>
{activeRoadmap&&<div className="roadmap-hero-stat"><Map size={19}/><div><strong>{getProgress(activeRoadmap)}%</strong><span>overall progress</span></div></div>}
</section>
{error&&<div className="alert-error">{error}</div>}
{roadmaps.length===0&&!error&&<section className="dashboard-card roadmap-empty-page"><div className="empty-icon"><Map size={28}/></div><h2>No roadmap yet</h2><p>Your personalized roadmap will appear here after you analyze a target career.</p><a href="/careers" className="primary-button">Explore careers <ArrowUpRight size={16}/></a></section>}
{roadmaps.length>0&&<div className="roadmap-list">
{roadmaps.map(roadmap=>{
const career=getCareer(roadmap)
const progress=getProgress(roadmap)
const items=roadmap.items||[]
const completed=items.filter(item=>item.status==="completed").length
const inProgress=items.filter(item=>item.status==="in_progress").length
const nextItem=getNextItem(roadmap)
const isExpanded=expanded===roadmap.id
return <section className={`roadmap-card ${roadmap.status==="active"?"roadmap-card-active":""}`} key={roadmap.id}>
<div className="roadmap-card-header">
<div className="roadmap-title-area">
<div className="roadmap-icon"><Map size={20}/></div>
<div>
<div className="roadmap-status-row"><span className={`status-badge ${roadmap.status}`}>{roadmap.status||"active"}</span>{roadmap.created_at&&<span className="roadmap-date">Created {new Date(roadmap.created_at).toLocaleDateString()}</span>}</div>
<h2>{roadmap.title||career?.title||"Career Development Roadmap"}</h2>
<p>{roadmap.description||`Build the skills required to become a ${career?.title||"professional"}.`}</p>
</div>
</div>
<button className="icon-button roadmap-expand" onClick={()=>setExpanded(isExpanded?null:roadmap.id)} aria-label="Toggle roadmap">{isExpanded?<ChevronUp size={18}/>:<ChevronDown size={18}/>}</button>
</div>
<div className="roadmap-summary">
<div className="roadmap-progress-block">
<div className="roadmap-progress-label"><span>Roadmap progress</span><strong>{progress}%</strong></div>
<ProgressBar value={progress}/>
</div>
<div className="roadmap-meta">
<div><CheckCircle2 size={16}/><span>{completed}/{items.length} completed</span></div>
<div><Play size={15}/><span>{inProgress} in progress</span></div>
<div><Clock3 size={16}/><span>{items.reduce((sum,item)=>sum+Number(item.estimated_hours||0),0)} hours</span></div>
</div>
</div>
{nextItem&&<div className="roadmap-focus">
<div><span className="card-eyebrow">CURRENT FOCUS</span><strong>{nextItem.title}</strong><p>{nextItem.status==="in_progress"?"Continue working on this milestone.":"Start this milestone to begin making progress."}</p></div>
{nextItem.status==="pending"&&<button className="primary-button roadmap-action-button" disabled={updating===nextItem.id} onClick={()=>updateStatus(nextItem.id,"in_progress")}>{updating===nextItem.id?<Loader2 size={16} className="spin"/>:<Play size={16}/>}Start milestone</button>}
{nextItem.status==="in_progress"&&<button className="primary-button roadmap-action-button" disabled={updating===nextItem.id} onClick={()=>updateStatus(nextItem.id,"completed")}>{updating===nextItem.id?<Loader2 size={16} className="spin"/>:<CheckCircle2 size={16}/>}Mark complete</button>}
</div>}
{!nextItem&&items.length>0&&<div className="roadmap-complete-banner"><CheckCircle2 size={20}/><div><strong>Roadmap completed</strong><span>Excellent work. You have completed every milestone.</span></div></div>}
{isExpanded&&<div className="roadmap-detail">
<div className="roadmap-detail-header"><div><span className="card-eyebrow">DEVELOPMENT PLAN</span><h3>Skills and milestones</h3></div></div>
<div className="roadmap-timeline">
{items.map((item,index)=><div className={`roadmap-step roadmap-step-${item.status}`} key={item.id}>
<div className="timeline-marker">{item.status==="completed"?<CheckCircle2 size={17}/>:item.status==="in_progress"?<Play size={15}/>:<span>{index+1}</span>}</div>
<div className="timeline-content">
<div className="timeline-top">
<div><div className="timeline-title-row"><h4>{item.title}</h4><span className={`item-status ${item.status}`}>{item.status==="in_progress"?"In progress":item.status==="completed"?"Completed":"Not started"}</span></div><p>{item.description||"Build practical capability through focused learning and application."}</p></div>
<span className={`priority-badge priority-${item.priority}`}>{item.priority||"medium"} priority</span>
</div>
<div className="timeline-footer">
<span><Clock3 size={14}/>{item.estimated_hours||0} hours</span>
<div className="timeline-actions">
{item.status==="pending"&&<button className="secondary-button" disabled={updating===item.id} onClick={()=>updateStatus(item.id,"in_progress")}>{updating===item.id?<Loader2 size={14} className="spin"/>:<Play size={14}/>}Start</button>}
{item.status==="in_progress"&&<button className="primary-button small-button" disabled={updating===item.id} onClick={()=>updateStatus(item.id,"completed")}>{updating===item.id?<Loader2 size={14} className="spin"/>:<CheckCircle2 size={14}/>}Complete</button>}
{item.status==="completed"&&<span className="completed-label"><CheckCircle2 size={14}/>Completed</span>}
</div>
</div>
</div>
</div>)}
{items.length===0&&<div className="empty-state"><Target size={28}/><p>No roadmap milestones have been added yet.</p></div>}
</div>
</div>}
</section>
})}
</div>}
</div>
}