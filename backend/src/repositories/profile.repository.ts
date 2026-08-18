import { pool } from "../config/database.js"

export const findProfileByUserId=async(userId:string)=>{
const result=await pool.query("SELECT id,user_id,headline,bio,education,experience_years,location,linkedin_url,github_url,portfolio_url,created_at,updated_at FROM profiles WHERE user_id=$1",[userId])
return result.rows[0]||null
}

export const createProfile=async(userId:string,data:{headline?:string,bio?:string,education?:string,experienceYears?:number,location?:string,linkedinUrl?:string,githubUrl?:string,portfolioUrl?:string})=>{
const result=await pool.query(
`INSERT INTO profiles(user_id,headline,bio,education,experience_years,location,linkedin_url,github_url,portfolio_url)
VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)
RETURNING id,user_id,headline,bio,education,experience_years,location,linkedin_url,github_url,portfolio_url,created_at,updated_at`,
[userId,data.headline||null,data.bio||null,data.education||null,data.experienceYears??0,data.location||null,data.linkedinUrl||null,data.githubUrl||null,data.portfolioUrl||null]
)
return result.rows[0]
}

export const updateProfile=async(userId:string,data:{headline?:string,bio?:string,education?:string,experienceYears?:number,location?:string,linkedinUrl?:string,githubUrl?:string,portfolioUrl?:string})=>{
const result=await pool.query(
`UPDATE profiles
SET headline=COALESCE($2,headline),
bio=COALESCE($3,bio),
education=COALESCE($4,education),
experience_years=COALESCE($5,experience_years),
location=COALESCE($6,location),
linkedin_url=COALESCE($7,linkedin_url),
github_url=COALESCE($8,github_url),
portfolio_url=COALESCE($9,portfolio_url),
updated_at=NOW()
WHERE user_id=$1
RETURNING id,user_id,headline,bio,education,experience_years,location,linkedin_url,github_url,portfolio_url,created_at,updated_at`,
[userId,data.headline??null,data.bio??null,data.education??null,data.experienceYears??null,data.location??null,data.linkedinUrl??null,data.githubUrl??null,data.portfolioUrl??null]
)
return result.rows[0]||null
}