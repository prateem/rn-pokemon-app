import 'react-native-gesture-handler'
import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { AppStateProvider } from './core/AppState'
import AppRouter from './core/AppRouter'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'

// FIXME need reanimated update, see https://github.com/software-mansion/react-native-reanimated/issues/3355
// if (process && process.browser) {
if (window) {
    // @ts-ignore
    window._frameTimestamp = null
}
// }

String.prototype.toTitleCase = function () {
    return this.replace(
        /\b\w+/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    )
}

export default function App() {
    return (
        // <SafeAreaProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <AppStateProvider>
                    <AppRouter />

                    <StatusBar style="auto" />
                </AppStateProvider>
            </GestureHandlerRootView>
        // </SafeAreaProvider>
    )
}
