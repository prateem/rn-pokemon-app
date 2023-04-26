import React from "react";
import {View, Text, SafeAreaView, InteractionManager} from "react-native";
import Authenticator from "../../../core/Authenticator";
import { StackNavigationProp } from "@react-navigation/stack";
import {useAppState} from "../../../core/AppState";
import {AppRoute} from "../../../flows/authenticated/AuthenticatedFlow";
import {CommonActions} from "@react-navigation/native";
import tw from "twrnc";
import AppButton from "../AppButton";

type AppMenuProps = {
    navigation: StackNavigationProp<AppRoute, 'home'>
}

export default function AppMenu({ navigation }: AppMenuProps) {
    const authenticator = new Authenticator()
    const appState = useAppState()

    return (
        <SafeAreaView>
            <View style={tw`self-start`}>
                <Text>Awesome 🎉</Text>

                <AppButton text={"Logout"} onPress={() => {
                    authenticator.logout()
                    appState.update({
                        user: null,
                        sessionToken: null
                    })
                    InteractionManager.runAfterInteractions(() => {
                        navigation.dispatch(CommonActions.reset({routes: [{name: 'onboarding'}]}))
                    })
                }} />
            </View>
        </SafeAreaView>
    )
}
