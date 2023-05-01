import {ImageKey} from "./mocks/trainers";

export default interface Trainer {
    id: number
    name: string
    specialty: string | null
    asset: ImageKey
    pokemon: Array<RosterPokemon>
}

export type RosterPokemon = {
    number: number
    level: number
}
