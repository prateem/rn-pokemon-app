import React from 'react'
import {View, Text, Image, Pressable} from 'react-native'
import styles from '../styles'
import Gym from "../../models/Gym";

type GymCardProps = {
    gym: Gym
    onPress: () => void
}

export default function GymCard({ gym, onPress }: GymCardProps) {
    return (
        <Pressable
            onPress={(_) => onPress()}
            style={(state) => [
                { margin: 8 },
                styles.components.card,
                // trainer.specialty ? { backgroundColor: styles.getColorForType(trainer.specialty) } : { },
                // @ts-ignore - error claims that 'hovered' does not exist on state, but it does
                state.hovered && { backgroundColor: "lightgrey" }
            ]}>
            <View style={{minWidth: 200}}>
                <Text style={{ ...styles.labels.small, alignSelf: 'flex-end', color: '#000' }}>#{gym.number}</Text>

                {/*<Image*/}
                {/*    resizeMode='contain'*/}
                {/*    style={{ width: 120, height: 120, alignSelf: 'center', margin: 8, }}*/}
                {/*    source={{ uri: pokemon.spriteUrl }} />*/}

                <Text style={{ ...styles.labels.normal, alignSelf: 'flex-start', color: '#000', fontWeight: "bold" }}>{gym.location}</Text>
                <Text style={{ ...styles.labels.small, alignSelf: 'flex-start', color: '#333' }}>{gym.badge} Badge</Text>
            </View>
        </Pressable>
    )
}