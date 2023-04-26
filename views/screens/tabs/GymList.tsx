import React from 'react'
import {ScrollView, Text, View} from 'react-native'
import Loader from '../../components/core/Loader'
import styles from "../../styles";
import {useNavigation} from "@react-navigation/native";
import {StackNavigationProp} from "@react-navigation/stack";
import {AppRoute} from "../../../flows/core/AuthenticatedFlow";
import {useGyms} from "../../../services/GymService";
import Gym from "../../../models/Gym";
import GymCard from "../../components/GymCard";

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
            <View style={styles.components.page}>
                <ScrollView>
                    <View style={[styles.components.container]}>
                        <View style={{margin: 24}}>
                            <Text style={styles.labels.large}>Johto</Text>

                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                {gyms.data?.johto.map(gym => getGymCard(gym) )}
                            </View>
                        </View>

                        <View style={{margin: 24}}>
                            <Text style={styles.labels.large}>Kanto</Text>

                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                {gyms.data?.kanto.map(gym => getGymCard(gym) )}
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        )
    }
}
