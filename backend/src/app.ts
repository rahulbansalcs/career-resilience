import { env } from "./config/env.js"
import express from "express"
import cors from "cors"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import authRoutes from "./routes/auth.routes.js"
import profileRoutes from "./routes/profile.routes.js"
import skillRoutes from "./routes/skill.routes.js"
import careerRoutes from "./routes/career.routes.js"
import roadmapRoutes from "./routes/roadmap.routes.js"
const app=express()
const allowedOrigins=env.CLIENT_URL.split(",").map(origin=>origin.trim())
app.use(helmet())
app.use(cors({origin:(origin,callback)=>{if(!origin||allowedOrigins.includes(origin))return callback(null,true);return callback(new Error("Not allowed by CORS"))},credentials:true}))
app.use(express.json({limit:"1mb"}))
app.use(rateLimit({windowMs:15*60*1000,max:100,standardHeaders:true,legacyHeaders:false}))
app.get("/api/v1/health",(_,res)=>{res.status(200).json({status:"ok",service:"career-resilience-api"})})
app.use("/api/v1/auth",authRoutes)
app.use("/api/v1/profile",profileRoutes)
app.use("/api/v1/skills",skillRoutes)
app.use("/api/v1/careers",careerRoutes)
app.use("/api/v1/roadmaps",roadmapRoutes)
export default app