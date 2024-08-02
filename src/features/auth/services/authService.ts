import bcrypt from 'bcrypt'
import { randomUUID } from "crypto"
import { add } from "date-fns/add"
import { WithId } from "mongodb"
import { bcryptService } from "../../../application/bcryptService"
import { jwtService } from "../../../application/jwtService"
import { UserDbType } from "../../../db/user-db-type"
import { emailManager } from "../../../managers/email-manager"
import { Result } from "../../../types/resultType"
import { usersRepository } from "../../users/usersRepository"

export const authService = {
    async registerUser(login: string, email: string, password: string): Promise<Result<UserDbType | null>> {
        const user = await usersRepository.doesExistByLoginOrEmail(login, email)
        if (user) {
            return {
                status: 400,
                exttensions: [{
                    message: "User allready exist",
                    field: "login or email"
                }],
                data: null
            }
        }
        const passwordHash = await bcryptService.generateHash(password)
        const newUser: UserDbType = {
            login,
            email,
            passwordHash,
            createdAt: new Date().toISOString(),
            emailConfirmation: {
                confirmationCode: randomUUID(),
                confirmationCodeExpirationDate: add(new Date(), {
                    hours: 1,
                    minutes: 30
                }),
                isConfirmed: false
            }
        }
        await usersRepository.createUser(newUser)

        try {
            await emailManager.sendConfirmationCode(newUser.email, newUser.emailConfirmation.confirmationCode)
        } catch (error) {
            console.error(error)
        }

        return {
            status: 204,
            // data: newUser
            data: null
        }
    },

    async confirmEmail(code: string): Promise<Result> {
        let user = await usersRepository.findUserByConfirmationCode(code)
        if (!user) {
            return {
                status: 400,
                exttensions: [{
                    message: 'User with this code not found',
                    field: "confirmationCode"
                }],
                data: null
            }
        }
        if (user.emailConfirmation.isConfirmed) {
            return {
                status: 400,
                exttensions: [{
                    message: 'This code allready applied',
                    field: "isConfirmed"
                }],
                data: null
            }
        }
        if (user.emailConfirmation.confirmationCodeExpirationDate < new Date()) {
            return {
                status: 400,
                exttensions: [{
                    message: 'the confirmation code has expired',
                    field: "confirmationCodeExpirationDate"
                }],
                data: null
            }
        }
        if (user.emailConfirmation.confirmationCode === code && user.emailConfirmation.confirmationCodeExpirationDate > new Date()) {
            let result = await usersRepository.updateConfirmation(user._id.toString())
            if (result) {
                return {
                    status: 204,
                    data: null
                }
            }
        }
        return {
            status: 400,
            exttensions: [{
                message: 'error',
                field: "field"
            }],
            data: null
        }
    },

    async login(loginOrEmail: string, password: string): Promise<string | null> {
        const user = await this.checkCredentials(loginOrEmail, password)

        if (!user) return null

        return await jwtService.createToken(user._id.toString(), user.login)
    },

    async checkCredentials(loginOrEmail: string, password: string): Promise<WithId<UserDbType> | null> {
        const user: WithId<UserDbType> | null = await usersRepository.findUserByLoginOrEmail(loginOrEmail)

        if (!user) return null

        const isCorrect = await bcrypt.compare(password, user.passwordHash)

        if (!isCorrect) return null

        return user
    },

    async resendConfirmationCode(email: string): Promise<Result<null>> {
        const user = await usersRepository.findUserByLoginOrEmail(email)
        if (!user) {
            return {
                status: 400,
                exttensions: [{
                    message: 'User with this email not found',
                    field: "email"
                }],
                data: null
            }
        }
        if (user.emailConfirmation.isConfirmed === true) {
            return {
                status: 400,
                exttensions: [{
                    message: 'User with this email allready confirmed',
                    field: "isConfirmed"
                }],
                data: null
            }
        }

        return {
            status: 204,
            data: null
        }
    }
}