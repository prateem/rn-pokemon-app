import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Image, Pressable, View, Text} from 'react-native';
import type {StackScreenProps} from '@react-navigation/stack'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import BottomSheet from '@gorhom/bottom-sheet';
import {processDeepLink} from "../../core/DeepLink";

import {AppRoute} from "./AuthenticatedFlow";
import AppMenu from '../../views/components/core/AppMenu';
import Pokedex from '../../views/tabs/Pokedex';
import Trainers from '../../views/tabs/TrainerList';
import Gyms from '../../views/tabs/GymList';
import MenuBackdrop from '../../views/components/core/MenuBackdrop';
import {useAppState} from "../../core/AppState";
import * as Linking from "expo-linking";
import tw from "twrnc";

export type HomeTab = {
    pokedex: undefined
    trainers: undefined
    gyms: undefined
}

const Tab = createBottomTabNavigator<HomeTab>()

export default function Home({ navigation }: StackScreenProps<AppRoute, 'home'>) {
    const [showMenu, setShowMenu] = useState(false)
    const bottomSheetRef = useRef<BottomSheet | null>(null)
    const snapPoints = useMemo(() => ['95%'], []);
    const appState = useAppState()

    function toggleMenu() {
        setShowMenu(!showMenu)
        if (!showMenu) {
            bottomSheetRef.current?.close()
        }
    }

    const initialUrl = Linking.useURL()
    useEffect(() => {
        if (initialUrl) {
            console.log("initialUrl: ", initialUrl)
            const navigationActions = processDeepLink(initialUrl)
            navigationActions.forEach((entry) => navigation.dispatch(entry.action))
        }
    }, [initialUrl])

    return (
        <View style={{
            flex: 1,
            overflow: 'hidden'
        }}>
            <Tab.Navigator
                screenOptions={({route}) => ({
                    headerStyle: tw`bg-red-600`,
                    headerTintColor: "white",
                    // @ts-ignore
                    headerLeft: (route.name == 'home') ? undefined : () => {
                        return (
                            <Pressable onPress={ toggleMenu }>
                                <Image
                                    resizeMode='contain'
                                    style={tw`w-7 h-7 self-center tint-white mx-3`}
                                    source={require('../../assets/icons/menu.png')} />
                            </Pressable>
                        )
                    }
                })}>
                <Tab.Screen
                    name="pokedex"
                    component={Pokedex}
                    options={{
                        title: "Pokédex",
                        tabBarActiveBackgroundColor: '#cccccc66',
                        tabBarIcon: (tabInfo) => (
                            <Image
                                resizeMode={'contain'}
                                source={require("../../assets/icons/pokeball.png")}
                                style={tw`w-6 h-6`} />
                        )}} />
                <Tab.Screen
                    name="trainers"
                    component={Trainers}
                    options={{
                        title: "Trainers",
                        tabBarActiveBackgroundColor: '#cccccc66',
                        tabBarIcon: (tabInfo) => (
                            <Image
                                resizeMode={'contain'}
                                source={require("../../assets/icons/trainer-info.png")}
                                style={tw`w-6 h-6`} />
                        )}} />
                <Tab.Screen
                    name="gyms"
                    component={Gyms}
                    options={{
                        title: "Gyms",
                        tabBarActiveBackgroundColor: '#cccccc66',
                        tabBarIcon: (tabInfo) => (
                            <Image
                                resizeMode={'contain'}
                                source={require("../../assets/icons/building.png")}
                                style={tw`w-6 h-6`} />
                        )}} />
            </Tab.Navigator>

            {showMenu && (
                <BottomSheet
                    ref={bottomSheetRef}
                    index={0}
                    style={tw`bg-white rounded-3xl shadow-black shadow-opacity-15 shadow-radius-1 shadow-offset-[0]/[-2]`}
                    enablePanDownToClose={true}
                    backdropComponent={MenuBackdrop}
                    snapPoints={snapPoints}
                    handleComponent={() => {
                        return (
                            <Pressable onPress={() => bottomSheetRef.current?.close()}>
                                <View style={tw`w-10 h-1 my-4 bg-gray-500 rounded-2xl self-center`} />
                            </Pressable>
                        )
                    }}
                    onChange={(index) => {
                        if (index == -1) {
                            // dragged down to close
                            toggleMenu()
                        }
                     }}>

                    <View style={tw`px-4 py-2 justify-center`}>
                        <AppMenu navigation={navigation} />
                    </View>
                </BottomSheet>
            )}
        </View>
    )
}
