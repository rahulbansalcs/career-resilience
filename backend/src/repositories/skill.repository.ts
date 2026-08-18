import { pool } from "../config/database.js"

export const getAllSkills=async()=>{
const result=await pool.query("SELECT id,name,category,description FROM skills ORDER BY category,name")
return result.rows
}

export const getUserSkills=async(userId:string)=>{
const result=await pool.query(
`SELECT s.id,s.name,s.category,s.description,us.proficiency_level,us.years_experience,us.last_used_at,us.created_at,us.updated_at
FROM user_skills us
JOIN skills s ON s.id=us.skill_id
WHERE us.user_id=$1
ORDER BY s.category,s.name`,
[userId]
)
return result.rows
}

export const addUserSkill=async(userId:string,skillId:string,proficiencyLevel:number,yearsExperience:number,lastUsedAt?:string)=>{
const result=await pool.query(
`INSERT INTO user_skills(user_id,skill_id,proficiency_level,years_experience,last_used_at)
VALUES($1,$2,$3,$4,$5)
RETURNING id,user_id,skill_id,proficiency_level,years_experience,last_used_at,created_at,updated_at`,
[userId,skillId,proficiencyLevel,yearsExperience,lastUsedAt||null]
)
return result.rows[0]
}

export const updateUserSkill=async(userId:string,skillId:string,proficiencyLevel:number,yearsExperience:number,lastUsedAt?:string)=>{
const result=await pool.query(
`UPDATE user_skills
SET proficiency_level=$3,
years_experience=$4,
last_used_at=$5,
updated_at=NOW()
WHERE user_id=$1 AND skill_id=$2
RETURNING id,user_id,skill_id,proficiency_level,years_experience,last_used_at,created_at,updated_at`,
[userId,skillId,proficiencyLevel,yearsExperience,lastUsedAt||null]
)
return result.rows[0]||null
}

export const deleteUserSkill=async(userId:string,skillId:string)=>{
const result=await pool.query("DELETE FROM user_skills WHERE user_id=$1 AND skill_id=$2 RETURNING id",[userId,skillId])
return (result.rowCount??0)>0
}