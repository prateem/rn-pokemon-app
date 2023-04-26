import {DataLoadingState} from "./DataLoadingState"
import Trainer from "../models/Trainer"
import dataInstance, {DataStore} from "../core/DataStore";
import trainerMocks from "../models/mocks/trainers"
import {Pokemon} from "../models/Pokemon";
import {usePokemon} from "./PokemonService";
import {useQuery} from "react-query";

export type TrainerClassifications = {
    common: Array<Trainer>
    gymLeaders: Array<Trainer>
    eliteFour: Array<Trainer>
}

export type TrainerInfoModel = {
    trainer: Trainer,
    pokemon: Array<Pokemon>
}

const dataStore: DataStore = dataInstance.insecure
const trainerDataKey: string = "Nascent-Trainer-Data"

class TrainerService {

    // DATA
    async fetchTrainers(): Promise<TrainerClassifications> {
        return trainerMocks
    }

}

let service = Object.freeze(new TrainerService())
export function useTrainers() {
    return useQuery<TrainerClassifications, Error>('trainers', service.fetchTrainers)
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
                pokemon: trainer.pokemon.flatMap((pokemonNumber) => {
                    return pokemon.data
                            ?.find((pokemon) => pokemon.number == pokemonNumber)
                        || []
                })
            }
        },
        enabled: !!trainer
    })
}
