import { Request, Response } from "express"
import { authService } from "../services/authService"
import { ConfirmationCodeType } from "../types/authTypes"

export const emailConfirmationController = async (req: Request<{}, {}, ConfirmationCodeType>, res: Response) => {
    const result = await authService.confirmEmail(req.body.code)

    res.status(result.status).send(result.errorMessage)
}