import {DataLoadingState} from "./DataLoadingState"
import Trainer from "../models/Trainer"
import dataInstance, {DataStore} from "../core/DataStore";
import {Observable} from "rxjs";
import trainerMocks from "../models/mocks/trainers"
import Pokemon from "../models/Pokemon";
import pokemonService from "./PokemonService";

export type TrainerClassifications = {
    common: Array<Trainer>
    gymLeaders: Array<Trainer>
    eliteFour: Array<Trainer>
}

export interface TrainerListDataState {
    state: DataLoadingState
    trainers?: TrainerClassifications
}

export interface TrainerInfoDataState {
    state: DataLoadingState,
    trainer?: Trainer,
    pokemon?: Array<Pokemon>
}

class TrainerService {
    dataStore: DataStore = dataInstance.insecure

    trainerDataKey: string = "Nascent-Trainer-Data"

    // OBSERVABLES
    trainers = new Observable<TrainerListDataState>((subscriber) => {
        subscriber.next({ state: DataLoadingState.Loading })

        this.__fetchTrainers()
            .then((trainers) => subscriber.next({ state: DataLoadingState.Loaded, trainers }))
            .catch((_) => subscriber.next({ state: DataLoadingState.Error }))
            .finally(() => subscriber.complete() )
    })

    getTrainerInfo(trainerId: number): Observable<TrainerInfoDataState> {
        return new Observable((subscriber) => {
            subscriber.next({ state: DataLoadingState.Loading })

            this.trainers.subscribe({
                next(data) {
                    if (data.state == DataLoadingState.Error) {
                        subscriber.next({ state: DataLoadingState.Error })
                    } else if (data.state == DataLoadingState.Loaded) {
                        const all: Array<Trainer> = Array.prototype.concat(
                            data.trainers?.common || [],
                            data.trainers?.gymLeaders || [],
                            data.trainers?.eliteFour || []
                        )

                        const t = all.find((trainer) => trainer.id == trainerId)
                        if (t) {
                            pokemonService.pokemon.subscribe({
                                next(pokemonData) {
                                    if (pokemonData.state == DataLoadingState.Error) {
                                        subscriber.next({ state: DataLoadingState.Loaded, trainer: t, pokemon: [] })
                                    } else if (pokemonData.state == DataLoadingState.Loaded) {
                                        const pokemon = t.pokemon.flatMap((number) => {
                                            const match = pokemonData.pokemon
                                                ?.find((p) => p.number == number)
                                            if (!match) { return [] }
                                            return match
                                        })

                                        subscriber.next({ state: DataLoadingState.Loaded, trainer: t, pokemon })
                                    }
                                },
                                error(err) {
                                    subscriber.next({ state: DataLoadingState.Loaded, trainer: t })
                                },
                                complete() {
                                    subscriber.complete()
                                }
                            })
                        }
                    }
                },
                error(err) {
                    subscriber.next({ state: DataLoadingState.Error })
                },
                complete() {}
            })
        })
    }

    // DATA
    async __fetchTrainers(): Promise<TrainerClassifications> {
        return trainerMocks
    }
}

let service = Object.freeze(new TrainerService())
export default service
