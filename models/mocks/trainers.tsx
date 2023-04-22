import Trainer from "../Trainer"

let common: Array<Trainer> = [
    { id: 1, name: "Youngster Joey", specialty: null, pokemon: [19] },

    { id: 1001, name: "Bird Keeper Abe", specialty: null, pokemon: [21] },
    { id: 1002, name: "Bird Keeper Rod", specialty: null, pokemon: [16, 16] },
    { id: 2001, name: "Bug Catcher Al", specialty: null, pokemon: [10, 13] },
    { id: 2002, name: "Bug Catcher Benny", specialty: null, pokemon: [13, 14, 15] },
    { id: 2003, name: "Bug Catcher Josh", specialty: null, pokemon: [46] },
    { id: 2004, name: "Twins Amy & Mimi", specialty: null, pokemon: [165, 167] },
    { id: 3001, name: "Beauty Victoria", specialty: null, pokemon: [161, 161, 161] },
    { id: 3002, name: "Beauty Samantha", specialty: null, pokemon: [52, 52] },
    { id: 3003, name: "Lass Carrie", specialty: null, pokemon: [209] },
    { id: 3004, name: "Lass Cathy", specialty: null, pokemon: [39, 39, 39] },
    { id: 4001, name: "Medium Georgina", specialty: null, pokemon: [92, 92, 92, 92, 92] },
    { id: 4002, name: "Medium Grace", specialty: null, pokemon: [93, 93] },
    { id: 4003, name: "Medium Edith", specialty: null, pokemon: [93] },
    { id: 4004, name: "Medium Martha", specialty: null, pokemon: [92, 93, 92] },
    { id: 5001, name: "Black Belt Yoshi", specialty: null, pokemon: [106] },
    { id: 5002, name: "Black Belt Lao", specialty: null, pokemon: [107] },
    { id: 5003, name: "Black Belt Nob", specialty: null, pokemon: [66, 67] },
    { id: 5004, name: "Black Belt Lung", specialty: null, pokemon: [56, 56, 57] },

    { id: 7001, name: "Skier Diana", specialty: null, pokemon: [124] },
    { id: 7002, name: "Boarder Patton", specialty: null, pokemon: [220, 220] },
    { id: 7003, name: "Boarder Deandre", specialty: null, pokemon: [86, 87, 86] },
    { id: 7004, name: "Skier Jill", specialty: null, pokemon: [87] },
    { id: 7005, name: "Boarder Gerardo", specialty: null, pokemon: [90, 91, 86] },
    { id: 8001, name: "Ace Trainer Paulo", specialty: null, pokemon: [147, 147, 117] },
    { id: 8002, name: "Ace Trainer Lola", specialty: null, pokemon: [147, 148] },
    { id: 8003, name: "Ace Trainer Cody", specialty: null, pokemon: [116, 117] },
    { id: 8004, name: "Ace Trainer Fran", specialty: null, pokemon: [117] },
    { id: 8005, name: "Ace Trainer Mike", specialty: null, pokemon: [148] },

    { id: 9001, name: "Camper Jerry", specialty: null, pokemon: [112] },
    { id: 9002, name: "Hiker Edwin", specialty: null, pokemon: [76] },
    { id: 10001, name: "Sailor Parker", specialty: null, pokemon: [116, 117] },
    { id: 10002, name: "Sailor Eddie", specialty: null, pokemon: [184] },
    { id: 10003, name: "Swimmer Diana", specialty: null, pokemon: [55] },
    { id: 10004, name: "Swimmer Joy", specialty: null, pokemon: [91] },
    { id: 10005, name: "Swimmer Briana", specialty: null, pokemon: [119, 119] },
    { id: 11001, name: "Juggler Horton", specialty: null, pokemon: [101, 101, 101] },
    { id: 11002, name: "Guitarist Vincent", specialty: null, pokemon: [135, 100, 81] },
    { id: 11003, name: "Gentleman Gregory", specialty: null, pokemon: [25, 180] },
    { id: 12001, name: "Twins Jo & Zoe", specialty: null, pokemon: [71, 45] },
    { id: 12002, name: "Picnicker Tanya", specialty: null, pokemon: [103] },
    { id: 12003, name: "Lass Michelle", specialty: null, pokemon: [188, 187, 189] },
    { id: 12004, name: "Beauty Julia", specialty: null, pokemon: [46, 102, 47] },
    { id: 13001, name: "Lass Linda", specialty: null, pokemon: [1, 2, 3] },
    { id: 13002, name: "Picnicker Cindy", specialty: null, pokemon: [31] },
    { id: 13003, name: "Camper Barry", specialty: null, pokemon: [34] },
    { id: 13004, name: "Lass Alice", specialty: null, pokemon: [44, 24, 45] },
    { id: 14001, name: "Medium Rebecca", specialty: null, pokemon: [96, 97] },
    { id: 14002, name: "Psychic Jared", specialty: null, pokemon: [122, 102, 102] },
    { id: 14003, name: "Medium Darcy", specialty: null, pokemon: [79, 80] },
    { id: 14004, name: "Psychic Franklin", specialty: null, pokemon: [64, 203] },
    { id: 15001, name: "Scientist Lowell", specialty: null, pokemon: [59] },
    { id: 15002, name: "Scientist Daniel", specialty: null, pokemon: [38] },
    { id: 15004, name: "Scientist Linden", specialty: null, pokemon: [126] },
    { id: 15005, name: "Super Nerd Merle", specialty: null, pokemon: [219] },
    { id: 16001, name: "Ace Trainer Arabella", specialty: null, pokemon: [234, 128] },
    { id: 16002, name: "Ace Trainer Salma", specialty: null, pokemon: [199, 108] },
    { id: 16003, name: "Ace Trainer Bonita", specialty: null, pokemon: [185] },
    { id: 16004, name: "Double Team Elan & Ida", specialty: null, pokemon: [233, 184] },
]

