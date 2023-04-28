import React, {useState} from 'react'
import {
    Text,
    View,
    ScrollView,
    TextInput,
    Image,
    Platform,
    KeyboardAvoidingView,
    Pressable,
    FlatList
} from 'react-native'
import {usePokemon} from '../../services/PokemonService'
import PokemonCard from '../components/pokemon/PokemonCard'
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack'
import {AppRoute} from "../../flows/authenticated/AuthenticatedFlow";
import Loader from "../components/core/Loader";
import { useHeaderHeight } from '@react-navigation/elements'
import tw from "twrnc";
import Container from "../components/Container";
import AppInputField from "../components/AppInputField";

export default function Pokedex() {
    const pokemon = usePokemon()

    const [searched, setSearched] = useState<string>("")
    const [columns, setColumns] = useState(1)

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

                return pokemon.types
                    .filter((type) => (type.match(re) || []).length > 0)
                    .length > 0
            }) || []

        return (
            <KeyboardAvoidingView
                keyboardVerticalOffset={headerHeight}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={tw`flex-1 bg-white`}>

                <FlatList
                    style={tw`flex-1 bg-white p-3`}
                    // because supporting flex-wrap: 'wrap' on FlatList is too much work?
                    // see: https://github.com/facebook/react-native/issues/13939#issuecomment-355075463
                    onLayout={(event) => {
                        const { width: availableWidth } = event.nativeEvent.layout

                        // imageSize (same as PokemonCard full body) + some generous spacing potential
                        const itemWidth = (Platform.OS == 'web' ? 120 : 100) + 60

                        setColumns(Math.floor(availableWidth / itemWidth))
                    }}
                    numColumns={columns}
                    key={columns}
                    contentContainerStyle={tw`justify-center items-center`}
                    data={filteredPokemon}
                    keyExtractor={ p => p.number.toString() }
                    renderItem={({ item: pokemon }) => {
                    return <PokemonCard
                        key={pokemon.number}
                        pokemon={pokemon}
                        useCompactLayout={false}
                        onPress={() => navigation.push('pokemon', {number: pokemon.number})}
                    />
                }}/>

                <View style={tw`px-3 py-2 flex-row bg-white border-t border-gray-200`}>
                    <Image style={tw`w-8 h-8 self-center`}
                           source={require('../../assets/icons/filter.png')}/>

                    <AppInputField
                        style={tw`flex-1 mx-3`}
                        onTextChange={(t) => setSearched(t)}/>
                </View>
            </KeyboardAvoidingView>
        )
    }
}
