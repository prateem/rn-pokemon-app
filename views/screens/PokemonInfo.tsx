import React, {useEffect} from 'react'
import {StackScreenProps} from '@react-navigation/stack'
import {AppRoute} from "../../flows/authenticated/AuthenticatedFlow";
import {getPokemonWithFullDetails} from '../../services/PokemonService'
import {Image, ScrollView, Text, useWindowDimensions, View} from 'react-native'
import Loader from '../components/core/Loader'
import EvolutionChainView from "../components/pokemon/EvolutionChain";
import Collapsible from "../components/Collapsible";
import tw from "twrnc";
import Container from "../components/Container";
import Badge from "../components/Badge";
import {getColorForType} from "../../models/Pokemon";
import Card from "../components/Card";

export default function PokemonInfo({ navigation, route }: StackScreenProps<AppRoute, 'pokemon'>) {
    const pokemonNumber = route.params.number
    const dimensions = useWindowDimensions()

    const query = getPokemonWithFullDetails(pokemonNumber)
    useEffect(() => {
        navigation.setOptions({
            title: query.isSuccess ? query.data.name : "#" + pokemonNumber
        })
    }, [query])

    if (query.isLoading || query.isIdle) {
        return (<Loader />)
    } else if (query.isError) {
        return (<Text>Could not get Pokemon Info</Text>)
    } else {
        const pokemon = query.data!
        const baseInfo = pokemon.baseInfo!
        const details = pokemon.details!

        return (
            <View style={tw`flex-1 bg-white`}>
                <ScrollView>
                    <Container>
                        <View style={tw`flex-col web:flex-row web:flex-wrap justify-center items-center`}>
                            { /* Image and type badges */ }
                            <View style={tw`m-4 justify-center items-center`}>
                                <Text style={tw`text-base`}>#{pokemon.number}</Text>

                                <Image
                                    resizeMode='contain'
                                    style={tw`w-40 h-40 m-2`}
                                    source={{ uri: baseInfo.spriteUrl }} />

                                <Text style={tw`text-5xl font-bold`}>{pokemon.name}</Text>

                                <View style={tw`flex-row my-2`}>
                                    {baseInfo.types.map((type, index) => {
                                        return <Badge
                                            key={index}
                                            text={type.toTitleCase()}
                                            badgeColor={getColorForType(type)}
                                            minWidth={80} />
                                    })}
                                </View>
                            </View>

                            <EvolutionChainView
                                data={details.evolutionChain}
                                viewing={pokemonNumber}
                                style={tw.style(dimensions.width < 1400 ? `w-full` : `mx-20`)}
                            />

                            <Card style={tw.style(`m-4 flex-shrink items-start w-full`)}>
                                <Collapsible title={"Moves"} style={tw`w-full`}>
                                    <View style={tw`w-full border border-gray-400`}>
                                        <View style={tw`flex-row flex-1 bg-gray-300 p-2 border-b border-gray-400`}>
                                            <Text style={tw`text-base flex-3 font-bold self-center`}>Name</Text>
                                            <Text style={tw`text-base flex-2 font-bold text-center self-center`}>Type</Text>
                                            <Text style={tw`text-base flex-2 font-bold text-center self-center`}>@ Level</Text>
                                        </View>

                                        {
                                            baseInfo.moves
                                                .sort((a, b) => a.learnedAtLevel - b.learnedAtLevel)
                                                .flatMap((move, index) => {
                                                    const moveData = move.data
                                                    if (!moveData) {
                                                        return []
                                                    }

                                                    return (
                                                        <View key={index} style={tw.style(`flex-row px-2 py-1`, index % 2 == 0 ? `bg-gray-200` : `bg-gray-100`)}>
                                                            <Text style={tw`text-sm flex-3 self-center`}>{move.name.toTitleCase()}</Text>
                                                            <View style={tw`flex-2 self-center`}>
                                                                <Badge text={moveData.type.toTitleCase()} badgeColor={getColorForType(moveData.type)} minWidth={80} />
                                                            </View>
                                                            <Text style={tw`text-sm flex-2 text-center self-center`}>{move.learnedAtLevel}</Text>
                                                        </View>
                                                    )
                                                })
                                        }
                                    </View>
                                </Collapsible>
                            </Card>

                            { /* Pokédex Entries */ }
                            <Card style={tw`m-4 flex-shrink items-start w-full`}>
                                <Collapsible title={"Pokédex Entries"}>
                                    {
                                        details.descriptions.map((entry, index) => {
                                            return (
                                                <Text key={index} style={tw`text-base italic m-3`}>
                                                    • {entry}
                                                </Text>)
                                        })
                                    }
                                </Collapsible>
                            </Card>

                            { /* Image and type badges */ }
                        </View>
                    </Container>
                </ScrollView>
            </View>
        )
    }
}
