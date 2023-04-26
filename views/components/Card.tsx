import React, {PropsWithChildren} from "react";
import {PropsWithStyle} from "../../App";
import {Pressable, View, ViewStyle} from "react-native";
import tw from "twrnc";

type CardProps = {
    onPress?: (() => void) | undefined
} & PropsWithChildren & PropsWithStyle

export default function Card(props: CardProps) {
    const style: ViewStyle = tw.style(
        `m-2 rounded p-3 shadow-md border border-gray-200`,
        props.style
    )

    if (props.onPress) {
        return (
            <Pressable onPress={props.onPress} style={style}>
                {props.children}
            </Pressable>
        )
    }

    return (
        <View style={style}>
            {props.children}
        </View>
    )
}
