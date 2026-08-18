import { createProfile,findProfileByUserId,updateProfile } from "../repositories/profile.repository.js"
import { addUserSkill,deleteUserSkill,getAllSkills,getUserSkills,updateUserSkill } from "../repositories/skill.repository.js"

export const getProfile=async(userId:string)=>{
return findProfileByUserId(userId)
}

export const saveProfile=async(userId:string,data:{headline?:string,bio?:string,education?:string,experienceYears?:number,location?:string,linkedinUrl?:string,githubUrl?:string,portfolioUrl?:string})=>{
const existing=await findProfileByUserId(userId)
if(existing) return updateProfile(userId,data)
return createProfile(userId,data)
}

export const listSkills=async()=>{
return getAllSkills()
}

export const listUserSkills=async(userId:string)=>{
return getUserSkills(userId)
}

export const createUserSkill=async(userId:string,skillId:string,proficiencyLevel:number,yearsExperience:number,lastUsedAt?:string)=>{
return addUserSkill(userId,skillId,proficiencyLevel,yearsExperience,lastUsedAt)
}

export const editUserSkill=async(userId:string,skillId:string,proficiencyLevel:number,yearsExperience:number,lastUsedAt?:string)=>{
return updateUserSkill(userId,skillId,proficiencyLevel,yearsExperience,lastUsedAt)
}

export const removeUserSkill=async(userId:string,skillId:string)=>{
return deleteUserSkill(userId,skillId)
}