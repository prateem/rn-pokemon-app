import React from "react";
import {ActivityIndicator, Text} from "react-native";
import tw from "twrnc";
import Container from "../Container";

export type LoaderProps = {
    message?: string
}

export default function Loader({ message } : LoaderProps) {

    return (
        <Container centered={true}>
            <ActivityIndicator size="large" />
            {message && (
                <Text style={tw`text-base p-3`}>{message}</Text>
            )}
        </Container>
    )

}
