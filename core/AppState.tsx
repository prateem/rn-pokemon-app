import React, {createContext, PropsWithChildren, useContext, useState} from "react"
import User from "../models/User"

export interface AppState {
    user?: User | null
    sessionToken?: string | null
}

interface AppStateManagement {
    current: AppState,
    update: (updates: Partial<AppState>) => void
}

const AppStateContext: React.Context<{
    current: AppState,
    update: (updates: Partial<AppState>) => void
}> = createContext<AppStateManagement>({ current: {}, update: (_) => { } })

export function useAppState(): AppStateManagement {
    return useContext(AppStateContext)
}

export function AppStateProvider(props: PropsWithChildren) {
    const [appState, setAppState] = useState<AppState>({})

    const value: AppStateManagement = {
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
