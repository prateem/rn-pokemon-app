import React, {useEffect} from 'react';
import {StackScreenProps} from '@react-navigation/stack';
import {AppRoute} from "../../flows/authenticated/AuthenticatedFlow";
import Loader from '../components/core/Loader';
import {getTrainerInfo} from "../../services/TrainerService";
import {View, Text, ScrollView} from "react-native";
import PokemonCard from "../components/pokemon/PokemonCard";
import tw from "twrnc";
import Container from "../components/Container";
import Badge from "../components/Badge";
import {getColorForType} from "../../models/Pokemon";

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
            <View style={tw`flex-1 bg-white`}>
                <ScrollView>
                    <Container>
                        <View style={tw`justify-center items-center flex-row flex-wrap`}>

                            { /* General Information */}
                            <View style={tw`justify-center items-center`}>
                                <Text style={tw`text-base`}>Trainer ID: {trainer.id}</Text>

                                {/*<Image*/}
                                {/*    resizeMode='contain'*/}
                                {/*    style={{ width: 120, height: 120, margin: 8 }}*/}
                                {/*    source={{ uri: pokemon.spriteUrl }} />*/}

                                <Text style={tw`text-5xl font-bold`}>{trainer.name}</Text>

                                {trainer.specialty && (
                                    <View style={tw`justify-center items-center`}>
                                        <Text style={tw`text-base`}>Specialty</Text>

                                        <Badge
                                            text={trainer.specialty.toTitleCase()}
                                            colorHex={getColorForType(trainer.specialty)}
                                            minWidth={80} />
                                    </View>
                                )}
                            </View>

                            {/* Pokemon */}
                            <View style={tw`m-8 justify-center items-center flex-shrink`}>
                                <Text style={tw`text-lg self-start font-bold`}>Pokémon</Text>

                                {pokemon?.map((p, index) =>
                                    <PokemonCard
                                        key={`${p.number}-${index}`}
                                        pokemon={p}
                                        useCompactLayout={true}
                                        onPress={() => navigation.push('pokemon', { number: p.number })} />
                                )}
                            </View>
                        </View>
                    </Container>
                </ScrollView>
            </View>
        )
    }
}
