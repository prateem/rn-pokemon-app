export type RosterPokemon = {
    level: number
    number: number
}

export interface Trainer2 {
    id: number
    name: string
    specialty: string | null
    pokemon: Array<RosterPokemon>
}

export default interface Trainer {
    id: number
    name: string
    specialty: string | null
    asset: string | null
    pokemon: Array<number>
}

