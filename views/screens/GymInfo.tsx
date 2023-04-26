import React, {useEffect} from 'react';
import {StackScreenProps} from '@react-navigation/stack';
import {AppRoute} from "../../flows/authenticated/AuthenticatedFlow";
import Loader from '../components/core/Loader';
import {View, Text, ScrollView} from "react-native";
import {getGymInfo} from "../../services/GymService";
import TrainerCard from "../components/pokemon/TrainerCard";
import Divider from "../components/core/Divider";
import tw from "twrnc";
import Container from "../components/Container";

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
            <View style={tw`flex-1 bg-white`}>
                <ScrollView>
                    <Container>
                        <View style={tw`flex-row flex-wrap justify-center items-center`}>
                            { /* General Information */}
                            <View style={tw`justify-center items-center`}>
                                <Text style={tw`text-base`}>{gym.badge} Badge</Text>

                                {/*<Image*/}
                                {/*    resizeMode='contain'*/}
                                {/*    style={{ width: 120, height: 120, margin: 8 }}*/}
                                {/*    source={{ uri: pokemon.spriteUrl }} />*/}

                                <Text style={tw`text-5xl font-bold`}>{gym.location}</Text>

                                <Divider marginVertical={8} />

                                <Text style={tw`text-sm`}>Gym Leader</Text>
                                <TrainerCard
                                    trainer={leader}
                                    onPress={() => navigation.push('trainer', { id: leader.id })} />
                            </View>

                            {/* Members */}
                            { members.length > 0 && (
                                <View style={tw`justify-center items-center m-8 flex-shrink`}>
                                    <Text style={tw`text-lg self-start font-bold`}>Members</Text>

                                    {members.map((member) =>
                                        <TrainerCard
                                            key={member.id}
                                            trainer={member}
                                            onPress={() => navigation.push('trainer', { id: member.id })} />
                                    )}
                                </View>
                            )}
                        </View>
                    </Container>
                </ScrollView>
            </View>
        )
    }
}
