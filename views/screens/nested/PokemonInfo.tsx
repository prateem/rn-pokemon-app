import React, {useEffect, useState} from 'react'
import {StackScreenProps} from '@react-navigation/stack'
import {AppRoute} from '../../../core/AppRouter'
import pokemonService, {
    PokedexEntriesDataState,
    PokemonInfoDataState
} from '../../../services/PokemonService'
import {Image, ScrollView, Text, View} from 'react-native'
import styles from '../../styles'
import Loader from '../../components/core/Loader'
import {DataLoadingState} from "../../../services/DataLoadingState";

export default function PokemonInfo({ navigation, route }: StackScreenProps<AppRoute, 'pokemon'>) {
    const pokemonNumber = route.params.number

    const [pokemonInfo, setPokemonInfo]
        = useState<PokemonInfoDataState>({ state: DataLoadingState.Loading })

    const [pokedexEntries, setPokedexEntries]
        = useState<PokedexEntriesDataState>({ state: DataLoadingState.Loading })

    // Fetch Pokémon info
    useEffect(() => {
        navigation.setOptions({
            title: "#" + pokemonNumber
        })
        pokemonService.getPokemonInfo(pokemonNumber)
            .subscribe((data) => {
                setPokemonInfo(data)
                if (data.state == DataLoadingState.Loaded && data.info) {
                    navigation.setOptions({
                        title: data.info.name
                    })
                }
            })
    }, [pokemonNumber])

    // Get Pokédex entries
    useEffect(() => {
        pokemonService.getPokedexEntries(pokemonNumber)
            .subscribe((data) => {
                setPokedexEntries(data)
            })
    }, [pokemonNumber])

    if (pokemonInfo.state == DataLoadingState.Loading) {
        return (<Loader />)
    } else if (pokemonInfo.state == DataLoadingState.Error) {
        return (<Text>Pokemon not found</Text>)
    } else {
        const pokemon = pokemonInfo.info

        if (pokemon) {
            return (
                <View style={styles.components.page}>
                    <ScrollView>
                        <View style={styles.components.container}>
                            <View style={{ ...styles.alignment.centered, flexDirection: 'row', flexWrap: 'wrap' }}>
                                { /* Image and type badges */ }
                                <View style={styles.alignment.centered}>
                                    <Text style={styles.labels.normal}>#{pokemon.number}</Text>

                                    <Image
                                        resizeMode='contain'
                                        style={{ width: 120, height: 120, margin: 8 }}
                                        source={{ uri: pokemon.spriteUrl }} />

                                    <Text style={styles.labels.heading}>{pokemon.name}</Text>

                                    <View style={{ flexDirection: 'row', marginVertical: 8 }}>
                                        {pokemon.types.map((type, index) => {
                                            return (
                                                <Text key={index} style={{
                                                    ...styles.labels.normal,
                                                    ...styles.components.badge,
                                                    backgroundColor: styles.getColorForType(type),
                                                    color: 'white',
                                                    fontWeight: 'bold',
                                                }}>
                                                    {type.toTitleCase()}
                                                </Text>
                                            )
                                        })}
                                    </View>
                                </View>

                                { /* Pokédex Entries */ }
                                <View style={{ ...styles.components.card, margin: 24, flexShrink: 1 }}>
                                    <View style={{ flex: 1}}>
                                        <Text style={styles.labels.large}>Pokédex Entries</Text>

                                        {
                                            (pokedexEntries.state == DataLoadingState.Loaded && pokedexEntries.entries)
                                                ? (
                                                    pokedexEntries.entries.map((entry, index) => {
                                                        return (
                                                            <Text key={index} style={{...styles.labels.normal, fontStyle: 'italic', margin: 12}}>
                                                                • {entry}
                                                            </Text>)
                                                    })
                                                )
                                                : (pokedexEntries.state == DataLoadingState.Loading ? (<Loader />) : (<Text>Could not load Pokédex entries</Text>))
                                        }
                                    </View>
                                </View>

                                { /* Image and type badges */ }
                            </View>
                        </View>
                    </ScrollView>
                </View>
            )
        } else {
            return (<Text>Pokemon not found</Text>)
        }
    }
}
