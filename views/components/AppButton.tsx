import {Pressable, Text, View, ViewProps} from "react-native";
import tw from "twrnc";
import React from "react";
import {PropsWithStyle} from "../../App";

type ButtonProps = {
    text: string
    onPress: () => void
} & ViewProps & PropsWithStyle

export default function AppButton(props: ButtonProps) {
    return (
        <Pressable onPress={props.onPress}>
            {(state) => (
                <View style={tw.style(
                    `rounded text-center px-3 py-2 rounded-3xl min-w-30 self-center`,
                    { backgroundColor: '#2b8000' },
                    state.pressed && { opacity: 0.5 },
                    props.style
                )}>
                    <Text style={tw`text-base text-white font-bold text-center`}>{props.text}</Text>
                </View>
            )}
        </Pressable>
    )
}
