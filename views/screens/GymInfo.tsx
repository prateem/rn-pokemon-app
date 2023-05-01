import React, {useEffect, useState} from 'react';
import {StackScreenProps} from '@react-navigation/stack';
import {AppRoute} from "../../flows/authenticated/AuthenticatedFlow";
import Loader from '../components/core/Loader';
import {View, Text, ScrollView} from "react-native";
import {getGymInfo} from "../../services/GymService";
import TrainerCard from "../components/pokemon/TrainerCard";
import Divider from "../components/core/Divider";
import tw from "twrnc";
import Container from "../components/Container";
import Card from "../components/Card";

export default function GymInfo({ navigation, route }: StackScreenProps<AppRoute, 'gym'>) {
    const gymNumber = route.params.number
    const [availableWidth, setAvailableWidth] = useState(0)

    const gymInfo = getGymInfo(gymNumber)
    useEffect(() => {
        navigation.setOptions({
            title: gymInfo.isSuccess ? `${gymInfo.data.gym.location} - ${gymInfo.data.gym.badge} Badge` : "#" + gymNumber
        })
    }, [gymInfo])

    if (gymInfo.isLoading || gymInfo.isIdle) {
        return (<Loader/>)
    } else if (gymInfo.isError) {
        return (<Text>Error getting gym info</Text>)
    } else {
        const gym = gymInfo.data!.gym
        const leader = gymInfo.data!.leader!
        const members = gymInfo.data!.members

        return (
            <View style={tw`flex-1 bg-white`} onLayout={(event) => {
                const { width } = event.nativeEvent.layout
                setAvailableWidth(width)
            }}>
                <ScrollView>
                    <Container style={tw.style(availableWidth > 1400 && `mx-80`)}>
                        <View style={tw`flex-col web:flex-row web:flex-wrap justify-center items-center`}>
                            { /* General Information */}
                            <View style={tw`m-4 justify-center items-start web:items-center android:w-full ios:w-full android:px-2 ios:px-2`}>
                                <Text style={tw`text-3xl font-bold text-center`}>{gym.location}</Text>

                                <Text style={tw`text-base my-2`}>{gym.badge} Badge</Text>

                                {/*<Image*/}
                                {/*    resizeMode='contain'*/}
                                {/*    style={{ width: 120, height: 120, margin: 8 }}*/}
                                {/*    source={{ uri: pokemon.spriteUrl }} />*/}


                                <Divider style={tw`my-2`} />

                                <Text style={tw`text-sm`}>Gym Leader</Text>

                                <TrainerCard
                                    trainer={leader}
                                    onPress={() => navigation.push('trainer', { id: leader.id })} />
                            </View>

                            {/* Members */}
                            { members.length > 0 && (
                                <Card style={tw.style(
                                    `m-4 flex-shrink items-start`,
                                    availableWidth < 1400 ? `w-full` : `mx-20`
                                )}>
                                    <Text style={tw`text-lg self-start font-bold`}>Members</Text>

                                    <View style={tw`web:flex-row web:flex-wrap`}>
                                        {members.map((member) =>
                                            <TrainerCard
                                                key={member.id}
                                                trainer={member}
                                                onPress={() => navigation.push('trainer', { id: member.id })} />
                                        )}
                                    </View>
                                </Card>
                            )}
                        </View>
                    </Container>
                </ScrollView>
            </View>
        )
    }
}
