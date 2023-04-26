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
            style={{flex: 1}}>
            <View style={{flexDirection: 'row', width: '100%', justifyContent: 'center'}}>
                <Image
                    style={{ width: imageSize, height: imageSize, alignSelf: 'flex-start', margin: 8 }}
                    source={require('../../assets/icons/trainer-info.png')} />

                <View style={[
                    {marginEnd: imageSize},
                    Platform.OS != 'web' ? { flex: 1 } : { minWidth: 300 }
                ]}>
                    <Text style={tw`text-5xl font-bold`}>Login</Text>

                    <View style={{ marginTop: 12, marginBottom: 6 }}>
                        <AppInputField
                            label={"Username"}
                            style={tw`min-w-full`}
                            onTextChange={(text: string) => setCredentials({
                                ...credentials,
                                username: {
                                    error: false,
                                    value: text
                                }
                            })} />

                        {credentials.username.error && (
                            <Text style={tw`text-sm text-red`}>Please enter your username.</Text>
                        )}
                    </View>


                    <View style={{ marginTop: 6, marginBottom: 12 }}>
                        <AppInputField
                            label={"Password"}
                            style={tw`min-w-full`}
                            isSecure={true}
                            onTextChange={(text: string) =>
                                setCredentials({
                                    ...credentials,
                                    password: {
                                        error: false,
                                        value: text
                                    }
                                })} />

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
