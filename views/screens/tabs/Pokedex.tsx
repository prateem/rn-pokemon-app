import React, {useState} from 'react'
import {Text, View, ScrollView, TextInput, Image, Platform, KeyboardAvoidingView} from 'react-native'
import {usePokemon} from '../../../services/PokemonService'
import PokemonCard from '../../components/PokemonCard'
import styles from '../../styles'
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack'
import {AppRoute} from "../../../flows/core/AuthenticatedFlow";
import Loader from "../../components/core/Loader";
import { useHeaderHeight } from '@react-navigation/elements'

export default function Pokedex() {
    const pokemon = usePokemon()

    const [searched, setSearched] = useState<string>("")
    const navigation = useNavigation<StackNavigationProp<AppRoute>>()
    const headerHeight = useHeaderHeight()

    if (pokemon.isLoading || pokemon.isIdle)
        return (<Loader />)
    else if (pokemon.isError)
        return (<Text>{`Error: ${pokemon.error}`}</Text>)
    else
        return (
            <KeyboardAvoidingView
                keyboardVerticalOffset={headerHeight}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{flex: 1, backgroundColor: 'white'}}>
                <ScrollView>
                    <View style={[styles.components.container, styles.alignment.centered]}>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
                            {pokemon.data
                                ?.filter(pokemon => {
                                    if (searched.length == 0) {
                                        return true
                                    }

                                    const re = new RegExp(searched, 'i')
                                    if ((pokemon.name.match(re) || []).length > 0) {
                                        return true
                                    }

                                    return pokemon.types
                                        .filter((type) => (type.match(re) || []).length > 0)
                                        .length > 0
                                })
                                .map(pokemon =>
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

                <View style={{ paddingHorizontal: 12, paddingVertical: 6, flexDirection: 'row', backgroundColor: 'white', borderTopWidth: 0.5, borderTopColor: 'grey' }}>
                    <Image style={{width: 24, height: 24, alignSelf: 'center'}}
                           source={require('../../../assets/icons/filter.png')} />

                    <TextInput style={{...styles.components.textInput, flex: 1, marginHorizontal: 12}}
                               onChangeText={(text: string) => setSearched(text)}
                    />
                </View>
            </KeyboardAvoidingView>
        )
}
