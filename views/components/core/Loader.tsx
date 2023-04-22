import React from "react";
import {View, ActivityIndicator, Text} from "react-native";
import styles from "../../styles";

export type LoaderProps = {
    message?: string
}

export default function Loader({ message } : LoaderProps) {

    return (
        <View style={[styles.components.container, styles.alignment.centered]}>
            <ActivityIndicator size="large" />
            {message && (
                <Text style={{...styles.labels.normal, padding: 12}}>{message}</Text>
            )}
        </View>
    )

}