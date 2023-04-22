import {DataLoadingState} from "./DataLoadingState"
import Trainer from "../models/Trainer"
import dataInstance, {DataStore} from "../core/DataStore";
import {Observable} from "rxjs";
import gymMocks from "../models/mocks/gyms"
import Gym from "../models/Gym";
import trainerService from "./TrainerService";

export type RegionalGyms = {
    johto: Array<Gym>
    kanto: Array<Gym>
}

export interface GymListDataState {
    state: DataLoadingState
    gyms?: RegionalGyms
}

export interface GymInfoDataState {
    state: DataLoadingState
    gym?: Gym
    leader?: Trainer
    members?: Array<Trainer>
}

class GymService {
    dataStore: DataStore = dataInstance.insecure

    gymDataKey: string = "Nascent-Gym-Data"

    // OBSERVABLES
    gyms = new Observable<GymListDataState>((subscriber) => {
        subscriber.next({ state: DataLoadingState.Loading })

        this.__fetchGyms()
            .then((gyms) => subscriber.next({ state: DataLoadingState.Loaded, gyms }))
            .catch((_) => subscriber.next({ state: DataLoadingState.Error }))
            .finally(() => subscriber.complete() )
    })

    getGymInfo(gymNumber: number): Observable<GymInfoDataState> {
        return new Observable((subscriber) => {
            subscriber.next({ state: DataLoadingState.Loading })

            this.gyms.subscribe({
                next(data) {
                    if (data.state == DataLoadingState.Error) {
                        subscriber.next({ state: DataLoadingState.Error })
                    } else if (data.state == DataLoadingState.Loaded) {
                        const all: Array<Gym> = Array.prototype.concat(
                            data.gyms?.johto || [],
                            data.gyms?.kanto || []
                        )

                        const g = all.find((gym) => gym.number == gymNumber)
                        if (g) {
                            trainerService.trainers.subscribe({
                                next(trainerData) {
                                    if (trainerData.state == DataLoadingState.Error) {
                                        subscriber.next({ state: DataLoadingState.Loaded, gym: g })
                                    } else if (trainerData.state == DataLoadingState.Loaded) {
                                        const leader = trainerData.trainers?.gymLeaders
                                            ?.find((m) => m.id == g.leader)

                                        if (!leader) {
                                            subscriber.next({ state: DataLoadingState.Error })
                                        } else {
                                            const members = g.members.flatMap((number) => {
                                                const match = trainerData.trainers?.common
                                                    ?.find((m) => m.id == number)
                                                if (!match) { return [] }
                                                return match
                                            })

                                            subscriber.next({ state: DataLoadingState.Loaded, gym: g, leader, members })
                                        }
                                    }
                                },
                                error(err) {
                                    subscriber.next({ state: DataLoadingState.Loaded, gym: g })
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
    async __fetchGyms(): Promise<RegionalGyms> {
        return gymMocks
    }
}

let service = Object.freeze(new GymService())
export default service
