export default function StatCard({label,value,description,icon:Icon,accent="blue"}){
    return <div className="stat-card"><div className={`stat-icon stat-icon-${accent}`}><Icon size={20}/></div><div className="stat-content"><span>{label}</span><strong>{value}</strong><small>{description}</small></div></div>
    }