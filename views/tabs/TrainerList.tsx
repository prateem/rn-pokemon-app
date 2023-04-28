import React from 'react'
import {ScrollView, Text, View} from 'react-native'
import Loader from '../components/core/Loader'
import {useNavigation} from "@react-navigation/native";
import {StackNavigationProp} from "@react-navigation/stack";
import {AppRoute} from "../../flows/authenticated/AuthenticatedFlow";
import TrainerCard from "../components/pokemon/TrainerCard";
import Trainer from "../../models/Trainer";
import {useTrainers} from "../../services/TrainerService";
import tw from "twrnc";
import Container from "../components/Container";

export default function Trainers() {
    const trainers = useTrainers()
    const navigation = useNavigation<StackNavigationProp<AppRoute>>()

    function getTrainerCard(trainer: Trainer): JSX.Element {
        return (
            <TrainerCard
                key={trainer.id}
                trainer={trainer}
                onPress={() => navigation.push('trainer', { id: trainer.id })} />
        )
    }

    if (trainers.isLoading || trainers.isIdle) {
        return (<Loader />)
    } else if (trainers.isError) {
        return (<Text>{`Error: ${trainers.error}`}</Text>)
    } else {
        return (
            <View style={tw`flex-1 bg-white`}>
                <ScrollView>
                    <Container>
                        <View style={tw`m-8`}>
                            <Text style={tw`text-xl font-bold`}>Gym Leaders</Text>

                            <View style={tw`flex-row flex-wrap`}>
                                {trainers.data?.gymLeaders.map(trainer => getTrainerCard(trainer) )}
                            </View>
                        </View>

                        <View style={tw`m-8`}>
                            <Text style={tw`text-xl font-bold`}>Elite Four</Text>

                            <View style={tw`flex-row flex-wrap`}>
                                {trainers.data?.eliteFour.map(trainer => getTrainerCard(trainer) )}
                            </View>
                        </View>

                        <View style={tw`m-8`}>
                            <Text style={tw`text-xl font-bold`}>Trainers</Text>

                            <View style={tw`flex-row flex-wrap`}>
                                {trainers.data?.common.map(trainer => getTrainerCard(trainer) )}
                            </View>
                        </View>
                    </Container>
                </ScrollView>
            </View>
        )
    }
}
