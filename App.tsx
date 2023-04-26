import 'react-native-gesture-handler'
import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { AppStateProvider } from './core/AppState'
import AppRouter from './core/AppRouter'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import {QueryClient, QueryClientProvider} from "react-query";

// FIXME need reanimated update, see https://github.com/software-mansion/react-native-reanimated/issues/3355
if (typeof window !== undefined) {
    // @ts-ignore
    window._frameTimestamp = null
}

const queryClient = new QueryClient()

export default function App() {
    return (
        // <SafeAreaProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <AppStateProvider>
                    <QueryClientProvider client={queryClient}>
                        <AppRouter />

                        <StatusBar style="auto" />
                    </QueryClientProvider>
                </AppStateProvider>
            </GestureHandlerRootView>
        // </SafeAreaProvider>
    )
}

String.prototype.toTitleCase = function () {
    return this.replace(
        /\b\w+/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.slice(1, txt.length).toLowerCase();
        }
    )
}

// // `data` is an array of objects, `key` is the key (or property accessor) to group by
// // reduce runs this anonymous function on each element of `data` (the `item` parameter,
// // returning the `storage` parameter at the end
// Array.prototype.groupBy = function(key) {
//     return this.reduce(function(storage, item) {
//         // get the first instance of the key by which we're grouping
//         const group = item[key];
//
//         // set `storage` for this instance of group to the outer scope (if not empty) or initialize it
//         storage[group] = storage[group] || [];
//
//         // add this item to its group within `storage`
//         storage[group].push(item);
//
//         // return the updated storage to the reduce function, which will then loop through the next
//         return storage;
//     }, {}); // {} is the initial value of the storage
// }
