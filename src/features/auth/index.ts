import { Router } from "express";
import { loginController } from "./controllers/loginController";
import { authController } from "./controllers/authController";
import { authValidators } from "./middlewares/authValidators";
import { authJWTMiddleware } from "../../global-middlewares/authJWTMiddleware";
import { registrationController } from "./controllers/registrationController";
import { emailConfirmationController } from "./controllers/emailConfirmationController";
import { emailResendingController } from "./controllers/emailResendingController";
import { registrationValidators } from "./middlewares/registrationValidators";
import { emailConfirmationValidators } from "./middlewares/emailConfirmationValidators";
import { emailResendingValidators } from "./middlewares/emailResendingValidators";

export const authRouter = Router({})

authRouter.post('/registration', registrationValidators, registrationController)
authRouter.post('/registration-confirmation', emailConfirmationValidators, emailConfirmationController)
authRouter.post('/registration-email-resending', emailResendingValidators, emailResendingController)
authRouter.post('/login', ...authValidators, loginController)
authRouter.get('/me', authJWTMiddleware, authController)