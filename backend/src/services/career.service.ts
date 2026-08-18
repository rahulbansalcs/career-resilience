import { getCareerRoleById,getCareerRoleSkills,getCareerRoles,getUserSkillsForCareer } from "../repositories/career.repository.js"

export const listCareerRoles=async()=>{
return getCareerRoles()
}

export const analyzeCareerFit=async(userId:string,roleId:string)=>{
const role=await getCareerRoleById(roleId)
if(!role) throw new Error("CAREER_ROLE_NOT_FOUND")

const requiredSkills=await getCareerRoleSkills(roleId)
const userSkills=await getUserSkillsForCareer(userId)

const userSkillMap=new Map(userSkills.map(skill=>[skill.id,skill]))

const matchedSkills=[]
const missingSkills=[]
let totalWeight=0
let achievedWeight=0

for(const requiredSkill of requiredSkills){
const weight=requiredSkill.importance
totalWeight+=weight

const userSkill=userSkillMap.get(requiredSkill.id)

if(userSkill){
const proficiency=Math.min(userSkill.proficiency_level,5)
const achievement=proficiency/5
achievedWeight+=weight*achievement

matchedSkills.push({
id:requiredSkill.id,
name:requiredSkill.name,
category:requiredSkill.category,
proficiencyLevel:userSkill.proficiency_level,
importance:requiredSkill.importance,
isRequired:requiredSkill.is_required
})
}else{
missingSkills.push({
id:requiredSkill.id,
name:requiredSkill.name,
category:requiredSkill.category,
importance:requiredSkill.importance,
isRequired:requiredSkill.is_required
})
}
}

const matchScore=totalWeight===0?0:Number(((achievedWeight/totalWeight)*100).toFixed(2))

return {
careerRole:{
id:role.id,
title:role.title,
description:role.description,
industry:role.industry,
growthOutlook:role.growth_outlook
},
matchScore,
matchedSkills,
missingSkills,
summary:{
totalRequiredSkills:requiredSkills.length,
matchedSkills:matchedSkills.length,
missingSkills:missingSkills.length
}
}
}