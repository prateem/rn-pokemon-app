import React, {useEffect} from 'react';
import {StackScreenProps} from '@react-navigation/stack';
import {AppRoute} from "../../../flows/core/AuthenticatedFlow";
import Loader from '../../components/core/Loader';
import {getTrainerInfo} from "../../../services/TrainerService";
import {View, Text, ScrollView} from "react-native";
import styles from "../../styles";
import PokemonCard from "../../components/PokemonCard";

export default function TrainerInfo({ navigation, route }: StackScreenProps<AppRoute, 'trainer'>) {
    const trainerId = route.params.id

    // Fetch Trainer info
    const trainerInfo = getTrainerInfo(trainerId)
    useEffect(() => {
        navigation.setOptions({
            title: trainerInfo.isSuccess ? trainerInfo.data.trainer.name : "#" + trainerId
        })
    }, [trainerInfo])

    if (trainerInfo.isLoading || trainerInfo.isIdle) {
        return (<Loader/>)
    } else if (trainerInfo.isError) {
        return (<Text>Error getting trainer info</Text>)
    } else {
        const trainer = trainerInfo.data!.trainer
        const pokemon = trainerInfo.data!.pokemon

        return (
            <View style={styles.components.page}>
                <ScrollView>
                    <View style={styles.components.container}>
                        <View style={{ ...styles.alignment.centered, flexDirection: 'row', flexWrap: 'wrap' }}>

                            { /* General Information */}
                            <View style={styles.alignment.centered}>
                                <Text style={styles.labels.normal}>Trainer ID: {trainer.id}</Text>

                                {/*<Image*/}
                                {/*    resizeMode='contain'*/}
                                {/*    style={{ width: 120, height: 120, margin: 8 }}*/}
                                {/*    source={{ uri: pokemon.spriteUrl }} />*/}

                                <Text style={styles.labels.heading}>{trainer.name}</Text>

                                {trainer.specialty && (
                                    <View style={styles.alignment.centered}>
                                        <Text style={styles.labels.normal}>Specialty</Text>

                                        <Text style={{
                                            ...styles.labels.normal,
                                            ...styles.components.badge,
                                            backgroundColor: styles.getColorForType(trainer.specialty),
                                            color: 'white',
                                            fontWeight: 'bold',
                                        }}>
                                            {trainer.specialty.toTitleCase()}
                                        </Text>
                                    </View>
                                )}
                            </View>

                            {/* Pokemon */}
                            <View style={{ ...styles.alignment.centered, margin: 24, flexShrink: 1 }}>
                                <Text style={{...styles.labels.large, alignSelf: 'flex-start', fontWeight: 'bold'}}>Pokémon</Text>

                                {pokemon?.map((p, index) =>
                                    <PokemonCard
                                        key={`${p.number}-${index}`}
                                        pokemon={p}
                                        useCompactLayout={true}
                                        onPress={() => navigation.push('pokemon', { number: p.number })} />
                                )}
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        )
    }
}
