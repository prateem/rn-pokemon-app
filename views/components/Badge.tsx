import tw from "twrnc";
import {Text, View, ViewStyle} from "react-native";
import React from "react";
import {PropsWithStyle} from "../../App";

type BadgeProps = {
    text: string
    colorHex?: string | undefined
    minWidth?: number | undefined
    textStyle?: ViewStyle | undefined
} & PropsWithStyle

export default function Badge(props: BadgeProps) {
    const minWidth = props.minWidth ? `min-w-${Math.floor(props.minWidth / 4)}` : undefined

    return (
        <View style={tw.style(
            `justify-center items-center text-center m-1 py-1 px-3 rounded-3 self-center`,
            props.colorHex ? { backgroundColor: props.colorHex } : `bg-gray-500`,
            minWidth,
            props.style
        )}>
            <Text style={tw.style(
                `text-base font-bold text-white`,
                props.textStyle
            )}>{props.text}</Text>
        </View>
    )
}
