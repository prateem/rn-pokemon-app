import dataInstance, {DataStore} from "../core/DataStore";
import {
    Evolution,
    EvolutionChain,
    PokemonBaseInfo,
    PokemonDetails,
    PokemonMove,
    PokemonMoveData,
    Pokemon
} from "../models/Pokemon";
import axios from 'axios';
import {useQuery} from "react-query";
import apiClient from "../core/ApiClient";

export const POKEDEX_LIMIT: number = 251

const dataStore: DataStore = dataInstance.inMemory
const pokemonDataKey: string = "Nascent-Pokemon-Data"
const pokemonBaseInfoKeyBase: string = "Nascent-Pokemon-BaseInfo-Entry"
const pokemonDetailsKeyBase: string = "Nascent-Pokemon-Detail-Entry"
const evolutionChainKeyBase: string = "Nascent-Pokemon-Evolution-Chain"
const moveDataKeyBase: string = "Nascent-Pokemon-Move-Data"

class PokemonService {

    // API CALLS
    async fetchPokemon(): Promise<Array<Pokemon>> {
        // Override the target data store to the insecure store
        const dataStore = dataInstance.inMemory

        let cached = await dataStore.read<Array<Pokemon>>(pokemonDataKey)
        if (cached) {
            return cached
        }

        const results: Array<Pokemon> = [];
        let data = await apiClient.get('pokemon-list', `https://pokeapi.co/api/v2/pokemon/?limit=${POKEDEX_LIMIT}`)

        if (data && data.data.results) {
            data.data.results.forEach((info: any) => {
                const number = info.url.replace(/^\/+|\/+$/g, '')
                    .split('/')
                    .pop()
                const name = info.name.toTitleCase()
                results.push({ name, number, detailUrl: info.url })
            })
        }

        await dataStore.write(pokemonDataKey, results)

        return results
    }

    async hydrateBaseInfo(pokemon: Pokemon): Promise<PokemonBaseInfo> {
        if (pokemon.baseInfo) {
            return pokemon.baseInfo
        }

        // Override the target data store to the insecure store
        const dataStore = dataInstance.inMemory

        let key = pokemonBaseInfoKeyBase + `_${pokemon.number}`
        let cached = await dataStore.read<PokemonBaseInfo>(key)
        if (cached) {
            pokemon.baseInfo = cached
            return cached
        }

        const request = await apiClient.get(key, pokemon.detailUrl)
        if (request.data) {
            const detail = request.data
            const baseInfo: PokemonBaseInfo = {
                abilities: detail.abilities.map((abilityEntry: any) => abilityEntry.ability.name),
                moves: mapMoves(detail.moves),
                spriteUrl: detail.sprites.other['official-artwork'].front_default,
                types: detail.types.map((typeEntry: any) => typeEntry.type.name)
            }
            await dataStore.write(key, baseInfo)
            pokemon.baseInfo = baseInfo
        }

        // will cause React Query fail if request did not complete
        return pokemon.baseInfo!
    }

