import React, {useEffect} from 'react';
import {StackScreenProps} from '@react-navigation/stack';
import {AppRoute} from "../../flows/authenticated/AuthenticatedFlow";
import Loader from '../components/core/Loader';
import {getTrainerInfo} from "../../services/TrainerService";
import {View, Text, ScrollView, Image, useWindowDimensions} from "react-native";
import PokemonCard from "../components/pokemon/PokemonCard";
import tw from "twrnc";
import Container from "../components/Container";
import Badge from "../components/Badge";
import {getColorForType} from "../../models/Pokemon";
import {TRAINER_IMAGES} from "../../models/mocks/trainers";
import Card from "../components/Card";

export default function TrainerInfo({ navigation, route }: StackScreenProps<AppRoute, 'trainer'>) {
    const trainerId = route.params.id
    const dimensions = useWindowDimensions()

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
                        <View style={tw`flex-col justify-center items-center`}>
                            { /* General Information */}
                            <View style={tw`m-4 justify-center items-start web:items-center web:flex-1 android:w-full ios:w-full android:px-2 ios:px-2`}>
                                <View style={tw`flex-row flex-1 justify-center items-center`}>
                                    <Image
                                        resizeMode={'contain'}
                                        source={TRAINER_IMAGES[trainer.asset].uri}
                                        style={tw`w-30 h-30 border border-gray-500`} />

                                    <View style={tw`flex-row flex-wrap flex-1 items-center`}>
                                        <View style={tw`mx-4 max-w-full`}>
                                            <Text style={tw`text-2xl web:text-3xl font-bold`}>{trainer.name}</Text>

                                            <Text style={tw`text-sm web:text-base my-2`}>Trainer ID: {trainer.id}</Text>
                                        </View>

                                        {trainer.specialty && (
                                            <View style={tw`mx-4 justify-center text-center`}>
                                                <Text style={tw`text-xs web:text-sm text-center`}>Specialty</Text>

                                                <Badge
                                                    text={trainer.specialty.toTitleCase()}
                                                    badgeColor={getColorForType(trainer.specialty)}
                                                    minWidth={80} />
                                            </View>
                                        )}
                                    </View>
                                </View>
                            </View>

                            {/* Pokemon */}
                            <Card style={tw.style(
                                `m-4 flex-shrink items-start`,
                                dimensions.width < 1400 ? `w-full` : `mx-20`
                            )}>
                                <Text style={tw`text-lg self-start font-bold`}>Pokémon</Text>

                                <View style={tw`web:flex-row web:flex-wrap web:justify-center`}>
                                    {pokemon?.map((r, index) =>
                                        <PokemonCard
                                            key={`${r.pokemon.number}-${index}`}
                                            subtext={`Lv. ${r.level}`}
                                            pokemon={r.pokemon}
                                            useCompactLayout={true}
                                            onPress={() => navigation.push('pokemon', { number: r.pokemon.number })} />
                                    )}
                                </View>
                            </Card>
                        </View>
                    </Container>
                </ScrollView>
            </View>
        )
    }
}
