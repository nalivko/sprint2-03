import { Router } from "express";
import { loginController } from "./controllers/loginController";
import { authController } from "./controllers/authController";
import { authValidators } from "./middlewares/authValidators";
import { authJWTMiddleware } from "../../global-middlewares/authJWTMiddleware";

export const authRouter = Router({})

authRouter.post('/login', ...authValidators, loginController)
authRouter.get('/me', authJWTMiddleware, authController)