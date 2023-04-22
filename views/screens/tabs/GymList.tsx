import React from 'react'
import {Pressable, ScrollView, Text, View} from 'react-native'
import Loader from '../../components/core/Loader'
import {bind} from "@react-rxjs/core";
import {DataLoadingState} from "../../../services/DataLoadingState";
import styles from "../../styles";
import {useNavigation} from "@react-navigation/native";
import {StackNavigationProp} from "@react-navigation/stack";
import {AppRoute} from "../../../core/AppRouter";
import gymService from "../../../services/GymService";
import Gym from "../../../models/Gym";
import GymCard from "../../components/GymCard";

const [getGyms, _] = bind(
    gymService.gyms,
    { state: DataLoadingState.Loading }
)

export default function Gyms() {
    const data = getGyms()
    const navigation = useNavigation<StackNavigationProp<AppRoute>>()

    function getGymCard(gym: Gym): JSX.Element {
        return (
            <GymCard
                key={gym.number}
                gym={gym}
                onPress={() => navigation.push('gym', { number: gym.number })} />
        )
    }

    if (data.state == DataLoadingState.Loading) {
        return (<Loader />)
    } else if (data.state == DataLoadingState.Error) {
        return (<Text>Error loading gyms</Text>)
    } else {
        return (
            <View style={styles.components.page}>
                <ScrollView>
                    <View style={[styles.components.container]}>
                        <View style={{margin: 24}}>
                            <Text style={styles.labels.large}>Johto</Text>

                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                {data.gyms?.johto.map(gym => getGymCard(gym) )}
                            </View>
                        </View>

                        <View style={{margin: 24}}>
                            <Text style={styles.labels.large}>Kanto</Text>

                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                {data.gyms?.kanto.map(gym => getGymCard(gym) )}
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        )
    }
}
