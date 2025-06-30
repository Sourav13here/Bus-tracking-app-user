import React, { useEffect, useState, useRef } from "react";
import {
    StyleSheet,
    View,
    ActivityIndicator,
    Text,
    TouchableOpacity,
    ScrollView,
    Image as RNImage,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";

export default function Map({ navigation }: { navigation: any }) {
    const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
    const [loading, setLoading] = useState(true);
    const mapRef = useRef<MapView | null>(null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                alert("Permission to access location was denied");
                setLoading(false);
                return;
            }
            let loc = await Location.getCurrentPositionAsync({});
            setLocation(loc.coords);
            setLoading(false);
        })();
    }, []);

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#000" />
                <Text>Loading your location...</Text>
            </View>
        );
    }

    if (!location) {
        return (
            <View style={styles.loader}>
                <Text>Location not available.</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            {/* Top Header */}
            <View style={styles.header}>
                <RNImage
                    source={{ uri: "https://via.placeholder.com/40" }}
                    style={styles.logo}
                />
                <Text style={styles.companyName}>Company Name</Text>
                <Ionicons name="person-circle" size={36} color="#333" />
            </View>

            {/* Map */}
            <View style={styles.mapContainer}>
                <MapView
                    ref={mapRef}
                    style={styles.map}
                    initialRegion={{
                        latitude: location.latitude,
                        longitude: location.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    }}
                >
                    <Marker
                        coordinate={{
                            latitude: location.latitude,
                            longitude: location.longitude,
                        }}
                        title="Student Location"
                        description="This is the student."
                        image={require("../../../assets/images/studentMaker2.png")}
                    />
                </MapView>

                {/* Button to go to current location */}
                <TouchableOpacity
                    style={styles.myLocationButton}
                    onPress={() => {
                        if (mapRef.current && location) {
                            mapRef.current.animateToRegion(
                                {
                                    latitude: location.latitude,
                                    longitude: location.longitude,
                                    latitudeDelta: 0.01,
                                    longitudeDelta: 0.01,
                                },
                                500
                            );
                        }
                    }}
                >
                    <Ionicons name="locate" size={24} color="#333" />
                </TouchableOpacity>
            </View>

            {/* Current Bus */}
            <TouchableOpacity
                onPress={() => navigation.navigate("BusDetails", { busNumber: "12" })}
                style={styles.currentBusCard}
            >
                <View style={styles.busRow}>

                    <View style={styles.busPic}>
                        <Text style={styles.picText}>Pic</Text>
                    </View>

                    <View style={{ flex: 1 }}>
                        <View style={styles.driverRow}>
                            <Text style={styles.driverName}>Sanjeev Iqbal Ahmed</Text>
                            <Text style={styles.driverNumber}> | +91-9123456789</Text>
                        </View>
                        <View style={styles.busNumberBox}>
                            <Text style={styles.busNumberText}>Bus #12</Text>
                        </View>
                        <Text style={styles.timeText}>09:00 AM — 10:00 AM</Text>
                    </View>
                    <Ionicons name="navigate-circle-outline" size={28} color="#ddd" />
                </View>
            </TouchableOpacity>

            {/* Other Buses */}
            <Text style={styles.sectionTitle}>Other Buses to School</Text>

            <TouchableOpacity
                onPress={() => navigation.navigate("BusDetails", { busNumber: "7" })}
                style={styles.otherBusCard}
            >
                <View style={styles.busRow}>
                    <View style={styles.busPicSmall}>
                        <Text style={styles.picText}>Pic</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <View style={styles.driverRow}>
                            <Text style={styles.driverName}>Sarah Lee</Text>
                            <Text style={styles.driverNumber}> | +91-9123456789</Text>
                        </View>
                        <View style={styles.busNumberBoxAlt}>
                            <Text style={styles.busNumberTextAlt}>Bus #7</Text>
                        </View>
                        <Text style={styles.routeText}>
                            Main Gate → Central Market → Springfield School
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => navigation.navigate("BusDetails", { busNumber: "3" })}
                style={styles.otherBusCard}
            >
                <View style={styles.busRow}>
                    <View style={styles.busPicSmall}>
                        <Text style={styles.picText}>Pic</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <View style={styles.driverRow}>
                            <Text style={styles.driverName}>Michael Scott</Text>
                            <Text style={styles.driverNumber}> | 9012345678</Text>
                        </View>
                        <View style={styles.busNumberBoxAlt}>
                            <Text style={styles.busNumberTextAlt}>Bus #3</Text>
                        </View>
                        <Text style={styles.routeText}>
                            Park Road → River Bridge → Springfield School
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: { padding: 16 },
    header: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
    logo: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#ddd" },
    companyName: { flex: 1, fontSize: 18, fontWeight: "600", marginLeft: 8, color: "#333" },
    mapContainer: {
        height: 450,
        borderRadius: 12,
        overflow: "hidden",
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "black",
    },
    map: { flex: 1 },
    myLocationButton: {
        position: "absolute",
        bottom: 10,
        right: 10,
        backgroundColor: "#fff",
        padding: 8,
        borderRadius: 20,
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    loader: { flex: 1, justifyContent: "center", alignItems: "center" },
    busRow: { flexDirection: "row", alignItems: "center" },
    busPic: {
        width: 50,
        height: 50,
        backgroundColor: "#fff",
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    busPicSmall: {
        width: 40,
        height: 40,
        backgroundColor: "#ddd",
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },
    picText: { color: "#000", fontWeight: "bold" },
    driverRow: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", marginBottom: 2 },
    driverName: { fontSize: 14, fontWeight: "600", color: "#fff" },
    driverNumber: { fontSize: 13, color: "#fff" },
    busNumberBox: {
        backgroundColor: "#fff",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        alignSelf: "flex-start",
        marginTop: 4,
    },
    busNumberText: { color: "#000", fontSize: 12 },
    timeText: { fontSize: 12, color: "#fff", marginTop: 2 },
    sectionTitle: { fontSize: 16, fontWeight: "700", marginVertical: 8, color: "#333" },
    currentBusCard: {
        backgroundColor: "#617fb1", // Blue background
        borderRadius: 12,
        padding: 14,
        marginBottom: 16,
    },
    otherBusCard: {
        backgroundColor: "#393c3c",
        borderRadius: 10,
        padding: 12,
        marginBottom: 10,
    },
    busNumberBoxAlt: {
        backgroundColor: "#9a9090",
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 5,
        alignSelf: "flex-start",
        marginTop: 4,
        marginBottom: 2,
    },
    busNumberTextAlt: { color: "#fff", fontSize: 12 },
    routeText: { fontSize: 12, color: "#ccc", marginTop: 2 },
});
