import React, { useState } from 'react'
import { Text, View, TextInput, Pressable, Image } from 'react-native'
import type { StackScreenProps } from '@react-navigation/stack'
import { AppRoute } from '../../../core/AppRouter'
import User from '../../../models/User'
import Authenticator from '../../../core/Authenticator'
import { useAppState } from '../../../core/AppState'
import styles from '../../styles'

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

export default function Login({ navigation }: StackScreenProps<AppRoute, 'login'>) {
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

                navigation.replace('home');
            })
    }

    return (
        <View style={[styles.components.container, styles.alignment.centered]}>
            <View>
                <Text style={styles.labels.heading}>Login</Text>

                <Image
                    style={{ width: 180, height: 120, alignSelf: 'center', borderWidth: 1, margin: 8 }}
                    source={{ uri: 'https://images.unsplash.com/photo-1569396116180-210c182bedb8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2669&q=80' }} />

                <View style={{ marginTop: 12, marginBottom: 6 }}>
                    <Text style={styles.labels.normal}>Username</Text>
                    <TextInput style={styles.components.textInput}
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
                    <TextInput style={styles.components.textInput}
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
    )
}
