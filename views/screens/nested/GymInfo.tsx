import React, {useEffect} from 'react';
import {StackScreenProps} from '@react-navigation/stack';
import {AppRoute} from "../../../flows/core/AuthenticatedFlow";
import Loader from '../../components/core/Loader';
import {View, Text, ScrollView} from "react-native";
import styles from "../../styles";
import {getGymInfo} from "../../../services/GymService";
import TrainerCard from "../../components/TrainerCard";
import Divider from "../../components/core/Divider";

export default function GymInfo({ navigation, route }: StackScreenProps<AppRoute, 'gym'>) {
    const gymNumber = route.params.number
    const gymInfo = getGymInfo(gymNumber)

    useEffect(() => {
        navigation.setOptions({
            title: gymInfo.isSuccess ? `${gymInfo.data.gym.location} - ${gymInfo.data.gym.badge} Badge` : "#" + gymNumber
        })
    }, [gymInfo])

    if (gymInfo.isLoading || gymInfo.isIdle) {
        return (<Loader/>)
    } else if (gymInfo.isError) {
        return (<Text>Error getting trainer info</Text>)
    } else {
        const gym = gymInfo.data!.gym
        const leader = gymInfo.data!.leader!
        const members = gymInfo.data!.members

        return (
            <View style={styles.components.page}>
                <ScrollView>
                    <View style={styles.components.container}>
                        <View style={{ ...styles.alignment.centered, flexDirection: 'row', flexWrap: 'wrap' }}>

                            { /* General Information */}
                            <View style={styles.alignment.centered}>
                                <Text style={styles.labels.normal}>{gym.badge} Badge</Text>

                                {/*<Image*/}
                                {/*    resizeMode='contain'*/}
                                {/*    style={{ width: 120, height: 120, margin: 8 }}*/}
                                {/*    source={{ uri: pokemon.spriteUrl }} />*/}

                                <Text style={styles.labels.heading}>{gym.location}</Text>

                                <Divider marginVertical={8} />

                                <Text style={{...styles.labels.small}}>Gym Leader</Text>
                                <TrainerCard
                                    trainer={leader}
                                    onPress={() => navigation.push('trainer', { id: leader.id })} />
                            </View>

                            {/* Members */}
                            { members.length > 0 && (
                                <View style={{ ...styles.alignment.centered, margin: 24, flexShrink: 1 }}>
                                    <Text style={{...styles.labels.large, alignSelf: 'flex-start', fontWeight: 'bold'}}>Members</Text>

                                    {members.map((member) =>
                                        <TrainerCard
                                            key={member.id}
                                            trainer={member}
                                            onPress={() => navigation.push('trainer', { id: member.id })} />
                                    )}
                                </View>
                            )}
                        </View>
                    </View>
                </ScrollView>
            </View>
        )
    }
}
