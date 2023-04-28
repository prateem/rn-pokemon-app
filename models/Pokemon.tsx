export interface Pokemon {
    number: number
    name: string
    types: Array<string>
    abilities: Array<string>
    moves: Array<PokemonMove>
    spriteUrl: string
}

export interface PokemonMove {
    name: string
    learnedAtLevel: number
    url: string
}

export interface PokemonMoveDetailed {
    move: PokemonMove
    data: { type: string }
}

export interface PokemonDetails {
    pokemon: Pokemon,
    descriptions: Array<string>
    evolutionChain: EvolutionChain,
    moves: Array<PokemonMoveDetailed>
}

export interface EvolutionChain {
    id: number
    evolutions: Array<Evolution>
}

export interface Evolution {
    from: number
    to: number
}

const pokemonTypeToColorMap = {
    normal: "#" + "A8A77A",
    fire: "#" + "EE8130",
    water: "#" + "6390F0",
    electric: "#" + "F7D02C",
    grass: "#" + "7AC74C",
    ice: "#" + "96D9D6",
    fighting: "#" + "C22E28",
    poison: "#" + "A33EA1",
    ground: "#" + "E2BF65",
    flying: "#" + "A98FF3",
    psychic: "#" + "F95587",
    bug: "#" + "A6B91A",
    rock: "#" + "B6A136",
    ghost: "#" + "735797",
    dragon: "#" + "6F35FC",
    dark: "#" + "705746",
    steel: "#" + "B7B7CE",
    fairy: "#" + "D685AD",

    // trainer-specific
    none: "#" + "ffffff",
    mixed: "#" + "000000"
}

export function getColorForType(type: string): string | undefined {
    let foundColor = Object.entries(pokemonTypeToColorMap)
        .find(([key, _]) => key == type)
        ?.[1]

    if (foundColor) {
        return foundColor
    }

    return undefined
}