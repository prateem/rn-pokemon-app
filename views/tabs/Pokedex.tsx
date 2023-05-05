import React, {useState} from 'react'
import {
    Text,
    View,
    Image,
    Platform,
    KeyboardAvoidingView,
    InteractionManager, FlatList
} from 'react-native'
import {POKEDEX_LIMIT, usePokemon} from '../../services/PokemonService'
import PokemonCard, {usePokemonFullCardSize} from '../components/pokemon/PokemonCard'
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack'
import {AppRoute} from "../../flows/authenticated/AuthenticatedFlow";
import Loader from "../components/core/Loader";
import { useHeaderHeight } from '@react-navigation/elements'
import tw from "twrnc";
import AppInputField from "../components/AppInputField";
import {Pokemon} from "../../models/Pokemon";
import {PropsWithStyle} from "../../App";

// Scroll position 'memory'
let pokemonToScrollTo: number | null = 0

type PokedexProps = {
    isNested: boolean | undefined,
    onSelectPokemon?: (pokemon: Pokemon) => void
} & PropsWithStyle

export default function Pokedex(props: PokedexProps) {
    const pokemon = usePokemon()

    const [searched, setSearched] = useState<string>("")
    const [grid, setGrid] = useState({ rows: 1, columns: 1 })

    const pokemonCardSize = usePokemonFullCardSize()

    const navigation = useNavigation<StackNavigationProp<AppRoute>>()
    const headerHeight = useHeaderHeight()

    if (pokemon.isLoading || pokemon.isIdle)
        return (<Loader />)
    else if (pokemon.isError)
        return (<Text>{`Error: ${pokemon.error}`}</Text>)
    else {
        const filteredPokemon = pokemon.data
            ?.filter(pokemon => {
                const searching = searched.trim()
                if (searching.length == 0) {
                    return true
                }

                const re = new RegExp(searching, 'i')
                if ((pokemon.name.match(re) || []).length > 0) {
                    return true
                }

                return (pokemon.baseInfo?.types || [])
                    .filter((type) => (type.match(re) || []).length > 0)
                    .length > 0
            }) || []

        return (
            <KeyboardAvoidingView
                enabled={!props.isNested}
                keyboardVerticalOffset={headerHeight}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={tw.style(`flex-1 bg-white`, props.style)}>

                <FlatList
                    style={tw`flex-1 bg-white p-3`}
                    // because supporting flex-wrap: 'wrap' on FlatList is too much work?
                    // see: https://github.com/facebook/react-native/issues/13939#issuecomment-355075463
                    onLayout={(event) => {
                        const { width: availableWidth, height: availableHeight } = event.nativeEvent.layout

                        setGrid({
                            rows: Math.floor(availableHeight / pokemonCardSize.height),
                            columns: Math.floor(availableWidth / pokemonCardSize.width)
                        })
                    }}
                    initialNumToRender={40}
                    numColumns={grid.columns}
                    key={grid.columns}
                    getItemLayout={(data, rowIndex) => {
                        return {
                            length: pokemonCardSize.height,
                            offset: pokemonCardSize.height * rowIndex,
                            index: rowIndex
                        }
                    }}
                    initialScrollIndex={((): number => {
                        if (pokemonToScrollTo && pokemonToScrollTo > 0 && pokemonToScrollTo <= POKEDEX_LIMIT && grid.columns > 0) {
                            const containingRow = Math.floor(pokemonToScrollTo / grid.columns)
                            pokemonToScrollTo = null
                            return containingRow - Math.floor(grid.rows / 2)
                        }

                        return 0
                    })()}
                    contentContainerStyle={tw`justify-center items-center`}
                    data={filteredPokemon}
                    keyExtractor={ p => p.number.toString() }
                    renderItem={({ item: pokemon }) => {
                        return <PokemonCard
                            key={pokemon.number}
                            pokemon={pokemon}
                            useCompactLayout={false}
                            onPress={() => {
                                if (props.onSelectPokemon) {
                                    props.onSelectPokemon(pokemon)
                                } else {
                                    navigation.push('pokemon', {number: pokemon.number})
                                    InteractionManager.runAfterInteractions(() => {
                                        pokemonToScrollTo = pokemon.number
                                    })
                                }
                            }}/>
                }}/>

                <View style={tw`px-3 py-2 flex-row bg-white border-t border-gray-200`}>
                    <Image style={tw`w-8 h-8 self-center`}
                           source={require('../../assets/icons/filter.png')}/>

                    <AppInputField
                        style={tw`flex-1 mx-3`}
                        inputProps={{
                            style: tw`flex-1 h-full`,
                            onChangeText: (t) => setSearched(t)
                        }} />
                </View>
            </KeyboardAvoidingView>
        )
    }
}
