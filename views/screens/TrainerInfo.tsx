import React, {useEffect, useState} from 'react';
import {StackScreenProps} from '@react-navigation/stack';
import {AppRoute} from "../../flows/authenticated/AuthenticatedFlow";
import Loader from '../components/core/Loader';
import {getTrainerInfo} from "../../services/TrainerService";
import {View, Text, ScrollView, Image} from "react-native";
import PokemonCard from "../components/pokemon/PokemonCard";
import tw from "twrnc";
import Container from "../components/Container";
import Badge from "../components/Badge";
import {getColorForType} from "../../models/Pokemon";

export default function TrainerInfo({ navigation, route }: StackScreenProps<AppRoute, 'trainer'>) {
    const trainerId = route.params.id
    const [availableWidth, setAvailableWidth] = useState(0)

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
            <View style={tw`flex-1 bg-white`} onLayout={(event) => {
                const { width } = event.nativeEvent.layout
                setAvailableWidth(width)
            }}>
                <ScrollView>
                    <Container style={tw.style(availableWidth > 1400 && `mx-80`)}>
                        <View style={tw`flex-col web:flex-row web:flex-wrap justify-center items-center`}>
                            { /* General Information */}
                            <View style={tw`m-4 justify-center items-start web:items-center android:w-full ios:w-full android:px-2 ios:px-2`}>
                                <View style={tw`flex-row justify-center`}>
                                    <View style={tw`flex-row items-center`}>
                                        <Image
                                            resizeMode={'contain'}
                                            source={require(`../../assets/trainers/${trainer.asset}`)}
                                            style={tw`w-30 h-30 mx-4 border border-gray-500`} />

                                        <View style={tw`android:flex-1 ios:flex-1 mr-4`}>
                                            <Text style={tw`text-3xl font-bold`}>{trainer.name}</Text>

                                            <Text style={tw`text-base my-2`}>Trainer ID: {trainer.id}</Text>
                                        </View>
                                    </View>


                                    {trainer.specialty && (
                                        <View style={tw`justify-center text-center`}>
                                            <Text style={tw`text-xs web:text-sm text-center`}>Specialty</Text>

                                            <Badge
                                                text={trainer.specialty.toTitleCase()}
                                                colorHex={getColorForType(trainer.specialty)}
                                                minWidth={80} />
                                        </View>
                                    )}
                                </View>

                                {/*<Image*/}
                                {/*    resizeMode='contain'*/}
                                {/*    style={{ width: 120, height: 120, margin: 8 }}*/}
                                {/*    source={{ uri: pokemon.spriteUrl }} />*/}


                            </View>

                            {/* Pokemon */}
                            <View style={tw.style(
                                `m-4 p-3 border rounded bg-white shadow-md border border-gray-200 flex-shrink items-start`,
                                availableWidth < 1400 ? `w-full` : `mx-20`
                            )}>
                                <Text style={tw`text-lg self-start font-bold`}>Pokémon</Text>

                                <View style={tw`web:flex-row web:flex-wrap`}>
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
                    </Container>
                </ScrollView>
            </View>
        )
    }
}
