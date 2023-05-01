import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SecureStore from 'expo-secure-store'

export interface DataStore {
    read<T>(key: string): Promise<T | null>
    write(key: string, value: any): Promise<void>
    delete(key: string): Promise<void>
    clear(): void
}

class InMemoryDataStore implements DataStore {
    items: any = { }

    clear(): void {
        this.items = { }
    }

    async delete(key: string): Promise<void> {
        this.items.delete(key)
    }

    async read<T>(key: string): Promise<T | null> {
        const entry = this.items[key]
        if (entry && entry as T) {
            console.log("found in memory", key)
            return entry
        }

        return null
    }

    async write(key: string, value: any): Promise<void> {
        this.items[key] = value
    }

}

class InsecureDataStore implements DataStore {
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

    async delete(key: string) {
        await AsyncStorage.removeItem(key)
    }

    clear() {
        AsyncStorage.clear()
    }
}

class SecureDataStore implements DataStore {
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

    async write(key: string, value: any) {
        try {
            return SecureStore.setItemAsync(key, JSON.stringify(value))
        } catch (error) {
            handleError(error)
            return
        }
    }

    async delete(key: string) {
        await SecureStore.deleteItemAsync(key)
    }

    clear() {
        // no-op?
    }
}

let inMemoryDataStore = Object.freeze(new InMemoryDataStore())
let insecureDataStore = Object.freeze(new InsecureDataStore())
let secureDataStore = Object.freeze(new SecureDataStore())

export default {
    inMemory: inMemoryDataStore,
    insecure: insecureDataStore,
    secure: secureDataStore
}

function handleError(error: any) {
    let isDebug = true
    if (isDebug) {
        console.log(error)
    }
}
