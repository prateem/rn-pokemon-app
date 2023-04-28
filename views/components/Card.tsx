import React from "react";
import {PropsWithStyle} from "../../App";
import {View, ViewProps} from "react-native";
import tw from "twrnc";

export default function Card(props: ViewProps & PropsWithStyle) {
    return (
        <View style={tw.style(
            `rounded p-3 bg-white border border-gray-200 shadow-md`,
            props.style
        )}>
            {props.children}
        </View>
    )
}
