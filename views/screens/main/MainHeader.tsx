import React from "react";
import { BottomTabHeaderProps } from "@react-navigation/bottom-tabs"
import { getHeaderTitle } from '@react-navigation/elements';
import { View, Text, Pressable, Image } from "react-native";
import styles from "../../styles";

export type HeaderProps = {
    tabProps: BottomTabHeaderProps,
    onMenuButtonPress: () => void
}

export default function MainHeader(props: HeaderProps) {
    const title = getHeaderTitle(props.tabProps.options, props.tabProps.route.name)

    return (
        <View style={styles.components.navigationBar}>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 2 }}>
                <Pressable
                    style={{ width: 44, height: 44, justifyContent: 'center', alignItems: 'center', margin: 8 }}
                    onPress={(_) => {
                        props.onMenuButtonPress()
                    }}>
                    <Image
                        resizeMode='contain'
                        style={{ width: 32, height: 32, alignSelf: 'center', tintColor: "white" }}
                        source={require('../../../assets/icons/menu.png')} />
                </Pressable>

                <Text style={{ flex: 1, paddingStart: 8, paddingVertical: 8, fontSize: 20, color: "white" }}>{title}</Text>
            </View>
        </View>
    )
}
