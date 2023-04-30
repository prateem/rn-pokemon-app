
import React, { useEffect, useState } from 'react'
import {View} from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Authenticator from './Authenticator'
import { useAppState } from './AppState'
import Loader from '../views/components/core/Loader'
import UnauthenticatedFlow from "../flows/unauthenticated/UnauthenticatedFlow";
import AuthenticatedFlow from "../flows/authenticated/AuthenticatedFlow";
import tw from "twrnc";

const authenticator = new Authenticator();

type CoreRoute = {
    onboarding: undefined
    app: undefined
}
const CoreStack = createStackNavigator<CoreRoute>()

export default function AppRouter() {

    const [hydrating, setHydrating] = useState(true);
    const appState = useAppState()

    useEffect(() => {
        setHydrating(true)

        authenticator.getAuthenticatedSession()
            .then((session) => {
                if (session !== null) {
                    const [user, sessionToken] = session

                    appState.update({
                        user,
                        sessionToken
                    })
                }

                setHydrating(false)
            })
    }, []);

    return (
        <View style={tw`flex-1`}>
            {hydrating
                ? (<Loader />)
                : (
                    <NavigationContainer linking={{
                        prefixes: ['app://'],
                        config: {
                            screens: {
                                onboarding: {
                                    // path: 'onboarding',
                                    // @ts-ignore
                                    screens: {
                                        'login': 'login'
                                    }
                                },
                                app: {
                                    path: '',
                                    // @ts-ignore
                                    screens: {
                                        home: {
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
                                }
                            }
                        },
                        getStateFromPath: (path, options) => {
                            if (!appState.current.user) {
                                console.log('Not authenticated yet; redirecting to login.')
                                return { routes: [{ name: 'onboarding' }] }
                            }

                            return { routes: [{name: 'app'}] }
                        }
                    }}>
                        <CoreStack.Navigator
                            initialRouteName={appState.current.user ? 'app' : 'onboarding'}
                            screenOptions={{headerShown: false}}>
                            <CoreStack.Group>
                                <CoreStack.Screen name="onboarding" component={UnauthenticatedFlow} />
                            </CoreStack.Group>

                            <CoreStack.Group>
                                <CoreStack.Screen name="app" component={AuthenticatedFlow} />
                            </CoreStack.Group>
                        </CoreStack.Navigator>
                    </NavigationContainer>
                )}
        </View>
    )
}