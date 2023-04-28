import React from 'react'
import {View, Text, Pressable, Platform} from 'react-native'
import Gym from "../../../models/Gym";
import tw from "twrnc";
import Card from "../Card";

type GymCardProps = {
    gym: Gym
    onPress: () => void
}

export default function GymCard({ gym, onPress }: GymCardProps) {
    return (
        <Pressable onPress={onPress}>
            {(state) => (
                <Card
                    style={tw.style(
                        `m-2 rounded-3`,
                        state.pressed && { opacity: 0.5 },
                        // @ts-ignore - error claims that 'hovered' does not exist on state, but it does
                        state.hovered && `bg-gray-100`
                    )}>
                    <View style={tw.style(`justify-center items-center text-center`, Platform.OS == 'web' ? 'w-52' : `min-w-full`)}>
                        <Text style={tw`text-base self-end text-black`}>#{gym.number}</Text>

                        <Text style={tw`text-base self-start font-bold text-black`}>{gym.location}</Text>
                        <Text style={tw`text-sm self-start text-gray-500`}>{gym.badge} Badge</Text>
                    </View>
                </Card>
            )}
        </Pressable>

    )
}
