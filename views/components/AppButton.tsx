import {Pressable, Text} from "react-native";
import tw from "twrnc";
import React from "react";

type ButtonProps = {
    text: string
    onPress: () => void
}

export default function AppButton(props: ButtonProps) {
    return (
        <Pressable
            style={(state) => tw.style(
                `px-3 py-2 rounded-3xl text-center min-w-30`,
                { backgroundColor: '#2b8000' },
                state.pressed && { opacity: 0.5 },
            )}
            onPress={props.onPress}>
            <Text style={tw`text-base text-white font-bold`}>{props.text}</Text>
        </Pressable>
    )
}
