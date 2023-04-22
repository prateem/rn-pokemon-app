import Trainer from "./Trainer"

export default interface Gym {
    number: number
    region: string
    location: string
    badge: string
    leader: number
    members: Array<number>
}