    async hydrateDetails(pokemon: Pokemon): Promise<PokemonDetails> {
        let baseInfo = pokemon.baseInfo
        if (!baseInfo) {
            baseInfo = await this.hydrateBaseInfo(pokemon)
        }

        if (pokemon.details) {
            return pokemon.details
        }

        let key = pokemonDetailsKeyBase + `_${pokemon.number}`
        let cached = await dataStore.read<PokemonDetails>(key)
        if (cached) {
            pokemon.details = cached
            return cached
        }

        let evolutionChain: EvolutionChain = { id: -1, evolutions: [] }
        const descriptions: Array<string> = [];
        let speciesData = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.number}`)

        if (speciesData.data) {
            // Descriptions
            if (speciesData.data.flavor_text_entries) {
                speciesData.data.flavor_text_entries
                    .filter((entry: any) => entry.language.name == "en")
                    .forEach((entry: any) => {
                        let text: string = entry.flavor_text

                        // Page breaks are treated just like newlines.
                        // Soft hyphens followed by newlines vanish.
                        // Letter-hyphen-newline becomes letter-hyphen, to preserve real hyphenation.
                        // Any other newline becomes a space.
                        // See: https://github.com/veekun/pokedex/issues/218#issuecomment-339841781
                        let processed = text.replace(/\f/g, '\n')
                            .replace(/\u00ad\n/g, '')
                            .replace(/\u00ad/g, '')
                            .replace(/ -\n/g, ' - ')
                            .replace(/-\n/g, '-')
                            .replace(/\n/g, ' ')

                        if (!descriptions.includes(processed)) {
                            descriptions.push(processed)
                        }
                    })
            }

            // Evolution chain
            if (speciesData.data.evolution_chain) {
                evolutionChain = await this.getEvolutionChain(speciesData.data.evolution_chain.url)
            }
        }

        await Promise.all(
            baseInfo.moves
                .map(it => hydrateMoveData(it))
        )

        const details: PokemonDetails = {descriptions, evolutionChain}
        await dataStore.write(key, details)
        pokemon.details = details

        return details
    }

    async getEvolutionChain(chainUrl: string): Promise<EvolutionChain> {
        const chainId = chainUrl.split('/').pop()!

        let key = evolutionChainKeyBase + `_${chainId}`
        let cached = await dataStore.read<EvolutionChain>(key)
        if (cached) {
            return cached
        }

        let evolutions: Evolution[] = []
        let evolutionChainData = await axios.get(chainUrl)
        if (evolutionChainData.data) {
            evolutions = this.transformEvolutionChainData(evolutionChainData.data.chain)
        }

        return { id: parseInt(chainId), evolutions }
    }

    transformEvolutionChainData(chain: any): Evolution[] {
        const fromNumber: number = chain.species.url
            .replace(/^\/+|\/+$/g, '')
            .split('/')
            .pop()

        let evolutions: Evolution[] = []

        chain['evolves_to'].forEach((e: any) => {
            const toNumber: number = e.species.url
                .replace(/^\/+|\/+$/g, '')
                .split('/')
                .pop()

            let trigger: string | undefined = undefined
            let details = e.evolution_details[0]
            if (details.trigger.name == 'level-up') {
                const lvl = details.min_level

                if (lvl) {
                    trigger = `Lv. ${e.evolution_details[0].min_level}`
                } else {
                    const time = details.time_of_day
                    const happiness = details.min_happiness

                    if (happiness && time.length > 0) {
                        trigger = `Lv. up (happiness/${time})`
                    } else if (happiness) {
                        trigger = `Lv. up (happiness)`
                    }
                }
            } else if (details.trigger.name == 'use-item') {
                trigger = details.item.name.split('-').join(' ').toTitleCase()
            } else if (details.trigger.name == 'trade') {
                const item = details.held_item && details.held_item.name
                if (item) {
                    trigger = `Trade (${item.split('-').join(' ').toTitleCase()})`
                } else {
                    trigger = `Trade`
                }
            }

            if (fromNumber <= POKEDEX_LIMIT && toNumber <= POKEDEX_LIMIT) {
                evolutions.push({ from: fromNumber, to: toNumber, trigger })
            }

            evolutions.push(
                ...this.transformEvolutionChainData(e)
            )
        })

        return evolutions
    }

}

function mapMoves(entries: any): PokemonMove[] {
    return entries
        .flatMap((entry: any) => {
            const detailList = entry.version_group_details
            const details = detailList.filter((it: any) => {
                return it.move_learn_method.name
                    && it.version_group.name
                    && it.move_learn_method.name == 'level-up'
                    // && ['crystal', 'gold-silver'].includes(it.version_group.name)
            }).reverse()[0]

            if (!details) {
                return []
            }

            return {
                name: entry.move.name,
                learnedAtLevel: details.level_learned_at,
                url: entry.move.url
            }
        })
}

async function hydrateMoveData(move: PokemonMove): Promise<PokemonMoveData> {
    if (move.data) {
        return move.data
    }

    const moveId = move.url
        .replace(/^\/+|\/+$/g, '')
        .split('/')
        .pop()

    const key = moveDataKeyBase + `_${moveId}`
    const cached = await dataStore.read<PokemonMoveData>(key)
    if (cached) {
        move.data = cached
        return cached
    }

    const allData = await apiClient.get(key, move.url)
    const data: PokemonMoveData = { type: allData.data.type.name }
    move.data = data

    await dataStore.write(key, data)
    return data
}

let service = Object.freeze(new PokemonService())

export function usePokemon() {
    return useQuery<Pokemon[], Error>('pokemon', service.fetchPokemon)
}

export function getPokemonWithBaseInfo(pokemonNumber: number) {
    const pokemonData = usePokemon()
    const pokemon = pokemonData.data
        ?.find((p: Pokemon) => p.number == pokemonNumber)

    return useQuery<Pokemon, Error>({
        queryKey: ['pokemon-base-info', pokemonNumber],
        queryFn: async () => {
            await service.hydrateBaseInfo(pokemon!)
            return pokemon!
        },
        enabled: !!pokemon
    })
}

export function getPokemonWithFullDetails(pokemonNumber: number) {
    const pokemonData = usePokemon()
    const pokemon = pokemonData.data
        ?.find((p: Pokemon) => p.number == pokemonNumber)

    return useQuery<Pokemon, Error>({
        queryKey: ['pokemon-details', pokemonNumber],
        queryFn: async () => {
            await service.hydrateDetails(pokemon!)
            return pokemon!
        },
        enabled: !!pokemon
    })
}
