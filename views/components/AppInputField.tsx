import {PropsWithStyle} from "../../App";
import {Text, TextInput, TextInputProps, View, ViewProps, ViewStyle} from "react-native";
import React from "react";
import tw from "twrnc";

type AppInputFieldProps = {
    label?: string | undefined
    labelProps?: ViewProps | undefined,
    labelStyle?: ViewStyle,
    inputProps?: TextInputProps | undefined
} & PropsWithStyle

export default function AppInputField(props: AppInputFieldProps) {
    let inputProps: any | undefined = undefined;
    if (props.inputProps) {
        const { style: ignoredStyle, ...textInputProps } = props.inputProps
        inputProps = textInputProps
    }

    return (
        <View style={tw.style(props.style)}>
            {props.label && (
                <Text style={tw.style(`text-base font-bold`, props.labelStyle)}>{props.label}</Text>
            )}

            <TextInput
                {...inputProps}
                style={tw.style(
                    `my-2 p-2 h-10 rounded bg-white border border-gray-200 self-center min-w-full`,
                    props.style
                )} />
        </View>
    )
}
