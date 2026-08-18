import { pool } from "../config/database.js"
export const createRoadmap=async(userId:string,careerRoleId:string,title:string,description:string)=>{
const result=await pool.query(`INSERT INTO roadmaps(user_id,career_role_id,title,description) VALUES($1,$2,$3,$4) RETURNING *`,[userId,careerRoleId,title,description])
return result.rows[0]
}
export const createRoadmapItem=async(roadmapId:string,title:string,description:string,itemType:string,priority:string,estimatedHours:number,dueDate:string|null)=>{
const result=await pool.query(`INSERT INTO roadmap_items(roadmap_id,title,description,item_type,priority,estimated_hours,due_date) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *`,[roadmapId,title,description,itemType,priority,estimatedHours,dueDate])
return result.rows[0]
}
export const getRoadmapsByUser=async(userId:string)=>{
const result=await pool.query(`SELECT * FROM roadmaps WHERE user_id=$1 ORDER BY created_at DESC`,[userId])
return result.rows
}
export const getRoadmapById=async(userId:string,roadmapId:string)=>{
const result=await pool.query(`SELECT * FROM roadmaps WHERE id=$1 AND user_id=$2`,[roadmapId,userId])
return result.rows[0]||null
}
export const getRoadmapItems=async(roadmapId:string)=>{
    const result=await pool.query(`SELECT * FROM roadmap_items WHERE roadmap_id=$1 ORDER BY CASE priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END,title`,[roadmapId])
    return result.rows
    }
export const createRoadmapWithItems=async(userId:string,careerRoleId:string,title:string,description:string,items:Array<{title:string,description:string,itemType:string,priority:string,estimatedHours:number,dueDate:string|null}>)=>{
    const client=await pool.connect()
    try{
    await client.query("BEGIN")
    const roadmapResult=await client.query(`INSERT INTO roadmaps(user_id,career_role_id,title,description) VALUES($1,$2,$3,$4) RETURNING *`,[userId,careerRoleId,title,description])
    const roadmap=roadmapResult.rows[0]
    const createdItems=[]
    for(const item of items){
    const result=await client.query(`INSERT INTO roadmap_items(roadmap_id,title,description,item_type,priority,estimated_hours,due_date) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *`,[roadmap.id,item.title,item.description,item.itemType,item.priority,item.estimatedHours,item.dueDate])
    createdItems.push(result.rows[0])
    }
    await client.query("COMMIT")
    return {...roadmap,items:createdItems}
    }catch(error){
    await client.query("ROLLBACK")
    throw error
    }finally{
    client.release()
    }
    }
    export const updateRoadmapItemStatus=async(userId:string,roadmapItemId:string,status:string)=>{
        const result=await pool.query(`UPDATE roadmap_items ri SET status=$1::varchar,completed_at=CASE WHEN $1::varchar='completed' THEN NOW() ELSE NULL END WHERE ri.id=$2 AND EXISTS(SELECT 1 FROM roadmaps r WHERE r.id=ri.roadmap_id AND r.user_id=$3) RETURNING ri.*`,[status,roadmapItemId,userId])
        return result.rows[0]||null
        }
        export const getRoadmapProgress=async(roadmapId:string)=>{
            const result=await pool.query(`SELECT COUNT(*)::int AS total_items,COUNT(*) FILTER(WHERE status='completed')::int AS completed_items,COUNT(*) FILTER(WHERE status='in_progress')::int AS in_progress_items,COUNT(*) FILTER(WHERE status='pending')::int AS pending_items FROM roadmap_items WHERE roadmap_id=$1`,[roadmapId])
            const row=result.rows[0]
            const totalItems=row.total_items
            const completedItems=row.completed_items
            return {
            totalItems,
            completedItems,
            inProgressItems:row.in_progress_items,
            pendingItems:row.pending_items,
            progressPercentage:totalItems===0?0:Number(((completedItems/totalItems)*100).toFixed(2))
            }
            }