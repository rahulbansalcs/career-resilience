import { pool } from "../config/database.js";
export const getCareerRoles = async () => {
    const result = await pool.query(`
SELECT id,title,description,industry,growth_outlook
FROM career_roles
ORDER BY title
`);
    return result.rows;
};
export const getCareerRoleById = async (roleId) => {
    const result = await pool.query(`
SELECT id,title,description,industry,growth_outlook
FROM career_roles
WHERE id=$1
`, [roleId]);
    return result.rows[0] || null;
};
export const getCareerRoleSkills = async (roleId) => {
    const result = await pool.query(`
SELECT s.id,s.name,s.category,crs.importance,crs.is_required
FROM career_role_skills crs
JOIN skills s ON s.id=crs.skill_id
WHERE crs.career_role_id=$1
ORDER BY crs.importance DESC,s.name
`, [roleId]);
    return result.rows;
};
export const getUserSkillsForCareer = async (userId) => {
    const result = await pool.query(`
SELECT s.id,s.name,s.category,us.proficiency_level,us.years_experience
FROM user_skills us
JOIN skills s ON s.id=us.skill_id
WHERE us.user_id=$1
`, [userId]);
    return result.rows;
};
