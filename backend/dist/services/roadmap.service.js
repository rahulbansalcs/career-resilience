import { createRoadmapWithItems, getRoadmapById, getRoadmapItems, getRoadmapsByUser, updateRoadmapItemStatus, getRoadmapProgress } from "../repositories/roadmap.repository.js";
import { getCareerRoleById, getCareerRoleSkills, getUserSkillsForCareer } from "../repositories/career.repository.js";
export const generateRoadmap = async (userId, careerRoleId) => {
    const role = await getCareerRoleById(careerRoleId);
    if (!role)
        throw new Error("CAREER_ROLE_NOT_FOUND");
    const requiredSkills = await getCareerRoleSkills(careerRoleId);
    const userSkills = await getUserSkillsForCareer(userId);
    const userSkillMap = new Map(userSkills.map(skill => [skill.id, skill]));
    const gaps = requiredSkills.filter(skill => !userSkillMap.has(skill.id) || userSkillMap.get(skill.id).proficiency_level < 4);
    if (gaps.length === 0)
        throw new Error("NO_SKILL_GAPS");
    const highPriority = gaps.filter(skill => skill.importance >= 5);
    const mediumPriority = gaps.filter(skill => skill.importance >= 3 && skill.importance < 5);
    const lowPriority = gaps.filter(skill => skill.importance < 3);
    const orderedGaps = [...highPriority, ...mediumPriority, ...lowPriority];
    const items = orderedGaps.map(skill => {
        const priority = skill.importance >= 5 ? "high" : skill.importance >= 3 ? "medium" : "low";
        const estimatedHours = priority === "high" ? 20 : priority === "medium" ? 15 : 10;
        return {
            title: `Learn ${skill.name}`,
            description: `Develop practical proficiency in ${skill.name} to improve your readiness for the ${role.title} role.`,
            itemType: "skill",
            priority,
            estimatedHours,
            dueDate: null
        };
    });
    return createRoadmapWithItems(userId, careerRoleId, `${role.title} Career Roadmap`, `Personalized skill development roadmap based on your current skills and the requirements of the ${role.title} role.`, items);
};
export const listUserRoadmaps = async (userId) => {
    return getRoadmapsByUser(userId);
};
export const getUserRoadmap = async (userId, roadmapId) => {
    const roadmap = await getRoadmapById(userId, roadmapId);
    if (!roadmap)
        return null;
    const items = await getRoadmapItems(roadmapId);
    const progress = await getRoadmapProgress(roadmapId);
    return { ...roadmap, items, progress };
};
export const updateUserRoadmapItemStatus = async (userId, itemId, status) => {
    return updateRoadmapItemStatus(userId, itemId, status);
};
