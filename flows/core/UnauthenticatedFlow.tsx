import {createStackNavigator} from "@react-navigation/stack";
import styles from "../../views/styles";
import Login from "../unauthenticated/Login";
import React from "react";

export type UnauthenticatedRoute = {
    login: undefined
}

const UnauthenticatedStack = createStackNavigator<UnauthenticatedRoute>();

export default function UnauthenticatedFlow() {
    return (
        <UnauthenticatedStack.Navigator
            screenOptions={{
                headerStyle: styles.components.navigationBar,
                headerTintColor: "white"
            }}>
            <UnauthenticatedStack.Screen name="login" component={Login} options={{ headerShown: false }} />
        </UnauthenticatedStack.Navigator>
    )
}
