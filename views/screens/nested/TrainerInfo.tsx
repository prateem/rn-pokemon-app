import React, {useEffect, useState} from 'react';
import {StackScreenProps} from '@react-navigation/stack';
import {AppRoute} from '../../../core/AppRouter';
import Loader from '../../components/core/Loader';
import trainerService, {TrainerInfoDataState} from "../../../services/TrainerService";
import {DataLoadingState} from "../../../services/DataLoadingState";
import {View, Text, ScrollView} from "react-native";
import styles from "../../styles";
import PokemonCard from "../../components/PokemonCard";

export default function TrainerInfo({ navigation, route }: StackScreenProps<AppRoute, 'trainer'>) {
    const trainerId = route.params.id

    const [trainerInfo, setTrainerInfo]
        = useState<TrainerInfoDataState>({ state: DataLoadingState.Loading })

    // Fetch Trainer info
    useEffect(() => {
        navigation.setOptions({
            title: "#" + trainerId
        })
        trainerService.getTrainerInfo(trainerId)
            .subscribe((data) => {
                setTrainerInfo(data)
                if (data.state == DataLoadingState.Loaded && data.trainer) {
                    navigation.setOptions({
                        title: data.trainer.name
                    })
                }
            })
    }, [trainerId])

    if (trainerInfo.state == DataLoadingState.Loading) {
        return (<Loader/>)
    } else if (trainerInfo.state == DataLoadingState.Error) {
        return (<Text>Error getting trainer info</Text>)
    } else {
        const trainer = trainerInfo.trainer
        const pokemon = trainerInfo.pokemon

        if (trainer) {
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
        } else {
            return (<Text>Error getting trainer info</Text>)
        }
    }
}
