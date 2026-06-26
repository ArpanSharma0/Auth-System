import jwt from "jsonwebtoken";
import crypto from "crypto";
import config from "../config/config.js";
import userModel from "../models/user.model.js";
import sessionModel from "../models/session.model.js";

/**
 * Middleware to require and validate a JWT Access Token.
 * Attaches the authenticated user object (`req.user`) and user ID (`req.userId`) to the request.
 */
export async function requireAccessToken(req, res, next) {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token not found"
            });
        }

        const decoded = jwt.verify(token, config.JWT_SECRET);
        const user = await userModel.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        req.user = user;
        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: error.name === "TokenExpiredError" ? "Token expired" : "Invalid token"
        });
    }
}

/**
 * Middleware to require and validate a JWT Refresh Token from cookies.
 * Checks if the corresponding session exists and is active.
 * Attaches the session object (`req.session`), user ID (`req.userId`), and original token (`req.refreshToken`) to the request.
 */
export async function requireRefreshToken(req, res, next) {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Refresh token not found"
            });
        }

        const decoded = jwt.verify(refreshToken, config.JWT_SECRET);
        const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

        const session = await sessionModel.findOne({
            refreshToken: refreshTokenHash,
            revoked: false
        });

        if (!session) {
            return res.status(401).json({
                success: false,
                message: "Invalid session or session already revoked"
            });
        }

        req.userId = decoded.id;
        req.session = session;
        req.refreshToken = refreshToken;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: error.name === "TokenExpiredError" ? "Refresh token expired" : "Invalid refresh token"
        });
    }
}
