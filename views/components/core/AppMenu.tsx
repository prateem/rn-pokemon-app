import React from "react";
import { View, Text, Pressable } from "react-native";
import styles from "../../styles";
import Authenticator from "../../../core/Authenticator";
import { StackNavigationProp } from "@react-navigation/stack";
import { AppRoute } from "../../../core/AppRouter";

type AppMenuProps = {
    navigation: StackNavigationProp<AppRoute, 'home'>
}

export default function AppMenu({ navigation }: AppMenuProps) {
    const authenticator = new Authenticator();

    return (
        <View style={{alignSelf: "flex-start"}}>
            <Text>Awesome 🎉</Text>

            <Pressable onPress={(_) => {
                authenticator.logout()
                navigation.reset({ index: 0, routes: [{ name: "login" }] })
            }}>
                <Text style={styles.components.button}>Logout</Text>
            </Pressable>
        </View>
    )
}
