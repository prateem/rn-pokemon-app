import React, {useMemo} from 'react'
import {Image, Platform, Pressable, Text, View} from 'react-native'
import {getColorForType, Pokemon} from '../../../models/Pokemon'
import {LinearGradient} from 'expo-linear-gradient';
import tw from "twrnc";
import Card from "../Card";
import {PropsWithStyle} from "../../../App";
import {getPokemonWithBaseInfo} from "../../../services/PokemonService";
import Loader from "../core/Loader";

type PokemonCardProps = {
    pokemon: Pokemon,
    subtext?: string,
    useCompactLayout: boolean,
    onPress?: () => void
} & PropsWithStyle

export default function PokemonCard(props: PokemonCardProps) {
    const {
        pokemon,
        subtext,
        useCompactLayout,
        onPress,
        style
    } = props

    const cardSize = usePokemonFullCardSize()
    const pokemonData = getPokemonWithBaseInfo(pokemon.number)

    const backgroundColors = useMemo(() => {
        return (pokemon.baseInfo?.types || [])
            .flatMap((type) => {
                const color = getColorForType(type)
                if (!color) {
                    return []
                }
                return color
            })
    }, [pokemon.baseInfo])

    if (pokemonData.isLoading || pokemonData.isIdle) {
        return (
            <Card style={tw.style(
                `m-2 rounded-3 p-0`,
                useCompactLayout ? `w-52 h-6` : { width: cardSize.width, height: cardSize.height },
                style
            )}>
                <Loader />
            </Card>
        )
    } else if (pokemonData.isError) {
        return <></>
    }

    return (
        <Pressable onPress={onPress}>
            {(state) => (
                <Card style={tw.style(`m-2 rounded-3 p-0`, state.pressed && { opacity: 0.5 }, style)}>
                    {backgroundColors.length < 2
                        ? (
                            // Default gradient
                            <View style={tw.style(`rounded-3`, { backgroundColor: backgroundColors[0] })}>
                                <LinearGradient
                                    // @ts-ignore - error claims that 'hovered' does not exist on state, but it does
                                    colors={state.hovered ? ['#cccccc', '#cccccc'] : ['#00000000', '#00000033']}
                                    style={tw`rounded-3`}>
                                    <View style={tw`p-3`}>
                                        { useCompactLayout ? _getCompactBody(pokemon, subtext) : _getFullBody(pokemon, subtext) }
                                    </View>
                                </LinearGradient>
                            </View>
                        )
                        : (
                            // Type-based gradient
                            <LinearGradient
                                // @ts-ignore - error claims that 'hovered' does not exist on state, but it does
                                colors={state.hovered ? ['#cccccc', '#cccccc'] : backgroundColors}
                                style={tw`rounded-3`}
                                start={{x: 0, y: 1}}
                                end={{x: 1, y: 0}}>
                                <View style={tw`p-3`}>
                                    { useCompactLayout ? _getCompactBody(pokemon, subtext) : _getFullBody(pokemon, subtext) }
                                </View>
                            </LinearGradient>
                        )}
                </Card>
            )}
        </Pressable>
    )
}

export function usePokemonFullCardSize() {
    return useMemo(() => {
        // margin(card) + borders(card) + padding(card) + margin(image) + width(image) + extra space for padding
        const width = 16 + 2 + 24 + 16 + (Platform.OS == 'web' ? 120 : 100) + 16

        // margin(card) + borders(card) + padding(card) + margin(image) + height(image) + lineHeight(text)
        const height = 16 + 2 + 24 + 16 + (Platform.OS == 'web' ? 120 : 100) + 48
        return { width, height }
    }, [Platform.OS])
}

function _getCompactBody(pokemon: Pokemon, subtext?: string): JSX.Element {
    return (
        <View style={
            tw.style(
                `flex-row justify-center items-center`,
                Platform.OS == 'web' ? `w-52` : `min-w-full`
            )}>

            <View style={tw`flex-1`}>
                <Text style={tw`text-base text-white font-bold`}>{pokemon.name}</Text>
                { subtext && subtext.length > 0 && <Text style={tw`text-sm text-white`}>{subtext}</Text>}
            </View>

            { pokemon.baseInfo?.spriteUrl && (
                <Image
                    resizeMode='contain'
                    style={tw`w-10 h-10 m-1 self-center`}
                    source={{ uri: pokemon.baseInfo.spriteUrl }} />
            )}

        </View>
    )
}

function _getFullBody(pokemon: Pokemon, subtext?: string): JSX.Element {
    const imageSize = (Platform.OS == 'web' ? 120 : 100)
    return (
        <View
            style={{ width: (imageSize + 16) }}>
            <Text style={tw`text-base self-end`}>#{pokemon.number}</Text>

            { pokemon.baseInfo?.spriteUrl && (
                <Image
                    resizeMode='contain'
                    style={tw.style(
                        `self-center m-2`,
                        {
                            width: imageSize,
                            height: imageSize
                        })}
                    source={{ uri: pokemon.baseInfo.spriteUrl }} />
            )}

            {subtext && subtext.length > 0 &&
                <Text
                    numberOfLines={1}
                    ellipsizeMode={"tail"}
                    style={tw`text-small self-start my-1`}>{subtext}</Text>
            }

            <Text
                numberOfLines={1}
                ellipsizeMode={"tail"}
                style={tw`text-base self-start font-bold`}>{pokemon.name}</Text>
        </View>
    )
}
