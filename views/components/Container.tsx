import {PropsWithChildren} from "react";
import {PropsWithStyle} from "../../App";
import {View} from "react-native";
import React from "react";
import tw from "twrnc";

type ContainerProps = {
    centered?: boolean | undefined
} & PropsWithStyle & PropsWithChildren

export default function Container(props: ContainerProps) {
    return (
        <View style={tw.style(
            `flex-1 bg-white p-3 `,
            (props.centered || false) && `justify-center items-center`,
            props.style
        )}>
            {props.children}
        </View>
    )
}
