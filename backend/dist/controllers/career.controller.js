import { analyzeCareerFit, listCareerRoles } from "../services/career.service.js";
export const getCareerRolesController = async (req, res) => {
    try {
        const roles = await listCareerRoles();
        res.json({ roles });
    }
    catch {
        res.status(500).json({ error: "Unable to load career roles" });
    }
};
export const analyzeCareerController = async (req, res) => {
    try {
        if (!req.userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const result = await analyzeCareerFit(req.userId, req.params.roleId);
        res.json(result);
    }
    catch (error) {
        if (error instanceof Error && error.message === "CAREER_ROLE_NOT_FOUND") {
            res.status(404).json({ error: "Career role not found" });
            return;
        }
        res.status(500).json({ error: "Unable to analyze career fit" });
    }
};
