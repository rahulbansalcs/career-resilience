import { Request,Response } from "express"
import { generateRoadmap,getUserRoadmap,listUserRoadmaps,updateUserRoadmapItemStatus } from "../services/roadmap.service.js"
const getUserId=(req:Request)=>{
if(!req.userId) throw new Error("UNAUTHORIZED")
return req.userId
}
export const generateRoadmapController=async(req:Request,res:Response)=>{
try{
const userId=getUserId(req)
const careerRoleId=String(req.body.careerRoleId||"")
if(!careerRoleId){
res.status(400).json({error:"careerRoleId is required"})
return
}
const roadmap=await generateRoadmap(userId,careerRoleId)
res.status(201).json({roadmap})
}catch(error){
    if(error instanceof Error&&error.message==="CAREER_ROLE_NOT_FOUND"){
    res.status(404).json({error:"Career role not found"})
    return
    }
    if(error instanceof Error&&error.message==="NO_SKILL_GAPS"){
    res.status(400).json({error:"No skill gaps found for this career role"})
    return
    }
    console.error(error)
    res.status(500).json({error:error instanceof Error?error.message:"Unknown error"})
    }
}
export const listRoadmapsController=async(req:Request,res:Response)=>{
try{
const roadmaps=await listUserRoadmaps(getUserId(req))
res.json({roadmaps})
}catch{
res.status(500).json({error:"Unable to fetch roadmaps"})
}
}
export const getRoadmapController=async(req:Request,res:Response)=>{
try{
const roadmapId=String(req.params.roadmapId)
const roadmap=await getUserRoadmap(getUserId(req),roadmapId)
if(!roadmap){
res.status(404).json({error:"Roadmap not found"})
return
}
res.json({roadmap})
}catch{
res.status(500).json({error:"Unable to fetch roadmap"})
}
}
export const updateRoadmapItemStatusController=async(req:Request,res:Response)=>{
    try{
    const itemId=String(req.params.itemId)
    const status=String(req.body.status)
    if(!["pending","in_progress","completed"].includes(status)){
    res.status(400).json({error:"Invalid status"})
    return
    }
    const item=await updateUserRoadmapItemStatus(getUserId(req),itemId,status as "pending"|"in_progress"|"completed")
    if(!item){
    res.status(404).json({error:"Roadmap item not found"})
    return
    }
    res.json({item})
    }catch(error){
    console.error("UPDATE ROADMAP ITEM ERROR:",error)
    res.status(500).json({error:error instanceof Error?error.message:"Unable to update roadmap item"})
    }
    }