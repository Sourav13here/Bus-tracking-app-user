import React, { useEffect, useState, useRef, useCallback } from "react";
import {
    View,
    ActivityIndicator,
    Text,
    Animated,
    Dimensions,
    BackHandler,
    TouchableOpacity,
} from "react-native";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import styles from "./UserDashboardStyle";

// Components
import Header from "./Components/Header";
import UserMarker from "./Components/UserMarker";
import BusList from "./Components/BusLIst";
import BusMarker from "./Components/BusMarker";
import { router } from "expo-router";

// Navigation Type
type RootStackParamList = {
    BusDetails: { busData: string }; // Modified to send full bus object
};

// Bus interface
interface Bus {
    bus_ID: number;
    bus_name: string;
    bus_latitude: string;
    bus_longitude: string;
    driver_name: string;
    driver_phone_no: string;
    route: string;
}

const { height: screenHeight } = Dimensions.get("window");

export default function UserDashboardMap() {
    const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [mapHeight] = useState<Animated.Value>(new Animated.Value(screenHeight * 0.65));
    const [isMapExpanded, setIsMapExpanded] = useState<boolean>(true);
    const animationInProgress = useRef<boolean>(false);
    const mapRef = useRef<MapView | null>(null);
    const [liveBuses, setLiveBuses] = useState<Bus[]>([]);
    const [assignedBusNo, setAssignedBusNo] = useState<string | null>(null);
    const [isUserAssigned, setIsUserAssigned] = useState<boolean>(false);

    const fetchBusData = async () => {
        try {
            const user = await AsyncStorage.getItem("user_data");
            const parsed = user ? JSON.parse(user) : null;
            const phoneStr = parsed?.phone_no?.toString().trim();
            const rawBusNo = parsed?.bus_no?.toString().trim();

            const isAssigned = rawBusNo &&
                rawBusNo.toLowerCase() !== "null" &&
                rawBusNo !== "" &&
                rawBusNo !== "undefined";

            setIsUserAssigned(isAssigned);
            setAssignedBusNo(isAssigned ? rawBusNo : null);

            let filteredBuses: Bus[] = [];

            if (isAssigned && rawBusNo) {
                const url = `http://192.168.190.91:9000/api/bus-locations?phone=${encodeURIComponent(phoneStr || "")}`.trim();
                const res = await fetch(url);
                const data = await res.json();

                if (data.success && Array.isArray(data.data)) {
                    filteredBuses = data.data;
                }
            } else {
                const res = await fetch("http://192.168.190.91:9000/api/bus-locations");
                const data = await res.json();

                if (data.success && Array.isArray(data.data)) {
                    filteredBuses = data.data;
                }
            }

            setLiveBuses(filteredBuses);
        } catch (error) {
            console.error("Error fetching bus data:", error);
            setLiveBuses([]);
        }
    };

    useEffect(() => {
        (async () => {
            try {
                const cached = await AsyncStorage.getItem("cached_location");
                if (cached) {
                    const parsed = JSON.parse(cached) as Location.LocationObjectCoords;
                    setLocation(parsed);
                    setLoading(false);
                }

                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== "granted") {
                    alert("Permission to access location was denied");
                    if (!cached) setLoading(false);
                    return;
                }

                const loc = await Location.getCurrentPositionAsync({});
                await AsyncStorage.setItem("cached_location", JSON.stringify(loc.coords));
                setLocation(loc.coords);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching location:", err);
                setLoading(false);
            }
        })();
    }, []);

    useEffect(() => {
        fetchBusData();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            fetchBusData();
        }, 15000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const backHandler = BackHandler.addEventListener("hardwareBackPress", () => false);
        return () => backHandler.remove();
    }, []);

    const handleScrollEnd = useCallback(() => {
        if (animationInProgress.current) return;

        animationInProgress.current = true;

        Animated.timing(mapHeight, {
            toValue: isMapExpanded ? screenHeight * 0.4 : screenHeight * 0.65,
            duration: 250,
            useNativeDriver: false,
        }).start(() => {
            animationInProgress.current = false;
            setIsMapExpanded(!isMapExpanded);
        });
    }, [isMapExpanded]);

    if (loading && !location) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#2196F3" />
                <Text style={styles.loadingText}>Loading your location...</Text>
            </View>
        );
    }

    if (!location) {
        return (
            <View style={styles.loader}>
                <Text style={styles.errorText}>
                    Unable to access your location. Please enable location services.
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Map View */}
            <Animated.View style={[styles.mapContainer, { height: mapHeight }]}>
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
                    <UserMarker location={location} />
                    {liveBuses.map((bus, index) => (
                        <BusMarker
                            key={index}
                            latitude={parseFloat(bus.bus_latitude)}
                            longitude={parseFloat(bus.bus_longitude)}
                            busName={bus.bus_name}
                            driverName={bus.driver_name}
                            driverPhone={bus.driver_phone_no}
                            // imageSource={require("../../../assets/images/buslocation3.png")}
                            markerStyle={styles.bus_markerContainer}
                        />
                    ))}
                </MapView>

                <Header />
                <TouchableOpacity
                    style={styles.myLocationButton}
                    onPress={() => {
                        mapRef.current?.animateToRegion(
                            {
                                latitude: location.latitude,
                                longitude: location.longitude,
                                latitudeDelta: 0.01,
                                longitudeDelta: 0.01,
                            },
                            500
                        );
                    }}
                >
                    <Ionicons name="locate" size={21} color="#FFFFFF" />
                </TouchableOpacity>
            </Animated.View>

            {/* Bus List */}
            <BusList
                buses={liveBuses}
                onScrollEnd={handleScrollEnd}
                navigateToDetails={(bus: Bus) =>
                    router.push({
                        pathname: "/screens/UserDashboard/BusDetailsMap/BusDetails",
                        params: { busData: JSON.stringify(bus),
                            userLocation: JSON.stringify(location),}
                    })
                }
            />
        </View>
    );
}
