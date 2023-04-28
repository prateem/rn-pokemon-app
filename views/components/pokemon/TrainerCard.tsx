import React from 'react'
import {View, Text, Image, Pressable, Platform} from 'react-native'
import Trainer from "../../../models/Trainer";
import tw from "twrnc";
import {getColorForType} from "../../../models/Pokemon";

type TrainerCardProps = {
    trainer: Trainer
    showImage?: boolean | undefined
    onPress: () => void
}

export default function TrainerCard({ trainer, showImage, onPress }: TrainerCardProps) {

    return (
        <Pressable
            key={trainer.id}
            onPress={(_) => onPress()}
            style={(state) => [
                tw.style(
                    `m-2 rounded-3 p-3 shadow-md border border-gray-200`,
                    state.pressed && { opacity: 0.5 },
                    // @ts-ignore - error claims that 'hovered' does not exist on state, but it does
                    state.hovered
                        ? `bg-gray-100`
                        : trainer.specialty ? { backgroundColor: getColorForType(trainer.specialty) } : `bg-white`
                )
            ]}
            children={(state) => {
                // @ts-ignore - error claims that 'hovered' does not exist on state, but it does
                const textColor = state.hovered ? "#000" : (trainer.specialty ? "#fff" : "#000")

                return (<View style={
                    tw.style(
                        `justify-center items-center`,
                        Platform.OS == 'web' ? `w-52` : `min-w-full`
                    )}>
                    <Text style={tw.style(`text-sm self-end`, { color: textColor })}>{trainer.id}</Text>

                    {/*<Image*/}
                    {/*    resizeMode='contain'*/}
                    {/*    style={{ width: 120, height: 120, alignSelf: 'center', margin: 8, }}*/}
                    {/*    source={{ uri: pokemon.spriteUrl }} />*/}

                    <Text style={tw.style(`text-base self-start font-bold`, { color: textColor })}>{trainer.name}</Text>
                </View>)
            }} />
    )
}