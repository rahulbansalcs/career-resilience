import { Router } from "express"
import { listSkillsController } from "../controllers/profile.controller.js"

const router=Router()

router.get("/",listSkillsController)

export default router