let gymLeaders: Array<Trainer> = [
    {id: 100001, name: "Falkner", specialty: "flying", pokemon: [16, 17]},
    {id: 100002, name: "Bugsy", specialty: "bug", pokemon: [11, 14, 123]},
    {id: 100003, name: "Whitney", specialty: "normal", pokemon: [35, 241]},
    {id: 100004, name: "Morty", specialty: "ghost", pokemon: [92, 93, 93, 94]},
    {id: 100005, name: "Chuck", specialty: "fighting", pokemon: [57, 62]},
    {id: 100006, name: "Jasmine", specialty: "steel", pokemon: [81, 81, 208]},
    {id: 100007, name: "Pryce", specialty: "ice", pokemon: [86, 86, 221]},
    {id: 100008, name: "Clair", specialty: "dragon", pokemon: [148, 148, 148, 230]},
    {id: 100009, name: "Brock", specialty: "rock", pokemon: [57, 111, 139, 141, 95]},
    {id: 100010, name: "Misty", specialty: "water", pokemon: [55, 195, 131, 121]},
    {id: 100011, name: "Lt. Surge", specialty: "electric", pokemon: [26, 101, 101, 82, 125]},
    {id: 100012, name: "Erika", specialty: "grass", pokemon: [114, 71, 189, 182]},
    {id: 100013, name: "Janine", specialty: "poison", pokemon: [169, 110, 110, 168, 49]},
    {id: 100014, name: "Sabrina", specialty: "psychic", pokemon: [196, 122, 65]},
    {id: 100015, name: "Blaine", specialty: "fire", pokemon: [219, 126, 78]},
    {id: 100016, name: "Blue", specialty: "mixed", pokemon: [18, 65, 112, 130, 103, 59]},
]

let eliteFour: Array<Trainer> = [
    {id: 400001, name: "Will", specialty: "psychic", pokemon: [178, 124, 80, 103, 178]},
    {id: 400002, name: "Koga", specialty: "poison", pokemon: [168, 49, 205, 89, 169]},
    {id: 400003, name: "Bruno", specialty: "fighting", pokemon: [237, 106, 107, 95, 68]},
    {id: 400004, name: "Karen", specialty: "dark", pokemon: [197, 45, 198, 94, 229]},
    {id: 400005, name: "Lance", specialty: "dragon", pokemon: [130, 149, 6, 142, 149, 149]}
]

export default { common, gymLeaders, eliteFour }
