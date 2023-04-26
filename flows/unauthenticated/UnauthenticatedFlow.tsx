import {createStackNavigator} from "@react-navigation/stack";
import Login from "./Login";
import React from "react";
import tw from "twrnc";

export type UnauthenticatedRoute = {
    login: undefined
}

const UnauthenticatedStack = createStackNavigator<UnauthenticatedRoute>();

export default function UnauthenticatedFlow() {
    return (
        <UnauthenticatedStack.Navigator
            screenOptions={{
                headerStyle: tw`bg-red-600`,
                headerTintColor: "white"
            }}>
            <UnauthenticatedStack.Screen name="login" component={Login} options={{ headerShown: false }} />
        </UnauthenticatedStack.Navigator>
    )
}
