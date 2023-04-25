import User from "../models/User"
import dataInstance, { DataStore } from "./DataStore"

export default class Authenticator {

    _userKey: string = "Nascent-Pokemon-App-User"
    _sessionTokenKey: string = "Nascent-Pokemon-App-Token"

    dataStore: DataStore = dataInstance.insecure

    async authenticate(user: User, sessionToken: string): Promise<void> {
        this.dataStore.write(this._userKey, user)
        this.dataStore.write(this._sessionTokenKey, sessionToken)
    }

    async getAuthenticatedSession(): Promise<[User, string] | null> {
        const user = await this.dataStore.read<User>(this._userKey)
        const token = await this.dataStore.read<string>(this._sessionTokenKey)

        if (user !== undefined && user && token !== undefined && token) {
            console.log("found authenticated session: ", user, token)
            return [user as User, token as string]
        }

        return null
    }

    logout() {
        this.dataStore.delete(this._userKey)
        this.dataStore.delete(this._sessionTokenKey)
        this.dataStore.clear()
    }

}
