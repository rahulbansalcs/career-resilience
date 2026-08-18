import { pool } from "../config/database.js"

export const findUserByEmail=async(email:string)=>{
const result=await pool.query("SELECT id,email,password_hash,first_name,last_name,created_at,updated_at FROM users WHERE email=$1",[email])
return result.rows[0]||null
}

export const findUserById=async(id:string)=>{
const result=await pool.query("SELECT id,email,first_name,last_name,created_at,updated_at FROM users WHERE id=$1",[id])
return result.rows[0]||null
}

export const createUser=async(email:string,passwordHash:string,firstName:string,lastName?:string)=>{
const result=await pool.query(
"INSERT INTO users(email,password_hash,first_name,last_name) VALUES($1,$2,$3,$4) RETURNING id,email,first_name,last_name,created_at,updated_at",
[email,passwordHash,firstName,lastName||null]
)
return result.rows[0]
}