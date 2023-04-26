import React, {useMemo} from 'react'
import {View, Text, Image, Pressable, Platform} from 'react-native'
import {Pokemon} from '../../models/Pokemon'
import styles from '../styles'
import { LinearGradient } from 'expo-linear-gradient';

type PokemonCardProps = {
    pokemon: Pokemon,
    useCompactLayout: boolean,
    onPress: () => void
}

export default function PokemonCard({ pokemon, useCompactLayout, onPress }: PokemonCardProps) {

    const backgroundColors = useMemo(() => {
        const mapped = pokemon.types
            .flatMap((type) => {
                const color = styles.getColorForType(type)
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
            <View style={{
                flexDirection: 'row',
                minWidth: (Platform.OS == 'web' ? 200 : '100%'),
                ...styles.alignment.centered
            }}>
                <Text style={{ ...styles.labels.normal, flex: 1, color: '#fff', fontWeight: 'bold' }}>{pokemon.name}</Text>

                <Image
                    resizeMode='contain'
                    style={{ width: 40, height: 40, alignSelf: 'center', margin: 4 }}
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
                <Text style={{ ...styles.labels.small, alignSelf: 'flex-end' }}>#{pokemon.number}</Text>

                <Image
                    resizeMode='contain'
                        style={{
                            width: imageSize,
                            height: imageSize,
                            alignSelf: 'center',
                            margin: 8
                    }} source={{ uri: pokemon.spriteUrl }} />

                <Text
                    numberOfLines={1}
                    ellipsizeMode={"tail"}
                    style={{
                        ...styles.labels.normal,
                        alignSelf: 'flex-start',
                        fontWeight: 'bold'
                }}>{pokemon.name}</Text>
            </View>
        )
    }

    return (
        <Pressable
            onPress={(_) => onPress()}
            style={[styles.components.card, { margin: 8, padding: 0 }]}>

            {(state) => (
                <LinearGradient
                    // @ts-ignore - error claims that 'hovered' does not exist on state, but it does
                    colors={state.hovered ? ['#cccccc', '#cccccc'] : backgroundColors}
                    style={[
                        { padding: 12, borderRadius: 12 }
                    ]}
                    start={{x: 0, y: 1}}
                    end={{x: 1, y: 0}}
                >
                    { useCompactLayout ? _getCompactBody() : _getFullBody() }
                </LinearGradient>
            )}

        </Pressable>
    )
}