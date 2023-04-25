import React from 'react'
import {ScrollView, Text, View} from 'react-native'
import Loader from '../../components/core/Loader'
import {bind} from "@react-rxjs/core";
import trainerService from "../../../services/TrainerService";
import {DataLoadingState} from "../../../services/DataLoadingState";
import styles from "../../styles";
import {useNavigation} from "@react-navigation/native";
import {StackNavigationProp} from "@react-navigation/stack";
import {AppRoute} from "../../../flows/core/AuthenticatedFlow";
import TrainerCard from "../../components/TrainerCard";
import Trainer from "../../../models/Trainer";

const [getTrainers, _] = bind(
    trainerService.trainers,
    { state: DataLoadingState.Loading }
)

export default function Trainers() {
    const data = getTrainers()
    const navigation = useNavigation<StackNavigationProp<AppRoute>>()

    function getTrainerCard(trainer: Trainer): JSX.Element {
        return (
            <TrainerCard
                key={trainer.id}
                trainer={trainer}
                onPress={() => navigation.push('trainer', { id: trainer.id })} />
        )
    }

    if (data.state == DataLoadingState.Loading) {
        return (<Loader />)
    } else if (data.state == DataLoadingState.Error) {
        return (<Text>Error loading trainers</Text>)
    } else {
        return (
            <View style={styles.components.page}>
                <ScrollView>
                    <View style={[styles.components.container]}>
                        <View style={{margin: 24}}>
                            <Text style={styles.labels.large}>Gym Leaders</Text>

                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                {data.trainers?.gymLeaders.map(trainer => getTrainerCard(trainer) )}
                            </View>
                        </View>

                        <View style={{margin: 24}}>
                            <Text style={styles.labels.large}>Elite Four</Text>

                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                {data.trainers?.eliteFour.map(trainer => getTrainerCard(trainer) )}
                            </View>
                        </View>

                        <View style={{margin: 24}}>
                            <Text style={styles.labels.large}>Trainers</Text>

                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                {data.trainers?.common.map(trainer => getTrainerCard(trainer) )}
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        )
    }
}
