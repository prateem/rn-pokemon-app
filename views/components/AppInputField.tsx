import {PropsWithStyle} from "../../App";
import {Text, TextInput, View, ViewStyle} from "react-native";
import React from "react";
import tw from "twrnc";

type AppInputFieldProps = {
    value?: string | undefined
    label?: string | undefined
    labelStyle?: ViewStyle,
    fieldStyle?: ViewStyle,
    isSecure?: boolean | undefined
    onTextChange: (text: string) => void
} & PropsWithStyle

export default function AppInputField(props: AppInputFieldProps) {
    return (
        <View style={tw.style(props.style)}>
            {props.label && (
                <Text style={tw.style(`text-base font-bold`, props.labelStyle)}>{props.label}</Text>
            )}

            <TextInput
                clearButtonMode={'always'}
                style={tw.style(
                    `my-2 p-2 h-10 rounded bg-white border border-gray-200 self-center min-w-full`,
                    props.fieldStyle
                )}
                secureTextEntry={props.isSecure || false}
                onChangeText={props.onTextChange} />
        </View>
    )
}
