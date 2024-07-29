import { ObjectId } from "mongodb";
import { usersCollection } from "../../db/mongodb";
import { UserDbType } from "../../db/user-db-type";
import { UserInputModel, UserViewModel } from "./types/users-type";

export const usersRepository = {
    async doesUserExist(user: UserInputModel): Promise<{ isUnique: boolean, field: string | null }> {
        if (await usersCollection.findOne({ login: user.login })) {
            return { isUnique: false, field: 'login' }
        }

        if (await usersCollection.findOne({ email: user.email })) {
            return { isUnique: false, field: 'email' }
        }

        return { isUnique: true, field: null }
    },

    async createUser(user: UserDbType): Promise<UserViewModel> {
        await usersCollection.insertOne(user)

        return {
            id: (user._id!).toString(),
            login: user.login,
            email: user.email,
            createdAt: user.createdAt
        };
    },

    async deleteUserById(id: string) {
        const result = await usersCollection.deleteOne({ _id: new ObjectId(id) })

        return result.deletedCount === 1
    },

    async findUserByLoginOrEmail(loginOrEmail: string) {
        return await usersCollection.findOne(
            {
                $or:
                    [
                        { login: loginOrEmail },
                        { email: loginOrEmail }
                    ]
            }
        )
    },

    async getUserById(id: string) {
        return await usersCollection.findOne({ _id: new ObjectId(id) })
    }
}