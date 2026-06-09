import { Router } from "express";
import { loginUser, logoutUser, registerUser, getMe } from "../controllers/auth.controller.js";
import { LoginValidator, RegisterationValidator } from "../validators/auth.validator.js";

const authRouter = Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
authRouter.post("/register", RegisterationValidator, registerUser);

/**
 * @route POST /api/auth/login
 * @desc Login a user
 * @access Public
 */
authRouter.post("/login", LoginValidator, loginUser);

/**
 * @route POST /api/auth/logout
 * @desc Logout a user
 * @access Private
 */
authRouter.post("/logout", logoutUser)

/**
 * @route POST /api/auth/get-me
 * @desc Verify user token
 * @access Private
 */
authRouter.get("/get-me", getMe)

export default authRouter;