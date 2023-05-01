import React from "react";
import {View, ViewProps} from "react-native";
import {PropsWithStyle} from "../../../App";
import tw from "twrnc";

export default function Divider(props: ViewProps & PropsWithStyle) {
    return (
        <View
            {...props}
            style={tw.style(
                `h-px self-stretch border-b border-gray-300`,
                props.style
            )}
        />
    )
}
