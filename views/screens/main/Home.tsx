import React, {useRef, useState, useMemo, useEffect} from 'react';
import {Image, View} from 'react-native';
import type { StackScreenProps } from '@react-navigation/stack'
import { BottomTabHeaderProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import BottomSheet from '@gorhom/bottom-sheet';
import {isScreenDeepLink, isTabDeepLink, processDeepLink, ScreenDeepLink, TabDeepLink} from "../../../core/DeepLink";
import * as Linking from 'expo-linking';

import { AppRoute } from '../../../core/AppRouter';
import AppMenu from '../../components/core/AppMenu';
import MainHeader from './MainHeader'
import Pokedex from '../tabs/Pokedex';
import Trainers from '../tabs/TrainerList';
import Gyms from '../tabs/GymList';
import MenuBackdrop from '../../components/core/MenuBackdrop';
import styles from '../../styles';
import {TabActions} from "@react-navigation/native";
import {useAppState} from "../../../core/AppState";

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
    const initialUrl = Linking.useURL()

    function toggleMenu() {
        setShowMenu(!showMenu)
        if (!showMenu) {
            bottomSheetRef.current?.close()
        }
    }

    useEffect(() => {
        if (initialUrl) {
            const testDeepLink = processDeepLink(initialUrl)
            appState.update({ deepLink: testDeepLink })
        }
    }, [])

    useEffect(() => {
        // Check for and handle deep link
        const deepLink = appState.current.deepLink

        if (deepLink && deepLink.length > 0) {
            console.log("Handling DeepLink:", deepLink)

            deepLink.forEach((link) => {
                if (isScreenDeepLink(link)) {
                    const screenDeepLink = link as ScreenDeepLink<any>
                    navigation.navigate(screenDeepLink.route, screenDeepLink.params)
                } else if (isTabDeepLink(link)) {
                    const tabDeepLink = link as TabDeepLink<any>
                    navigation.dispatch(TabActions.jumpTo(tabDeepLink.tab))
                }
            })

            appState.update({ deepLink: [] })
        }
    }, [appState.current.deepLink])

    return (
        <View style={{
            flex: 1,
            overflow: 'hidden'
        }}>
            <Tab.Navigator screenOptions={{
                header: (props: BottomTabHeaderProps) => {
                    return MainHeader({
                        tabProps: props,
                        onMenuButtonPress: () => { toggleMenu() }
                    })
                }
            }}>
                <Tab.Screen
                    name="pokedex"
                    component={Pokedex}
                    options={{
                        title: "Pokédex",
                        tabBarIcon: (tabInfo) => (
                            <Image source={require("../../../assets/pokeball.png")} style={{width: 24, height: 24}} />
                        )}} />
                <Tab.Screen
                    name="trainers"
                    component={Trainers}
                    options={{
                        title: "Trainers",
                        tabBarIcon: (tabInfo) => (
                            <Image source={require("../../../assets/trainer-info.png")} style={{width: 24, height: 24}} />
                        )}} />
                <Tab.Screen
                    name="gyms"
                    component={Gyms}
                    options={{
                        title: "Gyms",
                        tabBarIcon: (tabInfo) => (
                            <Image source={require("../../../assets/building.png")} style={{width: 24, height: 24}} />
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
