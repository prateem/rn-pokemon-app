import React from "react";
import {View, StyleSheet} from "react-native";

declare type DividerProps = {
    color?: string
    marginVertical?: number
    marginHorizontal?: number
}

export default function Divider({ color, marginVertical, marginHorizontal } : DividerProps) {
    const dividerColor = color || 'black'

    return (
        <View
            style={{
                alignSelf: 'stretch',
                marginVertical: marginVertical || 0,
                marginHorizontal: marginHorizontal || 0,
                borderBottomColor: dividerColor,
                borderBottomWidth: StyleSheet.hairlineWidth,
            }}
        />
    )
}