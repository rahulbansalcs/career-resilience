import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { pool } from "../config/database.js"

const __filename=fileURLToPath(import.meta.url)
const __dirname=path.dirname(__filename)
const migrationsPath=path.resolve(__dirname,"../../database/migrations")

const runMigrations=async()=>{
const client=await pool.connect()
try{
await client.query(`
CREATE TABLE IF NOT EXISTS schema_migrations(
id SERIAL PRIMARY KEY,
filename VARCHAR(255) NOT NULL UNIQUE,
executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
)
`)
const files=(await fs.readdir(migrationsPath)).filter(file=>file.endsWith(".sql")).sort()
for(const file of files){
const existing=await client.query("SELECT id FROM schema_migrations WHERE filename=$1",[file])
if(existing.rowCount) continue
const sql=await fs.readFile(path.join(migrationsPath,file),"utf8")
await client.query("BEGIN")
try{
await client.query(sql)
await client.query("INSERT INTO schema_migrations(filename) VALUES($1)",[file])
await client.query("COMMIT")
console.log(`Migration applied: ${file}`)
}catch(error){
await client.query("ROLLBACK")
throw error
}
}
console.log("Database migrations completed")
}catch(error){
console.error("Migration failed",error)
process.exitCode=1
}finally{
client.release()
await pool.end()
}
}

runMigrations()