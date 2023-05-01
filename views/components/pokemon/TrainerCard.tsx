import React from 'react'
import {View, Text, Image, Pressable, Platform} from 'react-native'
import Trainer from "../../../models/Trainer";
import tw from "twrnc";
import {getColorForType} from "../../../models/Pokemon";
import Card from "../Card";
import {TRAINER_IMAGES} from "../../../models/mocks/trainers";

type TrainerCardProps = {
    trainer: Trainer
    onPress: () => void
}

export default function TrainerCard({ trainer, onPress }: TrainerCardProps) {
    return (
        <Pressable
            key={trainer.id}
            onPress={onPress}>
            {(state) => {
                // @ts-ignore - error claims that 'hovered' does not exist on state, but it does
                const textColor = state.hovered ? "#000" : (trainer.specialty ? "#fff" : "#000")

                return (
                    <Card style={
                        tw.style(
                            `m-2 rounded-3`,
                            state.pressed && { opacity: 0.5 },
                            // @ts-ignore - error claims that 'hovered' does not exist on state, but it does
                            state.hovered
                                ? `bg-gray-100`
                                : trainer.specialty ? { backgroundColor: getColorForType(trainer.specialty) } : `bg-white`
                        )
                    }>
                        <View style={
                            tw.style(
                                `justify-center`,
                                Platform.OS == 'web' ? `w-52` : `min-w-full`
                            )}>
                                <View style={tw`flex-row items-center`}>
                                    <Image
                                        resizeMode='contain'
                                        style={tw`w-10 h-10 self-center rounded-3xl border border-gray-500 bg-white`}
                                        source={TRAINER_IMAGES[trainer.asset].uri} />
                                    <Text style={tw.style(`mx-3 text-base font-bold flex-1`, { color: textColor })}>{trainer.name}</Text>
                                    <Text style={tw.style(`text-sm`, { color: textColor })}>{trainer.id}</Text>
                                </View>
                        </View>
                    </Card>
                )
            }}
        </Pressable>

    )
}