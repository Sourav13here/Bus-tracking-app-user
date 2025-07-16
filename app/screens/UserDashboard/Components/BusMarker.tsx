// components/BusMarker.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Marker } from "react-native-maps";

interface BusMarkerProps {
    latitude: number;
    longitude: number;
    busName: string;
    driverName: string;
    driverPhone: string;
    markerStyle?: object;
    emoji?: string;
}

const BusMarker: React.FC<BusMarkerProps> = ({
                                                 latitude,
                                                 longitude,
                                                 busName,
                                                 driverName,
                                                 driverPhone,
                                                 markerStyle,
                                                 emoji = "🚌",
                                             }) => (
    <Marker
        coordinate={{ latitude, longitude }}
        title={`Bus #${busName}`}
        description={`Driver: ${driverName}\n ${driverPhone}`}
    >
        <View style={[styles.busMarker, markerStyle]}>
            <Text style={styles.busEmoji}>{emoji}</Text>
        </View>
    </Marker>
);

const styles = StyleSheet.create({
    busMarker: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 3,
        borderColor: "#2196F3",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    busEmoji: {
        fontSize: 20,
    },
});

export default BusMarker;
