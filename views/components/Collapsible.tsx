import React, {useState} from "react";
import {Text, View, Pressable, Image, ViewProps} from "react-native";
import tw from 'twrnc'

type CollapsibleProps = {
    title: string
} & ViewProps

export default function Collapsible({ title, children, style }: CollapsibleProps) {
    const [showContent, setShowContent] = useState(false)

    return (
        <View style={style}>
            <Pressable
                style={tw`my-2`}
                onPress={(_) => {
                    setShowContent(!showContent)
                }}>
                <View style={tw`flex-row items-center`}>
                    <Text style={tw`text-lg font-bold`}>{title}</Text>
                    <Image
                        style={tw.style(
                            'w-6 h-6 mx-2',
                            showContent && { transform: [{rotate: '180deg'}]}
                        )}
                        source={require('../../assets/icons/chevron-down.png')} />
                </View>
            </Pressable>

            {showContent && (
                <View>
                    {children}
                </View>
            )}
        </View>
    )
}
