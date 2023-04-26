import React, {useEffect} from 'react'
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
            <View style={tw`flex-1 bg-white`}>
                <ScrollView>
                    <Container>
                        <View style={tw`flex-row flex-wrap justify-center items-center`}>
                            { /* Image and type badges */ }
                            <View style={tw`justify-center items-center`}>
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

                            <EvolutionChainView data={data.evolutionChain} />

                            { /* Pokédex Entries */ }
                            <View style={tw`m-8 p-3 border rounded shadow-md border border-gray-200 flex-shrink items-start`}>
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
