export default function ProgressBar({value=0}){
    return <div className="progress-track"><div className="progress-fill" style={{width:`${Math.min(100,Math.max(0,value))}%`}}/></div>
    }