import React, {useRef, useState} from "react";
import {
    Alert,
    Image,
    InteractionManager,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    View
} from "react-native";
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
import BottomSheet from "@gorhom/bottom-sheet";
import MenuBackdrop from "../components/core/MenuBackdrop";
import AppMenu from "../components/core/AppMenu";
import Pokedex from "../tabs/Pokedex";
import {Pokemon} from "../../models/pokemon";
import AppButton from "../components/AppButton";
import {useHeaderHeight} from "@react-navigation/elements";
import {useTrainers} from "../../services/TrainerService";

const exclusions: string[] = Array.prototype
    .concat(trainers.gymLeaders, trainers.eliteFour)
    .map(t => t.asset.toString())

const availableClassifications = Object.keys(TRAINER_IMAGES)
    .filter(key => !exclusions.includes(key))

export default function AddTrainer() {
    const headerHeight = useHeaderHeight()

    const pokemon = usePokemon()
    const trainers = useTrainers()

    // Trainer details
    const [classification, setClassification] = useState<string>(availableClassifications[0])
    const [trainerId, setTrainerId] = useState(0)
    const [trainerName, setTrainerName] = useState("")

    // Adding a roster pokemon
    const sheet = useRef<BottomSheet | null>(null)
    const [selectingPokemon, setSelectingPokemon] = useState(false)
    const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null)
    const [pokemonLevel, setPokemonLevel] = useState(1)
    const [roster, setRoster] = useState<RosterPokemon[]>([])

    if (pokemon.isLoading || pokemon.isIdle) {
        return <Loader />
    }

    return (
        <KeyboardAvoidingView
            keyboardVerticalOffset={headerHeight}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={tw`flex-1 bg-white`}>
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
                            style={tw`flex-1 self-center my-2 p-2 web:h-10 android:h-10 rounded bg-white border border-gray-200`}
                            selectedValue={classification}
                            onValueChange={(value, index) => setClassification(value)}>
                            {availableClassifications.map((c, index) => (
                                <Picker.Item key={index} label={c.toTitleCase()} value={c} style={tw`text-sm`} />
                            ))}
                        </Picker>
                    </View>

                    <AppInputField
                        style={tw`my-2`}
                        label={"Trainer ID"}
                        inputProps={{
                            inputMode: 'numeric',
                            keyboardType: 'numeric',
                            onChangeText: (v) => setTrainerId(parseInt(v))
                        }}
                    />

                    <AppInputField
                        style={tw`my-2`}
                        label={"Name"}
                        inputProps={{
                            onChangeText: (v) => setTrainerName(v)
                        }} />

                    <View style={tw`my-2`}>
                        <Text style={tw`text-base font-bold`}>Roster</Text>

                        { pokemon.isSuccess
                            ? (
                                <>
                                    <View style={tw`flex-row my-2`}>
                                        { selectedPokemon
                                            ? (
                                                <View>
                                                    <PokemonCard pokemon={selectedPokemon} useCompactLayout={true} onPress={() => setSelectingPokemon(true)} />

                                                    <AppInputField
                                                        label={"Level"}
                                                        inputProps={{
                                                            keyboardType: 'numeric',
                                                            inputMode: 'numeric',
                                                            onChangeText: (v) =>
                                                                setPokemonLevel(Math.min(Math.max(parseInt(v), 1), 100))
                                                        }} />

                                                    <AppButton style={tw`my-2`} text={"Add to roster"} onPress={() => {
                                                        setRoster([
                                                            ...roster,
                                                            {number: selectedPokemon!.number, level: pokemonLevel}
                                                        ])
                                                        InteractionManager.runAfterInteractions(() => {
                                                            setSelectedPokemon(null)
                                                            setPokemonLevel(1)
                                                        })
                                                    }} />
                                                </View>
                                            )
                                            : (
                                                <Pressable style={tw`w-full`} onPress={() => setSelectingPokemon(true)}>
                                                    {(state) => (
                                                        <Text style={tw.style(
                                                            `text-base italic p-4 rounded-2`,
                                                            // @ts-ignore
                                                            state.hovered && `bg-gray-300`,
                                                            state.pressed && `opacity-50`
                                                        )}>+ Select a Pokémon...</Text>
                                                    )}
                                                </Pressable>
                                            )
                                        }
                                    </View>

                                    <ScrollView style={tw`w-full min-h-20 max-h-80 my-2 border rounded border-gray-300 bg-gray-100`}>
                                        <View style={tw`flex-row flex-wrap`}>
                                            { roster.flatMap((r, index) => {
                                                const p = pokemon.data?.find(it => it.number == r.number)
                                                if (p) {
                                                    return <PokemonCard
                                                        key={index}
                                                        pokemon={p}
                                                        subtext={`Lv. ${r.level}`}
                                                        useCompactLayout={true}
                                                        onPress={() => {
                                                            Alert.alert(
                                                                `Remove from roster?`,
                                                                `Do you want to remove ${p.name} (Lv. ${r.level}) from this trainer's roster?`,
                                                                [
                                                                    {
                                                                        text: 'No',
                                                                        onPress: () => {
                                                                            // No-op
                                                                        },
                                                                        style: 'cancel',
                                                                    },
                                                                    {
                                                                        text: 'Remove',
                                                                        onPress: () => {
                                                                            setRoster([
                                                                                ...Array.prototype.concat(
                                                                                    roster.slice(0, Math.max(index - 1, 0)),
                                                                                    roster.slice(index+1, roster.length)
                                                                                )
                                                                            ])
                                                                        }
                                                                    },
                                                                ]
                                                            )
                                                        }}
                                                        style={tw`self-center`}/>
                                                }

                                                return []
                                            })}
                                        </View>
                                    </ScrollView>
                                </>
                            )
                            : (
                                <Text style={tw`text-base text-red-500`}>Can not configure roster at the moment.</Text>
                            )
                        }
                    </View>
                </Container>
            </ScrollView>

            {selectingPokemon && (
                <BottomSheet
                    ref={sheet}
                    index={0}
                    style={tw`bg-white rounded-3xl shadow-black shadow-opacity-15 shadow-radius-1 shadow-offset-[0]/[-2]`}
                    enablePanDownToClose={false}
                    backdropComponent={MenuBackdrop}
                    snapPoints={['95%']}
                    onChange={(index) => {
                        if (index == -1) {
                            // dragged down to close
                            setSelectingPokemon(false)
                        }
                    }}>
                    <KeyboardAvoidingView
                        style={tw`flex-1`}
                        keyboardVerticalOffset={headerHeight + 32} // corresponds to the value of mb-8 for the Pokédex
                        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
                        <Pokedex
                            isNested={true}
                            style={tw`mb-8`}
                            onSelectPokemon={(pokemon) => {
                                sheet.current?.close()
                                setSelectingPokemon(false)
                                setSelectedPokemon(pokemon)
                            }} />
                    </KeyboardAvoidingView>
                </BottomSheet>
            )}
        </KeyboardAvoidingView>
    )
}