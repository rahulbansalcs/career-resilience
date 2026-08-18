import { Request,Response } from "express"
import { login,register,getCurrentUser } from "../services/auth.service.js"
import { loginSchema,registerSchema } from "../validators/auth.validator.js"

export const registerController=async(req:Request,res:Response)=>{
try{
const data=registerSchema.parse(req.body)
const user=await register(data.email,data.password,data.firstName,data.lastName)
res.status(201).json({user})
}catch(error){
if(error instanceof Error&&error.message==="EMAIL_ALREADY_EXISTS"){
res.status(409).json({error:"Email already registered"})
return
}
if(error instanceof Error&&error.name==="ZodError"){
res.status(400).json({error:"Invalid request data"})
return
}
res.status(500).json({error:"Internal server error"})
}
}

export const loginController=async(req:Request,res:Response)=>{
try{
const data=loginSchema.parse(req.body)
const result=await login(data.email,data.password)
res.status(200).json(result)
}catch(error){
if(error instanceof Error&&error.message==="INVALID_CREDENTIALS"){
res.status(401).json({error:"Invalid email or password"})
return
}
if(error instanceof Error&&error.name==="ZodError"){
res.status(400).json({error:"Invalid request data"})
return
}
res.status(500).json({error:"Internal server error"})
}
}

export const meController=async(req:Request,res:Response)=>{
try{
const userId=req.userId
if(!userId){
res.status(401).json({error:"Unauthorized"})
return
}
const user=await getCurrentUser(userId)
res.status(200).json({user})
}catch(error){
if(error instanceof Error&&error.message==="USER_NOT_FOUND"){
res.status(404).json({error:"User not found"})
return
}
res.status(500).json({error:"Internal server error"})
}
}