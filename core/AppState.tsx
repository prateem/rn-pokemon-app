import React, {createContext, PropsWithChildren, useContext, useState} from "react"
import User from "../models/User"

export interface AppState {
    user?: User
    sessionToken?: string,
    deepLink?: Array<any>
}

const AppStateContext: React.Context<{
    current: AppState,
    update: (updates: Partial<AppState>) => void
}> = createContext({ current: {}, update: (_) => { } })

export function useAppState(): {
    current: AppState,
    update: (updates: Partial<AppState>) => void
} {
    return useContext(AppStateContext)
}

export function AppStateProvider(props: PropsWithChildren) {
    const [appState, setAppState] = useState<AppState>({})

    const value = {
        current: appState,
        update: (update: Partial<AppState>) => {
            setAppState({...appState, ...update})
        }
    }

    return (
        <AppStateContext.Provider value={value}>
            {props.children}
        </AppStateContext.Provider>
    )
}
