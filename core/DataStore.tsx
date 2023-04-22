import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SecureStore from 'expo-secure-store'

export interface DataStore {
    write(key: string, value: any): Promise<void>
    read<T>(key: string): Promise<T | null>
    delete(key: string): Promise<void>
    clear(): void
}

class InsecureDataStore implements DataStore {
    async write(key: string, value: any) {
        try {
            await AsyncStorage.setItem(
                key,
                JSON.stringify(value)
            );
        } catch (error) {
            // There was an error on the native side
            handleError(error)
        }
    }

    async read<T>(key: string): Promise<T | null> {
        try {
            const value = await AsyncStorage.getItem(key);

            if (value !== undefined) {
                const stored = value as string
                return JSON.parse(stored) as T
            }
        } catch (error) {
            // unsuccessful
            handleError(error)
        }

        return null
    }

    async delete(key: string) {
        await AsyncStorage.removeItem(key)
    }

    clear() {
        AsyncStorage.clear()
    }
}

class SecureDataStore implements DataStore {
    async write(key: string, value: any) {
        try {
            return SecureStore.setItemAsync(key, JSON.stringify(value))
        } catch (error) {
            handleError(error)
            return
        }
    }

    async read<T>(key: string): Promise<T | null> {
        let result = await SecureStore.getItemAsync(key)
        if (result == null) {
            return null
        }

        try {
            return JSON.parse(result) as T
        } catch (error) {
            handleError(error)
            return null
        }
    }

    async delete(key: string) {
        await SecureStore.deleteItemAsync(key)
    }

    clear() {
        // no-op?
    }
}

let insecureDataStore = Object.freeze(new InsecureDataStore())
let secureDataStore = Object.freeze(new SecureDataStore())
export default {
    insecure: insecureDataStore,
    secure: secureDataStore
}

function handleError(error: any) {
    let isDebug = true
    if (isDebug) {
        console.log(error)
    }
}
