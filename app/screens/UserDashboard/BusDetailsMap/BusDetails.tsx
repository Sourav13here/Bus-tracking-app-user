import React, { useEffect, useState, useRef } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import MapView from "react-native-maps";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// Reuse styles
import styles from "../UserDashboardStyle";

// Custom Marker Components
import UserMarker from "../Components/UserMarker";
import BusMarker from "../Components/BusMarker";

// Interfaces
interface Bus {
    bus_name: string;
    bus_latitude: string;
    bus_longitude: string;
    driver_name: string;
    driver_phone_no: string;
}

const BusDetails = () => {
    const { busData, userLocation: userLocationParam } = useLocalSearchParams();
    const mapRef = useRef<MapView>(null);

    const [bus, setBus] = useState<Bus | null>(null);
    const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        try {
            if (!busData || typeof busData !== "string") {
                console.error("Missing or invalid bus data");
                return;
            }

            const parsedBus: Bus = JSON.parse(busData);
            setBus(parsedBus);

            if (userLocationParam && typeof userLocationParam === "string") {
                const parsedLocation = JSON.parse(userLocationParam);
                setUserLocation(parsedLocation);
            } else {
                console.warn("User location not passed or invalid");
            }

            setReady(true);
        } catch (err) {
            console.error("Failed to parse params:", err);
        }
    }, [busData, userLocationParam]);

    if (!ready || !bus) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#2196F3" />
                <Text style={styles.loadingText}>Loading map data...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={{
                    latitude: userLocation!.latitude,
                    longitude: userLocation!.longitude,
                    latitudeDelta: 0.02,
                    longitudeDelta: 0.02,
                }}
            >
                <BusMarker
                    latitude={parseFloat(bus.bus_latitude)}
                    longitude={parseFloat(bus.bus_longitude)}
                    busName={bus.bus_name}
                    driverName={bus.driver_name}
                    driverPhone={bus.driver_phone_no}
                    imageSource={require("../../../../assets/images/buslocation3.png")}
                    markerStyle={styles.bus_markerContainer}
                />

                {userLocation && (
                    <UserMarker
                        location={{
                            latitude: userLocation.latitude,
                            longitude: userLocation.longitude,
                        }}
                    />
                )}
            </MapView>

            {/* My Location Button */}
            {userLocation && (
                <TouchableOpacity
                    onPress={() => {
                        mapRef.current?.animateToRegion(
                            {
                                latitude: userLocation.latitude,
                                longitude: userLocation.longitude,
                                latitudeDelta: 0.02,
                                longitudeDelta: 0.02,
                            },
                            500
                        );
                    }}
                    style={styles.myLocationButton}
                >
                    <Ionicons name="locate" size={24} color="white" />
                </TouchableOpacity>
            )}
        </View>
    );
};

export default BusDetails;
