import React from 'react'
import {ScrollView, Text, View} from 'react-native'
import Loader from '../components/core/Loader'
import {useNavigation} from "@react-navigation/native";
import {StackNavigationProp} from "@react-navigation/stack";
import {AppRoute} from "../../flows/authenticated/AuthenticatedFlow";
import {useGyms} from "../../services/GymService";
import Gym from "../../models/Gym";
import GymCard from "../components/pokemon/GymCard";
import tw from "twrnc";
import Container from "../components/Container";

export default function Gyms() {
    const gyms = useGyms()
    const navigation = useNavigation<StackNavigationProp<AppRoute>>()

    function getGymCard(gym: Gym): JSX.Element {
        return (
            <GymCard
                key={gym.number}
                gym={gym}
                onPress={() => navigation.push('gym', { number: gym.number })} />
        )
    }

    if (gyms.isLoading || gyms.isIdle) {
        return (<Loader />)
    } else if (gyms.isError) {
        return (<Text>{`Error: ${gyms.error}`}</Text>)
    } else {
        return (
            <View style={tw`flex-1 bg-white`}>
                <ScrollView>
                    <Container>
                        <View style={tw`m-8`}>
                            <Text style={tw`text-xl font-bold`}>Johto</Text>

                            <View style={tw`flex-row flex-wrap`}>
                                {gyms.data?.johto.map(gym => getGymCard(gym) )}
                            </View>
                        </View>

                        <View style={tw`m-8`}>
                            <Text style={tw`text-xl font-bold`}>Kanto</Text>

                            <View style={tw`flex-row flex-wrap`}>
                                {gyms.data?.kanto.map(gym => getGymCard(gym) )}
                            </View>
                        </View>
                    </Container>
                </ScrollView>
            </View>
        )
    }
}
