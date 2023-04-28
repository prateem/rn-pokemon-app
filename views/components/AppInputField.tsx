import {PropsWithStyle} from "../../App";
import {Text, TextInput, View, ViewStyle} from "react-native";
import React from "react";
import tw from "twrnc";

type AppInputFieldProps = {
    value?: string | undefined
    label?: string | undefined
    labelStyle?: ViewStyle,
    isSecure?: boolean | undefined
    onTextChange: (text: string) => void
} & PropsWithStyle

export default function AppInputField(props: AppInputFieldProps) {
    return (
        <View style={tw`flex-1`}>
            {props.label && (
                <Text style={tw.style(`text-base font-bold`, props.labelStyle)}>{props.label}</Text>
            )}

            <View style={tw`flex-1 flex-row`}>
                <TextInput
                    clearButtonMode={'always'}
                    style={tw.style(
                        `my-2 p-2 h-10 rounded bg-white border border-gray-200 self-center`,
                        props.style
                    )}
                    secureTextEntry={props.isSecure || false}
                    onChangeText={props.onTextChange} />
            </View>
        </View>
    )
}
