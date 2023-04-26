import React, { useState } from 'react'
import {Text, View, TextInput, Pressable, Image, Platform, KeyboardAvoidingView} from 'react-native'
import type { StackScreenProps } from '@react-navigation/stack'
import User from '../../models/User'
import Authenticator from '../../core/Authenticator'
import { useAppState } from '../../core/AppState'
import styles from '../../views/styles'
import {UnauthenticatedRoute} from "../core/UnauthenticatedFlow";
import {StackActions} from "@react-navigation/native";

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
                    <Text style={{...styles.labels.heading}}>Login</Text>

                    <View style={{ marginTop: 12, marginBottom: 6 }}>
                        <Text style={styles.labels.normal}>Username</Text>
                        <TextInput style={{...styles.components.textInput, width: '100%'}}
                                   onChangeText={(text: string) => setCredentials({
                                       ...credentials,
                                       username: {
                                           error: false,
                                           value: text
                                       }
                                   })}
                        />
                        {credentials.username.error && (
                            <Text style={styles.labels.error}>Please enter your username.</Text>
                        )}
                    </View>


                    <View style={{ marginTop: 6, marginBottom: 12 }}>
                        <Text style={styles.labels.normal}>Password</Text>
                        <TextInput style={{...styles.components.textInput, width: '100%'}}
                                   onChangeText={(text: string) => setCredentials({
                                       ...credentials,
                                       password: {
                                           error: false,
                                           value: text
                                       }
                                   })}
                                   secureTextEntry={true} />
                        {credentials.password.error && (
                            <Text style={styles.labels.error}>Please enter your password.</Text>
                        )}
                    </View>


                    <Pressable onPress={(event) => { validate() }}>
                        <Text style={styles.components.button}>Login</Text>
                    </Pressable>
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}
