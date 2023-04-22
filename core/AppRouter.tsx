
import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { getStateFromPath as defaultStateFromPath, NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Authenticator from './Authenticator'
import { useAppState } from './AppState'
import Login from '../views/screens/main/Login'
import Home from '../views/screens/main/Home'
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PokemonInfo from '../views/screens/nested/PokemonInfo'
import TrainerInfo from '../views/screens/nested/TrainerInfo'
import GymInfo from '../views/screens/nested/GymInfo'
import styles from '../views/styles'
import Loader from '../views/components/core/Loader'
import * as Linking from 'expo-linking'
import { processPath } from "./DeepLink"

export type AppRoute = {
    login: undefined;
    home: undefined;

    pokemon: { number: number };
    trainer: { id: number };
    gym: { number: number };
}

const Stack = createStackNavigator<AppRoute>();
const authenticator = new Authenticator();

export default function AppRouter() {

    const [loading, setLoading] = useState(true);
    const appState = useAppState()
    const insets = useSafeAreaInsets()
    const initialUrl = Linking.useURL()

    useEffect(() => {
        authenticator.getAuthenticatedSession()
            .then((session) => {
                if (session !== null) {
                    const [user, sessionToken] = session
                    const deepLink: any[] = []

                    // appState.update({ deepLink: test })
                    appState.update({
                        user,
                        sessionToken,
                        deepLink
                    })
                }
                setLoading(false)
            })
    }, []);

    function getInitialRoute(): keyof AppRoute {
        const isAuthenticated = appState.current.user != null;

        if (isAuthenticated) {
            return "home"
        } else {
            return "login"
        }
    }

    return (
        <View style={{
            flex: 1,
            // Paddings to handle safe area
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            paddingLeft: insets.left,
            paddingRight: insets.right,
        }}>
            {loading
                ? (<Loader />)
                : (
                    <NavigationContainer linking={{
                        prefixes: ['app://'],
                        config: {
                            screens: {
                                login: 'login',
                                home: {
                                    path: '',
                                    // @ts-ignore
                                    screens: {
                                        pokedex: 'pokedex',
                                        trainers: 'trainers',
                                        gyms: 'gyms'
                                    }
                                },

                                // screens
                                pokemon: 'pokemon/:number',
                                trainer: 'trainer/:id',
                                gym: 'gym/:number'
                            }
                        },
                        getStateFromPath: (path, options) => {
                            const linkedPath = processPath(path)
                            if (linkedPath.length == 0) {
                                return defaultStateFromPath(path, options)
                            }

                            const firstRoute = linkedPath[0].route
                            let targetTab = 'pokedex'
                            if (firstRoute == 'gym') {
                                targetTab = 'gyms'
                            } else if (firstRoute == 'trainer') {
                                targetTab = 'trainers'
                            }

                            const routes: any[] = [
                                { name: 'home', state: { routes: [{ name: targetTab }]}}
                            ]
                            linkedPath.forEach((path) => {
                                routes.push( { name: path.route, params: path.params })
                            })

                            return { routes: routes }
                        }
                    }}>
                        <Stack.Navigator
                            initialRouteName={getInitialRoute()}
                            screenOptions={{
                                headerStyle: styles.components.navigationBar,
                                headerTintColor: "white"
                            }}>

                            <Stack.Screen name="login" component={Login} options={{ headerShown: false }} />
                            <Stack.Screen name="home" component={Home} options={{ headerShown: false }} />

                            <Stack.Screen name="pokemon" component={PokemonInfo} />
                            <Stack.Screen name="trainer" component={TrainerInfo} />
                            <Stack.Screen name="gym" component={GymInfo} />

                        </Stack.Navigator>
                    </NavigationContainer>
                )}
        </View>
    )
}