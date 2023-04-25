import dataInstance, {DataStore} from "../core/DataStore";
import Pokemon from "../models/Pokemon";
import {BehaviorSubject, Observable} from 'rxjs';
import axios from 'axios';
import {DataLoadingState} from "./DataLoadingState";

export interface PokemonListDataState {
    state: DataLoadingState
    pokemon?: Array<Pokemon>
}

export interface PokemonInfoDataState {
    state: DataLoadingState
    info?: Pokemon
}

export interface PokedexEntriesDataState {
    state: DataLoadingState
    entries?: Array<string>
}

class PokemonService {

    dataStore: DataStore = dataInstance.insecure

    pokemonDataKey: string = "Nascent-Pokemon-Data"
    pokedexEntriesKeyBase: string = "Nascent-Pokemon-Pokedex-Entries"

    // OBSERVABLES
    p2 = new BehaviorSubject<PokemonListDataState>({ state: DataLoadingState.Loading })
    init() {

    }

    pokemon = new Observable<PokemonListDataState>((subscriber) => {
        subscriber.next({ state: DataLoadingState.Loading, pokemon: [] })
        this.__fetchPokemon()
            .then((pokemon) => subscriber.next({ state: DataLoadingState.Loaded, pokemon }))
            .catch((_) => subscriber.next({ state: DataLoadingState.Error, pokemon: [] }))
            .finally(() => subscriber.complete() )
    })

    getPokemonInfo(number: number): Observable<PokemonInfoDataState> {
        return new Observable((subscriber) => {
            subscriber.next({ state: DataLoadingState.Loading })

            this.pokemon.subscribe({
                next(data) {
                    if (data.state == DataLoadingState.Error) {
                        subscriber.next({ state: DataLoadingState.Error })
                    } else if (data.state == DataLoadingState.Loaded) {
                        let found = data.pokemon?.find((p) => p.number == number)
                        if (found) {
                            subscriber.next({
                                state: DataLoadingState.Loaded,
                                info: found
                            })
                        } else {
                            subscriber.next({ state: DataLoadingState.Error })
                        }
                    }
                },
                error(err) {
                    subscriber.next({ state: DataLoadingState.Error })
                },
                complete() {
                    subscriber.complete()
                }
            })
        })
    }

    getPokedexEntries(number: number): Observable<PokedexEntriesDataState> {
        return new Observable<PokedexEntriesDataState>((subscriber) => {
            subscriber.next({ state: DataLoadingState.Loading })

            this.__fetchPokedexEntries(number)
                .then((entries) => subscriber.next({ state: DataLoadingState.Loaded, entries }))
                .catch((_) => subscriber.next({ state: DataLoadingState.Error }))
                .finally(() => subscriber.complete() )
        })
    }

    // API CALLS
    async __fetchPokemon(): Promise<Array<Pokemon>> {
        let cached = await this.dataStore.read<Array<Pokemon>>(this.pokemonDataKey)
        if (cached) {
            return cached
        }

        const results: Array<Pokemon> = [];
        let data = await axios.get("https://pokeapi.co/api/v2/pokemon/?limit=251")

        if (data && data.data.results) {
            await Promise.all(
                data.data.results
                    .map((detail: any) =>
                        axios.get(detail.url)
                    ))
                .then((detailedPokemonList) => {
                    detailedPokemonList.forEach((pokemonData) => {
                        let pokemon = pokemonData.data
                        results.push(
                            {
                                number: pokemon.id,
                                name: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
                                types: pokemon.types.map((type: any) => type.type.name),
                                abilities: pokemon.abilities.map((ability: any) => ability.ability.name),
                                moves: pokemon.moves.map((move: any) => move.move.name),
                                spriteUrl: pokemon.sprites.other['official-artwork'].front_default
                            }
                        )
                    })
                })
                .then((_) => {
                    this.dataStore.write(this.pokemonDataKey, results)
                })
        }

        return results
    }

    async __fetchPokedexEntries(number: number): Promise<Array<string>> {
        let key = this.pokedexEntriesKeyBase + `_${number}`
        let cached = await this.dataStore.read<Array<string>>(key)
        if (cached) {
            return cached
        }

        const results: Array<string> = [];
        let data = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${number}`)

        if (data && data.data.flavor_text_entries) {
            data.data.flavor_text_entries
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

                    if (!results.includes(processed)) {
                        results.push(processed)
                    }
                })

            await this.dataStore.write(key, results)
        }

        return results
    }

}

let service = Object.freeze(new PokemonService())
export default service