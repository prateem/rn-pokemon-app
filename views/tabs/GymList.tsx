import React, {useEffect, useState} from 'react'
import {ScrollView, Text, View} from 'react-native'
import Loader from '../components/core/Loader'
import {useNavigation} from "@react-navigation/native";
import {StackNavigationProp} from "@react-navigation/stack";
import {AppRoute} from "../../flows/authenticated/AuthenticatedFlow";
import {RegionalGyms, useGyms} from "../../services/GymService";
import Gym from "../../models/Gym";
import GymCard from "../components/pokemon/GymCard";
import tw from "twrnc";
import Container from "../components/Container";
import SegmentedControl from '@react-native-segmented-control/segmented-control';

export default function Gyms() {
    const gyms = useGyms()
    const navigation = useNavigation<StackNavigationProp<AppRoute>>()
    const [regionIndex, setRegionIndex] = useState(0)

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
        const region = Object.keys(gyms.data)[regionIndex] as keyof RegionalGyms
        const gymList = gyms.data[region] || []

        return (
            <View style={tw`flex-1 bg-white`}>
                <ScrollView>
                    <Container>
                        <SegmentedControl
                            values={Object.keys(gyms.data).map(key => key.toTitleCase())}
                            selectedIndex={regionIndex}
                            onChange={(event) => {
                                setRegionIndex(event.nativeEvent.selectedSegmentIndex)
                            }} />

                        <View style={tw`mx-4 my-3`}>
                            <View style={tw`flex-row flex-wrap`}>
                                {gymList.map(gym => getGymCard(gym) )}
                            </View>
                        </View>
                    </Container>
                </ScrollView>
            </View>
        )
    }
}
