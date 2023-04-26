import { StyleSheet } from 'react-native'

const labels = StyleSheet.create({
    normal: {
        fontSize: 16,
        marginVertical: 4
    },
    large: {
        fontSize: 20,
        marginVertical: 4
    },
    small: {
        fontSize: 12,
        marginVertical: 2
    },
    heading: {
        fontSize: 48,
        fontWeight: "bold"
    },
    error: {
        fontSize: 14,
        marginVertical: 4,
        color: '#e12339'
    }
})

const alignment = StyleSheet.create({
    centered: {
        alignItems: 'center',
        justifyContent: 'center',
    }
})

const components = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: '#fff'
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16
    },
    navigationBar: {
        backgroundColor: "red",
        borderBottomWidth: 1,
        borderBottomColor: "red"
    },
    card: {
        padding: 12,
        borderWidth: 1,
        borderRadius: 12,
        borderColor: "grey",
        // shadowRadius: 1,
        // shadowOffset: { width: 0, height: 1 },
        // shadowOpacity: 0.2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    cardCompact: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: "grey",
        // shadowRadius: 1,
        // shadowOffset: { width: 0, height: 1 },
        // shadowOpacity: 0.2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        fontSize: 16,
        backgroundColor: '#2b8000',
        color: 'white',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 48,
        minWidth: 120,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    textInput: {
        height: 40,
        marginVertical: 6,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'grey',
        padding: 8,
        alignSelf: 'center'
    },
    badge: {
        alignSelf: "center",
        minWidth: 80,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: 4,
        margin: 4,
        borderColor: '#00000000',
        borderWidth: 0.5,
        borderRadius: 12,
    }
})

const pokemonTypeToColorMap = {
    normal: "#" + "A8A77A",
    fire: "#" + "EE8130",
    water: "#" + "6390F0",
    electric: "#" + "F7D02C",
    grass: "#" + "7AC74C",
    ice: "#" + "96D9D6",
    fighting: "#" + "C22E28",
    poison: "#" + "A33EA1",
    ground: "#" + "E2BF65",
    flying: "#" + "A98FF3",
    psychic: "#" + "F95587",
    bug: "#" + "A6B91A",
    rock: "#" + "B6A136",
    ghost: "#" + "735797",
    dragon: "#" + "6F35FC",
    dark: "#" + "705746",
    steel: "#" + "B7B7CE",
    fairy: "#" + "D685AD",

    // trainer-specific
    none: "#" + "ffffff",
    mixed: "#" + "000000"
}

export default {
    labels,
    components,
    alignment,
    getColorForType(type: string): string | undefined {
        let foundColor = Object.entries(pokemonTypeToColorMap)
            .find(([key, _]) => key == type)
            ?.[1]

        if (foundColor) {
            return foundColor
        }

        return undefined
    }
}