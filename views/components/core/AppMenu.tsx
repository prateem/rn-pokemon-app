import React from "react";
import {View, Text, SafeAreaView, InteractionManager, Pressable} from "react-native";
import Authenticator from "../../../core/Authenticator";
import { StackNavigationProp } from "@react-navigation/stack";
import {useAppState} from "../../../core/AppState";
import {AppRoute} from "../../../flows/authenticated/AuthenticatedFlow";
import {CommonActions, StackActions} from "@react-navigation/native";
import tw from "twrnc";
import AppButton from "../AppButton";
import Divider from "./Divider";

type AppMenuProps = {
    navigation: StackNavigationProp<AppRoute, 'home'>
}

export default function AppMenu({ navigation }: AppMenuProps) {
    const authenticator = new Authenticator()
    const appState = useAppState()

    return (
        <SafeAreaView>
            <View style={tw`self-start w-full`}>
                <Pressable onPress={() => {
                    navigation.push('addTrainer')
                }}>
                    {(state) => (
                        <Text style={tw.style(
                            `text-base p-3`,
                            // @ts-ignore
                            state.hovered && 'bg-gray-200',
                            state.pressed && `opacity-50`
                        )}>Add a Trainer</Text>
                    )}
                </Pressable>

                <Divider style={tw`my-4`} />

                <AppButton
                    text={"Logout"}
                    onPress={() => {
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
