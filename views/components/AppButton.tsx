import {Pressable, PressableProps, Text, View} from "react-native";
import tw from "twrnc";
import React from "react";

type ButtonProps = {
    text: string
} & PressableProps

export default function AppButton(props: ButtonProps) {
    return (
        <Pressable {...props}>
            {(state) => (
                <View style={tw.style(
                    `rounded text-center px-3 py-2 rounded-3xl min-w-30 self-start`,
                    { backgroundColor: '#2b8000' },
                    state.pressed && `opacity-50`
                )}>
                    <Text style={tw`text-base text-white font-bold text-center`}>{props.text}</Text>
                </View>
            )}
        </Pressable>
    )
}
