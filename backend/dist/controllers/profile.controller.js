import { createUserSkill, editUserSkill, getProfile, listSkills, listUserSkills, removeUserSkill, saveProfile } from "../services/profile.service.js";
import { profileSchema, userSkillSchema } from "../validators/profile.validator.js";
const getUserId = (req) => {
    if (!req.userId)
        throw new Error("UNAUTHORIZED");
    return req.userId;
};
export const getProfileController = async (req, res) => {
    try {
        const profile = await getProfile(getUserId(req));
        res.json({ profile });
    }
    catch {
        res.status(401).json({ error: "Unauthorized" });
    }
};
export const updateProfileController = async (req, res) => {
    try {
        const data = profileSchema.parse(req.body);
        const profile = await saveProfile(getUserId(req), data);
        res.json({ profile });
    }
    catch (error) {
        if (error instanceof Error && error.name === "ZodError") {
            res.status(400).json({ error: "Invalid profile data" });
            return;
        }
        res.status(500).json({ error: "Internal server error" });
    }
};
export const listSkillsController = async (req, res) => {
    try {
        const skills = await listSkills();
        res.json({ skills });
    }
    catch {
        res.status(500).json({ error: "Internal server error" });
    }
};
export const listUserSkillsController = async (req, res) => {
    try {
        const skills = await listUserSkills(getUserId(req));
        res.json({ skills });
    }
    catch {
        res.status(401).json({ error: "Unauthorized" });
    }
};
export const addUserSkillController = async (req, res) => {
    try {
        const data = userSkillSchema.parse(req.body);
        const skill = await createUserSkill(getUserId(req), data.skillId, data.proficiencyLevel, data.yearsExperience, data.lastUsedAt);
        res.status(201).json({ skill });
    }
    catch (error) {
        if (error instanceof Error && error.name === "ZodError") {
            res.status(400).json({ error: "Invalid skill data" });
            return;
        }
        res.status(500).json({ error: "Unable to add skill" });
    }
};
export const updateUserSkillController = async (req, res) => {
    try {
        const skillId = String(req.params.skillId);
        const data = userSkillSchema.parse(req.body);
        const skill = await editUserSkill(getUserId(req), skillId, data.proficiencyLevel, data.yearsExperience, data.lastUsedAt);
        if (!skill) {
            res.status(404).json({ error: "Skill not found" });
            return;
        }
        res.json({ skill });
    }
    catch (error) {
        if (error instanceof Error && error.name === "ZodError") {
            res.status(400).json({ error: "Invalid skill data" });
            return;
        }
        res.status(500).json({ error: "Unable to update skill" });
    }
};
export const deleteUserSkillController = async (req, res) => {
    try {
        const skillId = String(req.params.skillId);
        const deleted = await removeUserSkill(getUserId(req), skillId);
        if (!deleted) {
            res.status(404).json({ error: "Skill not found" });
            return;
        }
        res.status(204).send();
    }
    catch {
        res.status(500).json({ error: "Unable to delete skill" });
    }
};
