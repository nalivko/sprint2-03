import { Request, Response } from "express"
import { authService } from "../services/authService"
import { registrationEmailResendingType } from "../types/authTypes"

export const emailResendingController = async (req: Request<{}, {}, registrationEmailResendingType>, res: Response<string | null>) => {
    const result = await authService.resendConfirmationCode(req.body.email)

    res.status(result.status).send(result.errorMessage)
}