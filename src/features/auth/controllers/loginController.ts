import { Request, Response } from "express"
import { authService } from "../services/authService"
import { loginInputType, loginSuccessType } from "./types/loginTypes"

export const loginController = async (req: Request<{}, {}, loginInputType>, res: Response<loginSuccessType>) => {
    const accessToken = await authService.login(req.body.loginOrEmail, req.body.password)

    if (!accessToken) {
        res.sendStatus(401)
        return
    }

    res.status(200).send({accessToken})
    return
}