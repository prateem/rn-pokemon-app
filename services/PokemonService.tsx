import dataInstance, {DataStore} from "../core/DataStore";
import {Evolution, EvolutionChain, Pokemon, PokemonDetails, PokemonMove, PokemonMoveDetailed} from "../models/Pokemon";
import axios from 'axios';
import {useQuery} from "react-query";

const dataStore: DataStore = dataInstance.insecure
const pokemonDataKey: string = "Nascent-Pokemon-Data"
const pokemonDetailsKeyBase: string = "Nascent-Pokemon-Detail-Entries"
const evolutionChainKeyBase: string = "Nascent-Pokemon-Evolution-Chain"
const moveDataKeyBase: string = "Nascent-Pokemon-Move-Data"

class PokemonService {

    // API CALLS
    async fetchPokemon(): Promise<Array<Pokemon>> {
        const dataStore = dataInstance.insecure
        let cached = await dataStore.read<Array<Pokemon>>(pokemonDataKey)
        if (cached) {
            return cached
        }

        const results: Array<Pokemon> = [];
        let data = await axios.get("https://pokeapi.co/api/v2/pokemon/?limit=251")

        if (data && data.data.results) {
            await Promise.all(data.data.results.map((detail: any) => axios.get(detail.url)))
                .then((detailedPokemonList) => {
                    detailedPokemonList.forEach((pokemonData) => {
                        let pokemon = pokemonData.data
                        results.push(
                            {
                                number: pokemon.id,
                                name: pokemon.name.toTitleCase(),
                                types: pokemon.types.map((type: any) => type.type.name),
                                abilities: pokemon.abilities.map((ability: any) => ability.ability.name),
                                moves: mapMoves(pokemon.moves),
                                spriteUrl: pokemon.sprites.other['official-artwork'].front_default
                            }
                        )
                    })
                })
                .then((_) => {
                    dataStore.write(pokemonDataKey, results)
                })
        }

        return results
    }

    async fetchPokemonDetails(pokemon: Pokemon): Promise<PokemonDetails> {
        let key = pokemonDetailsKeyBase + `_${pokemon.number}`
        let cached = await dataStore.read<PokemonDetails>(key)
        if (cached) {
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

        const moves = await Promise.all(
            pokemon.moves.map(it => getMoveData(it))
        )

        const details = {pokemon, descriptions, evolutionChain, moves}

        await dataStore.write(key, details)

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

            if (fromNumber <= 251 && toNumber <= 251) {
                evolutions.push({ from: fromNumber, to: toNumber })
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
                    && ['crystal', 'gold-silver'].includes(it.version_group.name)
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

async function getMoveData(move: PokemonMove): Promise<PokemonMoveDetailed> {
    const moveId = move.url
        .replace(/^\/+|\/+$/g, '')
        .split('/')
        .pop()

    const key = moveDataKeyBase + `_${moveId}`
    const cached = await dataStore.read<PokemonMoveDetailed>(key)
    if (cached) {
        return cached
    }

    const allData = await axios.get(move.url)
    const data: PokemonMoveDetailed = { move, data: { type: allData.data.type.name } }
    await dataStore.write(key, data)

    return data
}

let service = Object.freeze(new PokemonService())

export function usePokemon() {
    return useQuery<Pokemon[], Error>('pokemon', service.fetchPokemon)
}

export function getPokemonDetails(pokemonNumber: number) {
    const pokemonData = usePokemon()
    const pokemon = pokemonData.data
        ?.find((p: Pokemon) => p.number == pokemonNumber)

    return useQuery<PokemonDetails, Error>({
        queryKey: ['pokemon-details', pokemonNumber],
        queryFn: async () => {
            return service.fetchPokemonDetails(pokemon!)
        },
        enabled: !!pokemon
    })
}
