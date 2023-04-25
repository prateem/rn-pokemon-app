import React from 'react'
import { Text, View, ScrollView, Pressable } from 'react-native'
import pokemonService, { PokemonListDataState } from '../../../services/PokemonService'
import { bind } from "@react-rxjs/core"
import PokemonCard from '../../components/PokemonCard'
import styles from '../../styles'
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack'
import {AppRoute} from "../../../flows/core/AuthenticatedFlow";
import Loader from "../../components/core/Loader";
import {DataLoadingState} from "../../../services/DataLoadingState";

const [getPokemonData, _] = bind<PokemonListDataState>(
    pokemonService.pokemon,
    { state: DataLoadingState.Loading }
)

export default function Pokedex() {
    const data = getPokemonData()
    const navigation = useNavigation<StackNavigationProp<AppRoute>>()

    if (data.state == DataLoadingState.Loading)
        return (<Loader />)
    else if (data.state == DataLoadingState.Error)
        return (<Text>Error</Text>)
    else
        return (
            <ScrollView>
                <View style={[styles.components.container, styles.alignment.centered]}>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {data.pokemon?.map(pokemon =>
                            <PokemonCard
                                key={pokemon.number}
                                pokemon={pokemon}
                                useCompactLayout={false}
                                onPress={() => navigation.push('pokemon', { number: pokemon.number })}
                            />
                        )}
                    </View>
                </View>
            </ScrollView>
        )
}
