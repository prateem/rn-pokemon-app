import React, {useMemo} from 'react'
import {View, Text, Image, Pressable, Platform, ViewStyle} from 'react-native'
import {getColorForType, Pokemon} from '../../../models/Pokemon'
import { LinearGradient } from 'expo-linear-gradient';
import tw from "twrnc";

type PokemonCardProps = {
    pokemon: Pokemon,
    useCompactLayout: boolean,
    onPress: () => void,
    style?: ViewStyle
}

export default function PokemonCard({ pokemon, useCompactLayout, onPress, style }: PokemonCardProps) {

    const backgroundColors = useMemo(() => {
        const mapped = pokemon.types
            .flatMap((type) => {
                const color = getColorForType(type)
                if (!color) { return [] }
                return color
            })

        // Ensure always at least two elements for LinearGradient to work
        if (mapped.length == 1) {
            mapped.push(mapped[0])
        }

        return mapped
    }, [pokemon])

    function _getCompactBody(): JSX.Element {
        return (
            <View style={
                tw.style(
                    `flex-row justify-center items-center`,
                    Platform.OS == 'web' ? `w-52` : `min-w-full`
                )}>
                <Text style={tw`text-base text-white font-bold flex-1`}>{pokemon.name}</Text>

                <Image
                    resizeMode='contain'
                    style={tw`w-10 h-10 m-1 self-center`}
                    source={{ uri: pokemon.spriteUrl }} />

            </View>
        )
    }

    function _getFullBody(): JSX.Element {
        const imageSize = (Platform.OS == 'web' ? 120 : 100)
        return (
            <View
                style={{
                    width: (imageSize + 16)
                }}>
                <Text style={tw`text-base self-end`}>#{pokemon.number}</Text>

                <Image
                    resizeMode='contain'
                    style={tw.style(
                        `self-center m-2`,
                        {
                            width: imageSize,
                            height: imageSize
                        })}
                    source={{ uri: pokemon.spriteUrl }} />

                <Text
                    numberOfLines={1}
                    ellipsizeMode={"tail"}
                    style={tw`text-base self-start font-bold`}>{pokemon.name}</Text>
            </View>
        )
    }

    return (
        <Pressable
            onPress={(_) => onPress()}
            style={tw.style(`rounded-3 m-2 shadow-md border border-gray-200`, style)}>
            {(state) => (
                <LinearGradient
                    // @ts-ignore - error claims that 'hovered' does not exist on state, but it does
                    colors={state.hovered ? ['#cccccc', '#cccccc'] : backgroundColors}
                    style={tw`p-3 rounded-3`}
                    start={{x: 0, y: 1}}
                    end={{x: 1, y: 0}}
                >
                    { useCompactLayout ? _getCompactBody() : _getFullBody() }
                </LinearGradient>
            )}

        </Pressable>
    )
}