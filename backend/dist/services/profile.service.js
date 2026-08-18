import { createProfile, findProfileByUserId, updateProfile } from "../repositories/profile.repository.js";
import { addUserSkill, deleteUserSkill, getAllSkills, getUserSkills, updateUserSkill } from "../repositories/skill.repository.js";
export const getProfile = async (userId) => {
    return findProfileByUserId(userId);
};
export const saveProfile = async (userId, data) => {
    const existing = await findProfileByUserId(userId);
    if (existing)
        return updateProfile(userId, data);
    return createProfile(userId, data);
};
export const listSkills = async () => {
    return getAllSkills();
};
export const listUserSkills = async (userId) => {
    return getUserSkills(userId);
};
export const createUserSkill = async (userId, skillId, proficiencyLevel, yearsExperience, lastUsedAt) => {
    return addUserSkill(userId, skillId, proficiencyLevel, yearsExperience, lastUsedAt);
};
export const editUserSkill = async (userId, skillId, proficiencyLevel, yearsExperience, lastUsedAt) => {
    return updateUserSkill(userId, skillId, proficiencyLevel, yearsExperience, lastUsedAt);
};
export const removeUserSkill = async (userId, skillId) => {
    return deleteUserSkill(userId, skillId);
};
