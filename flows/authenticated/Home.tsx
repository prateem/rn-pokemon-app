import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Image, Pressable, View} from 'react-native';
import type {StackScreenProps} from '@react-navigation/stack'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import BottomSheet from '@gorhom/bottom-sheet';
import {processDeepLink} from "../../core/DeepLink";

import {AppRoute} from "../core/AuthenticatedFlow";
import AppMenu from '../../views/components/core/AppMenu';
import Pokedex from '../../views/screens/tabs/Pokedex';
import Trainers from '../../views/screens/tabs/TrainerList';
import Gyms from '../../views/screens/tabs/GymList';
import MenuBackdrop from '../../views/components/core/MenuBackdrop';
import styles from '../../views/styles';
import {useAppState} from "../../core/AppState";
import * as Linking from "expo-linking";

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
                    headerStyle: styles.components.navigationBar,
                    headerTintColor: "white",
                    // @ts-ignore
                    headerLeft: (route.name == 'home') ? undefined : () => {
                        return (
                            <Pressable onPress={ toggleMenu }>
                                <Image
                                    resizeMode='contain'
                                    style={{ width: 32, height: 32, alignSelf: 'center', tintColor: "white", marginHorizontal: 12 }}
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
                            <Image resizeMode={'contain'} source={require("../../assets/icons/pokeball.png")} style={{width: 24, height: 24}} />
                        )}} />
                <Tab.Screen
                    name="trainers"
                    component={Trainers}
                    options={{
                        title: "Trainers",
                        tabBarActiveBackgroundColor: '#cccccc66',
                        tabBarIcon: (tabInfo) => (
                            <Image resizeMode={'contain'} source={require("../../assets/icons/trainer-info.png")} style={{width: 24, height: 24}} />
                        )}} />
                <Tab.Screen
                    name="gyms"
                    component={Gyms}
                    options={{
                        title: "Gyms",
                        tabBarActiveBackgroundColor: '#cccccc66',
                        tabBarIcon: (tabInfo) => (
                            <Image resizeMode={'contain'} source={require("../../assets/icons/building.png")} style={{width: 24, height: 24}} />
                        )}} />
            </Tab.Navigator>

            {showMenu && (
                <BottomSheet
                    ref={bottomSheetRef}
                    index={0}
                    style={{
                        borderWidth: 0.25,
                        borderColor: "#00000033",
                        borderRadius: 12,
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: -1,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 4,
                        elevation: 4,
                    }}
                    enablePanDownToClose={true}
                    backdropComponent={MenuBackdrop}
                    snapPoints={snapPoints}
                    onChange={(index) => {
                        if (index == -1) {
                            // dragged down to close
                            toggleMenu()
                        }
                     }}>

                    <View style={{ ...styles.components.container, ...styles.alignment.centered, flex: 1, justifyContent: 'flex-start' }}>
                        <AppMenu navigation={navigation} />
                    </View>

                </BottomSheet>
            )}
        </View>
    )
}
