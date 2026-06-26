import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { requireAccessToken, requireRefreshToken } from "../middlewares/auth.middleware.js";

const authRouter = Router();

/**
 * POST /api/auth/register
 */
authRouter.post("/register", authController.register);

/**
 * POST /api/auth/login
 */
authRouter.post("/login", authController.login);

/**
 * GET /api/auth/get-me
 */
authRouter.get("/get-me", requireAccessToken, authController.getMe);

/**
 * GET /api/auth/refresh-token
 */
authRouter.get("/refresh-token", requireRefreshToken, authController.refreshToken);

/**
 * GET /api/auth/logout
 */
authRouter.get("/logout", requireRefreshToken, authController.logout);

/**
 * GET /api/auth/logout-all
 */
authRouter.get("/logout-all", requireRefreshToken, authController.logoutAll);

/**
 * GET /api/auth/verify-email
 */
authRouter.get("/verify-email", authController.verifyEmail);

export default authRouter;