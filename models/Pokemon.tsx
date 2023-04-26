export interface Pokemon {
    number: number
    name: string
    types: Array<string>
    abilities: Array<string>
    moves: Array<string>
    spriteUrl: string
}

export interface PokemonDetails {
    pokemon: Pokemon,
    descriptions: Array<string>
    evolutionChain: EvolutionChain
}

export interface EvolutionChain {
    id: number
    evolutions: Array<Evolution>
}

export interface Evolution {
    from: number
    to: number
}
