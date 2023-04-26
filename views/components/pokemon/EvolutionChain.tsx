import React, {useMemo} from "react";
import {View, Text, Image} from "react-native";
import tw from "twrnc";
import {Evolution, EvolutionChain} from "../../../models/Pokemon";
import {usePokemon} from "../../../services/PokemonService";
import Loader from "../core/Loader";
import PokemonCard from "./PokemonCard";
import {useNavigation} from "@react-navigation/native";
import {StackNavigationProp} from "@react-navigation/stack";
import {AppRoute} from "../../../flows/authenticated/AuthenticatedFlow";

type EvolutionChainProps = {
    data: EvolutionChain
}

export default function EvolutionChainView({ data }: EvolutionChainProps) {
    const chain = useMemo(() => {
        const mapped = groupBy(
            data.evolutions,
            (ev) => ev.from
        )

        const handled: number[] = []
        function handle(key: number) {
            handled.push(key)
            const evolutions = mapped.get(key) || []
            evolutions.forEach((it) => handle(it.to))
        }

        const elements: Array<JSX.Element> = []
        mapped.forEach((_, key, __) => {
            if (!handled.includes(key)) {
                handle(key)
                elements.push((<EvolutionView key={`from-${key}`} map={mapped} display={key} />))
            }
        })

        return elements
    }, [data])

    if (chain.length == 0) {
        // Nothing to show
        return (<></>)
    }

    return (
        <View style={tw`m-8 p-3 rounded border border-gray-200 shadow-md flex-shrink`}>
            <View>
                <Text style={tw`text-lg font-bold pb-2`}>Evolution Chain:</Text>

                {chain}
            </View>
        </View>
    )
}


type EvolutionViewProps = {
    map: Map<number, Evolution[]>
    display: number
}

function EvolutionView({ map, display }: EvolutionViewProps) {
    const pokemon = usePokemon()
    const navigation = useNavigation<StackNavigationProp<AppRoute>>()
    const evolvesTo = useMemo(() => map.get(display) || [], [map, display])

    if (pokemon.isLoading || pokemon.isIdle) {
        return <Loader />
    } else if (pokemon.isError) {
        return (<></>)
    } else {
        const from = pokemon.data!.find((p) => p.number == display)!

        return (
            <View>
                <PokemonCard
                    pokemon={from}
                    useCompactLayout={true}
                    style={tw`self-center`}
                    onPress={() => {
                        navigation.push('pokemon', { number: from.number} )
                    }} />

                <Image
                    style={tw`w-6 h-6 self-center`}
                    source={require('../../../assets/icons/down-arrow.png')} />

                <View style={tw`flex-row flex-wrap`}>
                    {evolvesTo.map((evolution) => {
                        if (map.has(evolution.to)) {
                            return (<EvolutionView key={`from-${display}-to-${evolution.to}`} map={map} display={evolution.to} />)
                        } else {
                            const to = pokemon.data!.find((p) => p.number == evolution.to)!
                            return (
                                <PokemonCard
                                    key={`from-${display}-to-${evolution.to}`}
                                    pokemon={to}
                                    useCompactLayout={true}
                                    style={tw`self-center justify-center`}
                                    onPress={() => {
                                        navigation.push('pokemon', { number: to.number} )
                                    }} />
                            )
                        }
                    })}
                </View>
            </View>
        )
    }
}

/**
 * From: https://stackoverflow.com/a/38327540/2623229
 *
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
function groupBy<K, V>(list: Array<V>, keyGetter: (input: V) => K): Map<K, Array<V>> {
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
