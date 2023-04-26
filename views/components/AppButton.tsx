import {Pressable, Text} from "react-native";
import tw from "twrnc";
import React from "react";

type ButtonProps = {
    text: string
    onPress: () => void
}

export default function AppButton(props: ButtonProps) {
    return (
        <Pressable onPress={props.onPress}>
            <Text style={tw.style(
                `text-base text-white px-3 py-2 rounded-3xl font-bold text-center min-w-30`,
                { backgroundColor: '#2b8000' }
            )}>
                {props.text}
            </Text>
        </Pressable>
    )
}
