import { z } from "zod"

export const profileSchema=z.object({
headline:z.string().max(255).optional(),
bio:z.string().max(2000).optional(),
education:z.string().max(500).optional(),
experienceYears:z.number().min(0).max(60).optional(),
location:z.string().max(150).optional(),
linkedinUrl:z.string().url().optional(),
githubUrl:z.string().url().optional(),
portfolioUrl:z.string().url().optional()
})

export const userSkillSchema=z.object({
skillId:z.string().uuid(),
proficiencyLevel:z.number().int().min(1).max(5),
yearsExperience:z.number().min(0).max(60),
lastUsedAt:z.string().datetime().optional()
})