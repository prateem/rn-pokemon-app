import tw from "twrnc";
import {Text, View, ViewStyle} from "react-native";
import React from "react";
import {PropsWithStyle} from "../../App";
import {LinearGradient} from 'expo-linear-gradient';

type GradientColor = {
    start: string
    end: string
    orientation?: 'horizontal' | 'vertical' | undefined
}

type BadgeProps = {
    text: string
    badgeColor?: string | GradientColor | undefined
    minWidth?: number | undefined
    textStyle?: ViewStyle | undefined
} & PropsWithStyle

export default function Badge(props: BadgeProps) {
    const minWidth = props.minWidth ? `min-w-${Math.floor(props.minWidth / 4)}` : undefined

    const text = (
        <Text style={tw.style(
            `text-base font-bold text-white`,
            props.textStyle
        )}>{props.text}</Text>
    )

    if (props.badgeColor && typeof(props.badgeColor) === 'object' && props.badgeColor.start && props.badgeColor.end) {
        const isHorizontalGradient = props.badgeColor.orientation === 'horizontal'

        const startX = isHorizontalGradient ? 0 : 0.5
        const startY = isHorizontalGradient ? 0.5 : 0
        const endX = isHorizontalGradient ? 1 : 0.5
        const endY = isHorizontalGradient ? 0.5 : 1

        return (
            <LinearGradient
                colors={[props.badgeColor.start, props.badgeColor.end]}
                style={tw.style(
                    `justify-center items-center text-center m-1 py-1 px-3 rounded-3 self-center`,
                    minWidth,
                    props.style
                )}
                start={{x: startX, y: startY}}
                end={{x: endX, y: endY}}>
                {text}
            </LinearGradient>
        )
    }

    return (
        <View style={tw.style(
            `justify-center items-center text-center m-1 py-1 px-3 rounded-3 self-center`,
            props.badgeColor && typeof(props.badgeColor) === 'string' ? { backgroundColor: props.badgeColor } : `bg-gray-500`,
            minWidth,
            props.style
        )}>
            {text}
        </View>
    )
}
