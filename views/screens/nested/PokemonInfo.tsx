import React, {useEffect} from 'react'
import {StackScreenProps} from '@react-navigation/stack'
import {AppRoute} from "../../../flows/core/AuthenticatedFlow";
import {getPokemonDetails} from '../../../services/PokemonService'
import {Image, ScrollView, Text, View} from 'react-native'
import styles from '../../styles'
import Loader from '../../components/core/Loader'
import {Evolution} from "../../../models/Pokemon";
import pokemon from "../../../models/mocks/pokemon";

/**
 * @description
 * Takes an Array<V>, and a grouping function,
 * and returns a Map of the array grouped by the grouping function.
 *
 * @param list An array of type V.
 * @param keyGetter A Function that takes the the Array type V as an input, and returns a value of type K.
 *                  K is generally intended to be a property key of V.
 *
 * @returns Map of the array grouped by the grouping function.
 */
export function groupBy<K, V>(list: Array<V>, keyGetter: (input: V) => K): Map<K, Array<V>> {
    const map = new Map<K, Array<V>>();
    list.forEach((item) => {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (!collection) {
            map.set(key, [item]);
        } else {
            collection.push(item);
        }
    });
    return map;
}

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
            <View style={styles.components.page}>
                <ScrollView>
                    <View style={styles.components.container}>
                        <View style={{ ...styles.alignment.centered, flexDirection: 'row', flexWrap: 'wrap' }}>
                            { /* Image and type badges */ }
                            <View style={styles.alignment.centered}>
                                <Text style={styles.labels.normal}>#{data.pokemon.number}</Text>

                                <Image
                                    resizeMode='contain'
                                    style={{ width: 120, height: 120, margin: 8 }}
                                    source={{ uri: data.pokemon.spriteUrl }} />

                                <Text style={styles.labels.heading}>{data.pokemon.name}</Text>

                                <View style={{ flexDirection: 'row', marginVertical: 8 }}>
                                    {data.pokemon.types.map((type, index) => {
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
                                        data.descriptions.map((entry, index) => {
                                            return (
                                                <Text key={index} style={{...styles.labels.normal, fontStyle: 'italic', margin: 12}}>
                                                    • {entry}
                                                </Text>)
                                        })
                                    }
                                </View>
                            </View>

                            { /* Image and type badges */ }
                        </View>
                    </View>
                </ScrollView>
            </View>
        )
    }
}
