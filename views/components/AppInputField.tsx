import {PropsWithStyle} from "../../App";
import {Text, TextInput, TextInputProps, View, ViewProps, ViewStyle} from "react-native";
import React from "react";
import tw from "twrnc";

type AppInputFieldProps = {
    label?: string | undefined
    labelProps?: (ViewProps & PropsWithStyle) | undefined,
    inputProps?: (TextInputProps & PropsWithStyle) | undefined
} & PropsWithStyle

export default function AppInputField(props: AppInputFieldProps) {
    let inputProps: any | undefined = undefined;
    if (props.inputProps) {
        const { style: ignoredStyle, ...textInputProps } = props.inputProps
        inputProps = textInputProps
    }

    let labelProps: any | undefined = undefined
    if (props.labelProps) {
        const { style: ignoredStyle, ...textProps } = props.labelProps
        labelProps = textProps
    }

    return (
        <View style={tw.style(props.style)}>
            {props.label && (
                <Text
                    {...labelProps}
                    style={tw.style(`text-base font-bold`, props.labelProps?.style)}
                >
                    {props.label}
                </Text>
            )}

            <TextInput
                {...inputProps}
                style={tw.style(
                    `h-10 px-2 rounded bg-white border border-gray-200 self-center min-w-full`,
                    props.inputProps?.style
                )} />
        </View>
    )
}
