import React from 'react'
import {ScrollView, Text, View} from 'react-native'
import Loader from '../../components/core/Loader'
import styles from "../../styles";
import {useNavigation} from "@react-navigation/native";
import {StackNavigationProp} from "@react-navigation/stack";
import {AppRoute} from "../../../flows/core/AuthenticatedFlow";
import TrainerCard from "../../components/TrainerCard";
import Trainer from "../../../models/Trainer";
import {useTrainers} from "../../../services/TrainerService";

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
            <View style={styles.components.page}>
                <ScrollView>
                    <View style={[styles.components.container]}>
                        <View style={{margin: 24}}>
                            <Text style={styles.labels.large}>Gym Leaders</Text>

                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                {trainers.data?.gymLeaders.map(trainer => getTrainerCard(trainer) )}
                            </View>
                        </View>

                        <View style={{margin: 24}}>
                            <Text style={styles.labels.large}>Elite Four</Text>

                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                {trainers.data?.eliteFour.map(trainer => getTrainerCard(trainer) )}
                            </View>
                        </View>

                        <View style={{margin: 24}}>
                            <Text style={styles.labels.large}>Trainers</Text>

                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                {trainers.data?.common.map(trainer => getTrainerCard(trainer) )}
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        )
    }
}
