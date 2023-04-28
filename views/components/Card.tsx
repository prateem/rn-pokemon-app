import React, {ReactNode} from "react";
import {PropsWithStyle} from "../../App";
import {Pressable, PressableStateCallbackType, View, ViewProps, ViewStyle} from "react-native";
import tw from "twrnc";

type CardProps = {
    onPress?: (() => void) | undefined
    pressableStatefulStyle?: ((state: PressableStateCallbackType) => ViewStyle) | undefined
    pressableStatefulChildren?: ((state: PressableStateCallbackType) => ReactNode) | undefined
} & PropsWithStyle & ViewProps

export default function Card(props: CardProps) {
    const style: ViewStyle = tw.style(
        `rounded p-3 bg-white border border-gray-200 shadow-md`,
        props.style
    )

    if (props.onPress) {
        const onPress: () => void = props.onPress || { }

        return (
            <Pressable
                onPress={onPress}
                style={(state) => tw.style(style, props.pressableStatefulStyle?.(state))}>
                {props.pressableStatefulChildren || props.children}
            </Pressable>
        )
    }

    return (
        <View style={style}>
            {props.children}
        </View>
    )
}
