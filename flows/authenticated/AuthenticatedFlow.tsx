import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import Home from './Home';
import PokemonInfo from '../../views/screens/PokemonInfo';
import TrainerInfo from '../../views/screens/TrainerInfo';
import GymInfo from '../../views/screens/GymInfo';
import tw from 'twrnc';
import AddTrainer from '../../views/screens/AddTrainer';

export type AppRoute = {
    home: undefined
    pokemon: { number: number }
    trainer: { id: number }
    gym: { number: number }
    addTrainer: undefined
}

const AuthenticatedStack = createStackNavigator<AppRoute>();
export default function AuthenticatedFlow() {
    return (
        <AuthenticatedStack.Navigator
            screenOptions={{
                headerStyle: tw`bg-red-600`,
                headerTintColor: 'white'
            }}>
            <AuthenticatedStack.Group>
                <AuthenticatedStack.Screen name='home' component={Home} options={{ title: 'Home', headerShown: false }} />
                <AuthenticatedStack.Screen name='trainer' component={TrainerInfo} />
                <AuthenticatedStack.Screen name='gym' component={GymInfo} />
                <AuthenticatedStack.Screen name='addTrainer' component={AddTrainer} />
            </AuthenticatedStack.Group>

            <AuthenticatedStack.Group screenOptions={{presentation: 'modal'}}>
                <AuthenticatedStack.Screen name='pokemon' component={PokemonInfo} />
            </AuthenticatedStack.Group>

        </AuthenticatedStack.Navigator>
    )
}
