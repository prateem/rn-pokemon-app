import tw from "twrnc";
import {Text} from "react-native";
import React from "react";
import {PropsWithStyle} from "../../App";

type BadgeProps = {
    text: string
    colorHex?: string | undefined
    minWidth?: number | undefined
} & PropsWithStyle

export default function Badge(props: BadgeProps) {
    const minWidth = props.minWidth ? `min-w-${Math.floor(props.minWidth / 4)}` : undefined

    return (
        <Text style={tw.style(
            `text-base text-white font-bold justify-center items-center text-center m-1 p-1 rounded-3`,
            props.colorHex && { backgroundColor: props.colorHex },
            minWidth,
            props.style
        )}>
            {props.text}
        </Text>
    )
}
