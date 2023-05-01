import React, {useState} from "react";
import {Image, ScrollView, Text, View} from "react-native";
import tw from "twrnc";
import Container from "../components/Container";
import AppInputField from "../components/AppInputField";
import {Picker} from '@react-native-picker/picker';
import {TRAINER_IMAGES} from "../../models/mocks/trainers";
import trainers from "../../models/mocks/trainers";
import {RosterPokemon} from "../../models/Trainer";
import PokemonCard from "../components/pokemon/PokemonCard";
import {usePokemon} from "../../services/PokemonService";
import Loader from "../components/core/Loader";

const exclusions: string[] = Array.prototype
    .concat(trainers.gymLeaders, trainers.eliteFour)
    .map(t => t.asset.toString())

const availableClassifications = Object.keys(TRAINER_IMAGES)
    .filter(key => !exclusions.includes(key))

export default function AddTrainer() {

    const pokemon = usePokemon()

    const [trainerId, setTrainerId] = useState(0)
    const [trainerName, setTrainerName] = useState("")
    const [roster, setRoster] = useState<RosterPokemon[]>([])
    const [classification, setClassification] = useState<string>(availableClassifications[0])

    if (pokemon.isLoading || pokemon.isIdle) {
        return <Loader />
    }

    return (
        <ScrollView style={tw`flex-1`}>
            <Container>
                <Text style={tw`text-base font-bold`}>Classification</Text>

                <View style={tw`flex-row my-2`}>
                    <Image
                        resizeMode='contain'
                        style={tw`w-10 h-10 mx-2 self-center rounded-3xl border border-gray-500 bg-white`}
                        // @ts-ignore
                        source={classification ? TRAINER_IMAGES[classification].uri : {}} />

                    <Picker
                        style={tw`flex-1 self-center my-2 p-2 h-10 rounded bg-white border border-gray-200`}
                        selectedValue={classification}
                        onValueChange={(value, index) => setClassification(value)}>
                        {availableClassifications.map((c, index) => (
                            <Picker.Item key={index} label={c.toTitleCase()} value={c}></Picker.Item>
                        ))}
                    </Picker>
                </View>

                <AppInputField
                    label={"Trainer ID"}
                    inputProps={{
                        inputMode: 'numeric',
                        keyboardType: 'numeric',
                        onChangeText: (v) => setTrainerId(parseInt(v))
                    }}
                />

                <AppInputField
                    label={"Name"}
                    inputProps={{
                        onChangeText: (v) => setTrainerName(v)
                    }} />

                <Text style={tw`text-base font-bold`}>Roster</Text>
                { pokemon.isSuccess
                    ? (
                        <>
                            <View style={tw`flex-row my-2`}>
                                <Text>TODO: Selector steps</Text>
                            </View>

                            <ScrollView style={tw`w-full max-h-20 my-2 border rounded border-gray-300`}>
                                { roster.flatMap((r, index) => {
                                    const p = pokemon.data?.find(it => it.number == r.number)
                                    if (p) {
                                        return <PokemonCard key={index} pokemon={p} useCompactLayout={true}/>
                                    }

                                    return []
                                })}
                            </ScrollView>
                        </>
                    )
                    : (
                        <Text style={tw`text-base text-red-500`}>Can not configure roster at the moment.</Text>
                    )
                }

            </Container>
        </ScrollView>
    )
}