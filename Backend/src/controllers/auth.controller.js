import * as UserDAO from "../dao/user.dao.js"
import * as tokenUtil from "../utils/token.util.js"
import { hashPassword, comparePassword } from "../utils/password.util.js";

export const registerUser = async (req, res) => {
    try{
    const { fullname, email, password } = req.body;

    const userExists = await UserDAO.findUserByEmail(email);

    if (userExists) {
        return res.status(409).json({
            success: false,
            message: "User already exists"
        })
    }

    const hashedPassword = await hashPassword(password);

    const user = await UserDAO.createUser(fullname, email, hashedPassword);

    const token = await tokenUtil.generateToken({ id: user._id, name: user.fullName, email: user.email });

    res.cookie("token", token, { maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true, sameSite: "lax" });

    return res.status(201).json({
        success: true,
        message: "User created successfully",
        token
    })
    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Internal server error, registration failed"
        })
    }
}

export const loginUser = async (req, res) => {
    try{
    const {email, password} = req.body;

    const user = await UserDAO.findUserByEmail(email);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        })
    }

    const isPasswordValid = await comparePassword(password, user.password)

    if (!isPasswordValid) {
        return res.status(401).json({
            success: false,
            message: "Invalid credentials"
        })
    }

    const token = await tokenUtil.generateToken({ id: user._id, name: user.fullName, email: user.email });

    res.cookie("token", token, { maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true, sameSite: "lax" });

    return res.status(200).json({
        success: true,
        message: "User logged in successfully",
        token
    })
    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Internal server error, login failed"
        })
    }
}

export const logoutUser = async (req, res) => {
    
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            })
        }

        res.clearCookie("token");
        return res.status(200).json({
            success: true,
            message: "User logged out successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

export const getMe = async (req, res) => {
    try{
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            })
        }

        const decodedToken = await tokenUtil.decodeToken(token);

        return res.status(200).json({
            success: true,
            message: "User details fetched successfully",
            user: decodedToken
        })

    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Internal server error, token verification failed"
        })
    }
}