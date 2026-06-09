import * as tokenUtil from "../utils/token.util.js";


export async function authMiddleware(req, res, next) {

    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" })
    }

    const decoded = await tokenUtil.decodeToken(token)

    if (!decoded) {
        return res.status(401).json({ message: "Unauthorized" })
    }

    req.user = decoded;
    next();
}