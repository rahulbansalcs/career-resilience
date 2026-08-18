import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { createUser, findUserByEmail, findUserById } from "../repositories/user.repository.js";
export const register = async (email, password, firstName, lastName) => {
    const existingUser = await findUserByEmail(email);
    if (existingUser)
        throw new Error("EMAIL_ALREADY_EXISTS");
    const passwordHash = await bcrypt.hash(password, 12);
    return createUser(email, passwordHash, firstName, lastName);
};
export const login = async (email, password) => {
    const user = await findUserByEmail(email);
    if (!user)
        throw new Error("INVALID_CREDENTIALS");
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword)
        throw new Error("INVALID_CREDENTIALS");
    const token = jwt.sign({ userId: user.id }, env.JWT_SECRET, { expiresIn: "7d" });
    return { token, user: { id: user.id, email: user.email, firstName: user.first_name, lastName: user.last_name } };
};
export const getCurrentUser = async (userId) => {
    const user = await findUserById(userId);
    if (!user)
        throw new Error("USER_NOT_FOUND");
    return user;
};
