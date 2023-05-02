import Trainer from "../models/Trainer"
import dataInstance, {DataStore} from "../core/DataStore";
import trainerMocks from "../models/mocks/trainers"
import {Pokemon} from "../models/Pokemon";
import {usePokemon} from "./PokemonService";
import {useMutation, useQuery, useQueryClient} from "react-query";

export type TrainerClassifications = {
    common: Array<Trainer>
    gymLeaders: Array<Trainer>
    eliteFour: Array<Trainer>
}

export type TrainerInfoModel = {
    trainer: Trainer,
    pokemon: Array<{pokemon: Pokemon, level: number}>
}

const dataStore: DataStore = dataInstance.inMemory
const trainerDataKey: string = "Nascent-Trainer-Data"

class TrainerService {

    // DATA
    async fetchTrainers(): Promise<TrainerClassifications> {
        const cached = await dataStore.read<TrainerClassifications>(trainerDataKey)
        if (cached) {
            return cached
        }

        const data = trainerMocks
        await dataStore.write(trainerDataKey, data)
        return data
    }

    async addPokemonToTrainer(trainer: Trainer, pokemon: Pokemon) {
        return
    }

}

let service = Object.freeze(new TrainerService())
export function useTrainers() {
    return useQuery<TrainerClassifications, Error>('trainers', service.fetchTrainers)
}

export function addPokemon(trainer: Trainer, pokemon: Pokemon) {
    const client = useQueryClient()

    return useMutation({
        mutationFn: () => service.addPokemonToTrainer(trainer, pokemon),
        onSuccess: () => {
            client.invalidateQueries({ queryKey: ['trainers' ]})
        }
    })
}

export function getTrainerInfo(trainerId: number) {
    const trainers = useTrainers()
    const pokemon = usePokemon()

    const trainer: Trainer = Array.prototype.concat(
        trainers.data?.common || [],
        trainers.data?.eliteFour || [],
        trainers.data?.gymLeaders || []
    ).find((t) => t.id == trainerId)

    return useQuery<TrainerInfoModel, Error>({
        queryKey: ['trainer-pokemon', trainerId],
        queryFn: async () => {
            return {
                trainer,
                pokemon: trainer.pokemon.flatMap((rosterPokemon) => {
                    const p = pokemon.data
                        ?.find((pokemon) => pokemon.number == rosterPokemon.number)

                    if (p) {
                        return {pokemon: p, level: rosterPokemon.level}
                    }

                    return []
                })
            }
        },
        enabled: !!trainer
    })
}
