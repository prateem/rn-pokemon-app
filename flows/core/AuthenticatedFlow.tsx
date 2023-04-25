import {createStackNavigator} from "@react-navigation/stack";
import styles from "../../views/styles";
import React from "react";
import Home from "../authenticated/Home";
import PokemonInfo from "../../views/screens/nested/PokemonInfo";
import TrainerInfo from "../../views/screens/nested/TrainerInfo";
import GymInfo from "../../views/screens/nested/GymInfo";

export type AppRoute = {
    home: undefined
    pokemon: { number: number }
    trainer: { id: number }
    gym: { number: number }
}


const AuthenticatedStack = createStackNavigator<AppRoute>();
export default function AuthenticatedFlow() {
    return (
        <AuthenticatedStack.Navigator
            screenOptions={{
                headerStyle: styles.components.navigationBar,
                headerTintColor: "white"
            }}>
            <AuthenticatedStack.Group>
                <AuthenticatedStack.Screen name="home" component={Home} options={{ title: 'Home', headerShown: false }} />
                <AuthenticatedStack.Screen name="trainer" component={TrainerInfo} />
                <AuthenticatedStack.Screen name="gym" component={GymInfo} />
            </AuthenticatedStack.Group>

            <AuthenticatedStack.Group screenOptions={{presentation: 'modal'}}>
                <AuthenticatedStack.Screen name="pokemon" component={PokemonInfo} />
            </AuthenticatedStack.Group>

        </AuthenticatedStack.Navigator>
    )
}
