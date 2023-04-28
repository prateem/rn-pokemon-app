import React, {useEffect, useState} from 'react'
import {StackScreenProps} from '@react-navigation/stack'
import {AppRoute} from "../../flows/authenticated/AuthenticatedFlow";
import {getPokemonDetails} from '../../services/PokemonService'
import {Image, ScrollView, Text, View} from 'react-native'
import Loader from '../components/core/Loader'
import EvolutionChainView from "../components/pokemon/EvolutionChain";
import Collapsible from "../components/Collapsible";
import tw from "twrnc";
import Container from "../components/Container";
import Badge from "../components/Badge";
import {getColorForType} from "../../models/Pokemon";

export default function PokemonInfo({ navigation, route }: StackScreenProps<AppRoute, 'pokemon'>) {
    const pokemonNumber = route.params.number

    const [availableWidth, setAvailableWidth] = useState(0)
    const pokemonInfo = getPokemonDetails(pokemonNumber)
    useEffect(() => {
        navigation.setOptions({
            title: pokemonInfo.isSuccess ? pokemonInfo.data.pokemon.name : "#" + pokemonNumber
        })
    }, [pokemonInfo])

    if (pokemonInfo.isLoading || pokemonInfo.isIdle) {
        return (<Loader />)
    } else if (pokemonInfo.isError) {
        return (<Text>Pokemon not found</Text>)
    } else {
        const data = pokemonInfo.data!
        return (
            <View style={tw`flex-1 bg-white`} onLayout={(event) => {
                const { width } = event.nativeEvent.layout
                setAvailableWidth(width)
            }}>
                <ScrollView>
                    <Container style={tw.style(availableWidth > 1400 && `mx-80`)}>
                        <View style={tw`flex-col web:flex-row web:flex-wrap justify-center items-center`}>
                            { /* Image and type badges */ }
                            <View style={tw`m-4 justify-center items-center`}>
                                <Text style={tw`text-base`}>#{data.pokemon.number}</Text>

                                <Image
                                    resizeMode='contain'
                                    style={tw`w-40 h-40 m-2`}
                                    source={{ uri: data.pokemon.spriteUrl }} />

                                <Text style={tw`text-5xl font-bold`}>{data.pokemon.name}</Text>

                                <View style={tw`flex-row my-2`}>
                                    {data.pokemon.types.map((type, index) => {
                                        return <Badge
                                            key={index}
                                            text={type.toTitleCase()}
                                            colorHex={getColorForType(type)}
                                            minWidth={80} />
                                    })}
                                </View>
                            </View>

                            <EvolutionChainView
                                data={data.evolutionChain}
                                viewing={pokemonNumber}
                                style={tw.style(availableWidth < 1400 ? `w-full` : `mx-20`)}
                            />

                            <View style={tw`m-4 p-3 border rounded bg-white shadow-md border border-gray-200 flex-shrink items-start w-full`}>
                                <Collapsible title={"Moves"} style={tw`w-full`}>
                                    <View style={tw`w-full border border-gray-400`}>
                                        <View style={tw`flex-row flex-1 bg-gray-300 p-2 border-b border-gray-400`}>
                                            <Text style={tw`text-base flex-3 font-bold self-center`}>Name</Text>
                                            <Text style={tw`text-base flex-2 font-bold text-center self-center`}>Type</Text>
                                            <Text style={tw`text-base flex-2 font-bold text-center self-center`}>@ Level</Text>
                                        </View>

                                        {
                                            data.moves
                                                .sort((a, b) => a.move.learnedAtLevel - b.move.learnedAtLevel)
                                                .map((move, index) => {
                                                    return (
                                                        <View key={index} style={tw.style(`flex-row px-2 py-1`, index % 2 == 0 ? `bg-gray-200` : `bg-gray-100`)}>
                                                            <Text style={tw`text-sm flex-3 self-center`}>{move.move.name.toTitleCase()}</Text>
                                                            <View style={tw`flex-2 self-center`}>
                                                                <Badge text={move.data.type.toTitleCase()} colorHex={getColorForType(move.data.type)} minWidth={80} />
                                                            </View>
                                                            <Text style={tw`text-sm flex-2 text-center self-center`}>{move.move.learnedAtLevel}</Text>
                                                        </View>
                                                    )
                                                })
                                        }
                                    </View>
                                </Collapsible>
                            </View>

                            { /* Pokédex Entries */ }
                            <View style={tw`m-4 p-3 border rounded bg-white shadow-md border border-gray-200 flex-shrink items-start w-full`}>
                                <Collapsible title={"Pokédex Entries"}>
                                    {
                                        data.descriptions.map((entry, index) => {
                                            return (
                                                <Text key={index} style={tw`text-base italic m-3`}>
                                                    • {entry}
                                                </Text>)
                                        })
                                    }
                                </Collapsible>
                            </View>

                            { /* Image and type badges */ }
                        </View>
                    </Container>
                </ScrollView>
            </View>
        )
    }
}
