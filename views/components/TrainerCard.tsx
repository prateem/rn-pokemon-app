import React from 'react'
import {View, Text, Image, Pressable} from 'react-native'
import styles from '../styles'
import Trainer from "../../models/Trainer";

type TrainerCardProps = {
    trainer: Trainer
    onPress: () => void
}

export default function TrainerCard({ trainer, onPress }: TrainerCardProps) {

    function getTextColor(): string {
        return trainer.specialty ? "#fff" : "#000"
    }

    return (
        <Pressable
            key={trainer.id}
            onPress={(_) => onPress()}
            style={(state) => [
                { margin: 8 },
                styles.components.card,
                trainer.specialty ? { backgroundColor: styles.getColorForType(trainer.specialty) } : { },
                // @ts-ignore - error claims that 'hovered' does not exist on state, but it does
                state.hovered && { backgroundColor: "lightgrey" }
            ]}>
            <View style={{minWidth: 200}}>
                <Text style={{ ...styles.labels.small, alignSelf: 'flex-end', color: getTextColor() }}>{trainer.id}</Text>

                {/*<Image*/}
                {/*    resizeMode='contain'*/}
                {/*    style={{ width: 120, height: 120, alignSelf: 'center', margin: 8, }}*/}
                {/*    source={{ uri: pokemon.spriteUrl }} />*/}

                <Text style={{ ...styles.labels.normal, alignSelf: 'flex-start', color: getTextColor(), fontWeight: "bold" }}>{trainer.name}</Text>
            </View>
        </Pressable>

    )
}