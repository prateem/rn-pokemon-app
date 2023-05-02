import Gym from "../Gym"

const johtoGyms: Array<Gym> = [
    {number: 1, region: "Johto", location: "Violet City", badge: "Zephyr", leader: 100001, members: [1001, 1002]},
    {number: 2, region: "Johto", location: "Azalea Town", badge: "Hive",  leader: 100002, members: [2001, 2002, 2003, 2004]},
    {number: 3, region: "Johto", location: "Goldenrod City", badge: "Plain",  leader: 100003, members: [3001, 3002, 3003, 3004]},
    {number: 4, region: "Johto", location: "Ecruteak City", badge: "Fog",  leader: 100004, members: [4001, 4002, 4003, 4004]},
    {number: 5, region: "Johto", location: "Cianwood City", badge: "Storm",  leader: 100005, members: [5001, 5002, 5003, 5004]},
    {number: 6, region: "Johto", location: "Olivine City", badge: "Mineral",  leader: 100006, members: []},
    {number: 7, region: "Johto", location: "Mahogany Town", badge: "Glacier",  leader: 100007, members: [7001, 7002, 7003, 7004, 7005]},
    {number: 8, region: "Johto", location: "Blackthorn City", badge: "Rising",  leader: 100008, members: [8001, 8002, 8003, 8004, 8005]},
]
const kantoGyms: Array<Gym> = [
    {number: 9, region: "Kanto", location: "Pewter City", badge: "Boulder",  leader: 100009, members: [9001, 9002]},
    {number: 10, region: "Kanto", location: "Cerulean City", badge: "Cascade",  leader: 100010, members: [10001, 10002, 10003, 10004, 10005]},
    {number: 11, region: "Kanto", location: "Vermilion City", badge: "Thunder",  leader: 100011, members: [11001, 11002, 11003]},
    {number: 12, region: "Kanto", location: "Celadon City", badge: "Rainbow",  leader: 100012, members: [12001, 12002, 12003, 12004]},
    {number: 13, region: "Kanto", location: "Fuchsia City", badge: "Soul",  leader: 100013, members: [13001, 13002, 13003, 13004]},
    {number: 14, region: "Kanto", location: "Saffron City", badge: "Marsh",  leader: 100014, members: [14001, 14002, 14003, 14004]},
    {number: 15, region: "Kanto", location: "Cinnabar Island", badge: "Volcano",  leader: 100015, members: [15001, 15002, 15003, 15004, 15005]},
    {number: 16, region: "Kanto", location: "Viridian City", badge: "Earth",  leader: 100016, members: [16001, 16002, 16003, 16004]},
]

export default { kanto: kantoGyms, johto: johtoGyms }
