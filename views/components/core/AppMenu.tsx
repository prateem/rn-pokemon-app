import React from "react";
import {View, Text, Pressable, SafeAreaView, InteractionManager} from "react-native";
import styles from "../../styles";
import Authenticator from "../../../core/Authenticator";
import { StackNavigationProp } from "@react-navigation/stack";
import {useAppState} from "../../../core/AppState";
import {AppRoute} from "../../../flows/core/AuthenticatedFlow";
import {CommonActions} from "@react-navigation/native";

type AppMenuProps = {
    navigation: StackNavigationProp<AppRoute, 'home'>
}

export default function AppMenu({ navigation }: AppMenuProps) {
    const authenticator = new Authenticator()
    const appState = useAppState()

    return (
        <SafeAreaView>
            <View style={{alignSelf: "flex-start"}}>
                <Text>Awesome 🎉</Text>

                <Pressable onPress={(_) => {
                    authenticator.logout()
                    appState.update({
                        user: null,
                        sessionToken: null
                    })
                    InteractionManager.runAfterInteractions(() => {
                        navigation.dispatch(CommonActions.reset({routes: [{name: 'onboarding'}]}))
                    })
                }}>
                    <Text style={styles.components.button}>Logout</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    )
}
