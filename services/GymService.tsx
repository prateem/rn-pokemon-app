import Trainer from "../models/Trainer"
import dataInstance, {DataStore} from "../core/DataStore";
import gymMocks from "../models/mocks/gyms"
import Gym from "../models/Gym";
import {useTrainers} from "./TrainerService";
import {useQuery} from "react-query";

export type RegionalGyms = {
    johto: Array<Gym>
    kanto: Array<Gym>
}

export type GymInfoModel = {
    gym: Gym
    leader: Trainer
    members: Array<Trainer>
}

const dataStore: DataStore = dataInstance.inMemory
const gymDataKey: string = "Nascent-Gym-Data"

class GymService {
    // DATA
    async fetchGyms(): Promise<RegionalGyms> {
        const cached = await dataStore.read<RegionalGyms>(gymDataKey)
        if (cached) {
            return cached
        }

        const data = gymMocks
        await dataStore.write(gymDataKey, data)
        return data
    }
}

let service = Object.freeze(new GymService())
export function useGyms() {
    return useQuery<RegionalGyms, Error>('gyms', service.fetchGyms)
}

export function getGymInfo(gymNumber: number) {
    const gyms = useGyms()
    const trainers = useTrainers()

    const gym: Gym = Array.prototype.concat(
        gyms.data?.kanto || [],
        gyms.data?.johto || [],
    ).find((g) => g.number == gymNumber)

    const leader = trainers.data
        ?.gymLeaders
        .find((l) => l.id == gym.leader)

    return useQuery<GymInfoModel, Error>({
        queryKey: ['gym', gymNumber],
        queryFn: async () => {
            const members: Trainer[] = gym.members.flatMap((memberId) => {
                return trainers.data
                    ?.common
                    .find((t) => t.id == memberId)
                    || []
            })
            return {
                gym,
                leader: leader!,
                members
            }
        },
        enabled: !!leader
    })
}
