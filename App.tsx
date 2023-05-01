import 'react-native-gesture-handler'
import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { AppStateProvider } from './core/AppState'
import AppRouter from './core/AppRouter'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import {QueryClient, QueryClientProvider} from "react-query";
import {ViewStyle} from "react-native";
import { useDeviceContext } from 'twrnc';
import tw from "twrnc";

const queryClient = new QueryClient()
export default function App() {
    useDeviceContext(tw);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <AppStateProvider>
                <QueryClientProvider client={queryClient}>
                    <AppRouter />

                    <StatusBar style="auto" />
                </QueryClientProvider>
            </AppStateProvider>
        </GestureHandlerRootView>
    )
}

export type PropsWithStyle = {
    style?: ViewStyle | undefined
}

// FIXME need reanimated update, see https://github.com/software-mansion/react-native-reanimated/issues/3355
if (typeof window !== undefined) {
    // @ts-ignore
    window._frameTimestamp = null
}

String.prototype.toTitleCase = function () {
    return this.replace(
        /\b\w+/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.slice(1, txt.length).toLowerCase();
        }
    )
}
