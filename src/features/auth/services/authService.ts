import { WithId } from "mongodb"
import { jwtService } from "../../../application/jwtService"
import { usersRepository } from "../../users/usersRepository"
import bcrypt from 'bcrypt'
import { UserDbType } from "../../../db/user-db-type"

export const authService = {
    async login(loginOrEmail: string, password: string): Promise<string | null> {
        const user = await this.checkCredentials(loginOrEmail, password)

        if(!user) return null

        return await jwtService.createToken(user._id.toString(), user.login)
    },

    async checkCredentials(loginOrEmail: string, password: string): Promise<WithId<UserDbType> | null> {
        const user: WithId<UserDbType> | null = await usersRepository.findUserByLoginOrEmail(loginOrEmail)

        if (!user) return null

        const isCorrect = await bcrypt.compare(password, user.passwordHash)

        if(!isCorrect) return null

        return user
    }
}