import { body } from "express-validator";
import { checkErrorsMiddleware } from "../../../global-middlewares/checkErrorsMiddleware";

const nameValidator =
    body('login')
        .isString().withMessage('login must be a string')
        .trim()
        .isLength({ min: 3, max: 10 }).withMessage('The login length must be between 3 and 10 characters')

const passwordValidator =
    body('password')
        .isString().withMessage('password must be a string')
        .trim()
        .isLength({ min: 6, max: 20 }).withMessage('The password length must be between 6 and 20 characters')

const emailValidator =
    body('email')
        .isEmail()

export const userValidators = [
    nameValidator,
    passwordValidator,
    emailValidator,
    checkErrorsMiddleware
]