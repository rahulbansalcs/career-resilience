import "dotenv/config"
import { z } from "zod"
const envSchema=z.object({
PORT:z.coerce.number().default(8000),
DATABASE_URL:z.string().min(1),
JWT_SECRET:z.string().min(32),
NODE_ENV:z.enum(["development","test","production"]).default("development"),
CLIENT_URL:z.string().min(1).default("http://localhost:5173")
})
export const env=envSchema.parse(process.env)