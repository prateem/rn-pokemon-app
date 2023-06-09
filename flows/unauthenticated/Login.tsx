import React, { useState } from 'react'
import {Text, View, Image, Platform, KeyboardAvoidingView} from 'react-native'
import type { StackScreenProps } from '@react-navigation/stack'
import User from '../../models/User'
import Authenticator from '../../core/Authenticator'
import { useAppState } from '../../core/AppState'
import {UnauthenticatedRoute} from "./UnauthenticatedFlow";
import {StackActions} from "@react-navigation/native";
import tw from "twrnc";
import AppButton from "../../views/components/AppButton";
import AppInputField from "../../views/components/AppInputField";

interface Credentials {
    username: {
        error: boolean
        value: string
    }
    password: {
        error: boolean
        value: string
    }
}

export default function Login({ navigation }: StackScreenProps<UnauthenticatedRoute, 'login'>) {
    const appState = useAppState();
    const [credentials, setCredentials] = useState<Credentials>({
        username: {
            error: false,
            value: ""
        },
        password: {
            error: false,
            value: ""
        }
    })

    function validate() {
        let isUsernameError = credentials.username.value.length === 0
        let isPasswordError = credentials.password.value.length === 0

        if (isUsernameError || isPasswordError) {
            setCredentials({
                username: { ...credentials.username, error: isUsernameError },
                password: { ...credentials.password, error: isPasswordError }
            })
            return
        }

        const user: User = { username: credentials.username.value, name: { first: "Banana", last: "Yoshimoto" } }
        const sessionToken: string = "abcdefg"

        const authenticator = new Authenticator()
        authenticator.authenticate(user, sessionToken)
            .then(() => {
                appState.update({
                    user,
                    sessionToken
                })

                navigation.dispatch(StackActions.replace('app'))
            })
    }

    const imageSize = 64

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={tw`flex-1`}>
            <View style={tw`flex-1 flex-row w-full self-center justify-center items-center`}>
                <Image
                    style={tw.style(`self-start, m-2`, { width: imageSize, height: imageSize })}
                    source={require('../../assets/icons/trainer-info.png')} />

                <View style={tw.style(
                    {marginEnd: imageSize},
                    Platform.OS == 'web' ? `w-min-75` : `flex-1`
                )}>
                    <Text style={tw`text-3xl web:text-5xl font-bold`}>Login</Text>

                    <View style={tw`mt-3 mb-1`}>
                        <AppInputField
                            label={"Username"}
                            style={tw`min-w-full`}
                            inputProps={{
                                secureTextEntry: true,
                                onChangeText: (text) => {
                                    setCredentials({
                                        ...credentials,
                                        username: {
                                            error: false,
                                            value: text
                                        }
                                    })
                                }
                            }}
                        />

                        {credentials.username.error && (
                            <Text style={tw`text-sm text-red`}>Please enter your username.</Text>
                        )}
                    </View>


                    <View style={tw`mt-1 mb-3`}>
                        <AppInputField
                            label={"Password"}
                            style={tw`min-w-full`}
                            inputProps={{
                                secureTextEntry: true,
                                onChangeText: (text) => {
                                    setCredentials({
                                        ...credentials,
                                        password: {
                                            error: false,
                                            value: text
                                        }
                                    })
                                }
                            }} />

                        {credentials.password.error && (
                            <Text style={tw`text-sm text-red`}>Please enter your password.</Text>
                        )}
                    </View>


                    <AppButton text={"Login"} onPress={() => validate()} />
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}
