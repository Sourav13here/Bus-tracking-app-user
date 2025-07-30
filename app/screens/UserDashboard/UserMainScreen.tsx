// UserDashboardMap.tsx

import React, {useEffect, useState, useRef, useCallback} from "react";
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
import {Ionicons} from "@expo/vector-icons";
import styles from "./UserDashboardStyle";
import { Switch } from "react-native";


import Header from "./Components/Header";
import UserMarker from "./Components/UserMarker";
import BusList from "./Components/BusLIst";
import BusMarker from "./Components/BusMarker";
import {router} from "expo-router";

const greyMapStyle = [
    {elementType: "geometry", stylers: [{color: "#f5f7fa"}]},
    {elementType: "labels.icon", stylers: [{visibility: "off"}]},
    {featureType: "road", elementType: "geometry", stylers: [{color: "#c1c8d1"}]},
    {featureType: "road", elementType: "geometry.stroke", stylers: [{color: "#b0b8c1"}]},
    {featureType: "water", elementType: "geometry", stylers: [{color: "#a4c4d4"}]},
    {featureType: "landscape", elementType: "geometry", stylers: [{color: "#e6ebf0"}]},
    {featureType: "transit", elementType: "all", stylers: [{visibility: "off"}]},
];

interface Bus {
    bus_ID: number;
    bus_name: string;
    bus_latitude: string;
    bus_longitude: string;
    driver_name: string;
    driver_phone_no: string;
    route: string;
}

const {height: screenHeight} = Dimensions.get("window");

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371e3;
    const φ1 = toRad(lat1);
    const φ2 = toRad(lat2);
    const Δφ = toRad(lat2 - lat1);
    const Δλ = toRad(lon2 - lon1);

    const a = Math.sin(Δφ / 2) ** 2 +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

export default function UserDashboardMap() {
    const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
    const [loading, setLoading] = useState(true);
    const [mapHeight] = useState(new Animated.Value(screenHeight * 0.65));
    const [isMapExpanded, setIsMapExpanded] = useState(true);
    const animationInProgress = useRef(false);
    const mapRef = useRef<MapView | null>(null);
    const [liveBuses, setLiveBuses] = useState<Bus[]>([]);
    const [assignedBusNo, setAssignedBusNo] = useState<string | null>(null);
    const [isUserAssigned, setIsUserAssigned] = useState(false);
    const [userStatus, setUserStatus] = useState<"inside" | "outside">("outside");
    const [nearestBus, setNearestBus] = useState<Bus | null>(null);
    const [toggleValue, setToggleValue] = useState(userStatus === "inside");

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
                const url = `http://192.168.39.204:9000/api/bus-locations?phone=${encodeURIComponent(phoneStr || "")}`.trim();
                const res = await fetch(url);
                const data = await res.json();

                if (data.success && Array.isArray(data.data)) {
                    filteredBuses = data.data;
                }
            } else {
                const res = await fetch("http://192.168.39.204:9000/api/bus-locations");
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
    const handleToggle = (value: boolean) => {
        setToggleValue(value);
        setUserStatus(value ? "inside" : "outside");
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

                const {status} = await Location.requestForegroundPermissionsAsync();
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
        const interval = setInterval(() => fetchBusData(), 3000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!location || liveBuses.length === 0) return;
        let minDist = Infinity;
        let closest: Bus | null = null;
        for (let bus of liveBuses) {
            const d = getDistance(location.latitude, location.longitude, parseFloat(bus.bus_latitude), parseFloat(bus.bus_longitude));
            if (d < minDist) {
                minDist = d;
                closest = bus;
            }
        }
        if (minDist <= 50 && closest) setNearestBus(closest);
        else setNearestBus(null);
    }, [location, liveBuses]);

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
                <ActivityIndicator size="large" color="#2196F3"/>
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
            <Animated.View style={[styles.mapContainer, {height: mapHeight}]}>
                <MapView
                    ref={mapRef}
                    style={styles.map}
                    customMapStyle={greyMapStyle}
                    initialRegion={{
                        latitude: location.latitude,
                        longitude: location.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    }}>
                    {userStatus === "outside" && (
                        <UserMarker location={location}/>
                    )}

                    {liveBuses.map((bus, index) => (
                        <BusMarker
                            key={bus.bus_ID}
                            latitude={parseFloat(bus.bus_latitude)}
                            longitude={parseFloat(bus.bus_longitude)}
                            busName={bus.bus_name}
                            driverName={bus.driver_name}
                            driverPhone={bus.driver_phone_no}
                            markerStyle={styles.bus_markerContainer}
                            onCalloutPress={() =>
                                router.push({
                                    pathname: "/screens/UserDashboard/BusDetailsMap/BusDetails",
                                    params: {
                                        busData: JSON.stringify(bus),
                                        userLocation: JSON.stringify(location),
                                        userStatus:userStatus,
                                    },
                                })
                            }
                        />
                    ))}

                </MapView>

                <Header/>
                <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingTop: 4 }}>
                    <Text style={{ marginRight: 10, fontSize: 14, color: "#ffffff" }}>Inside Bus</Text>
                    <Switch
                        value={toggleValue}
                        onValueChange={handleToggle}
                        thumbColor={toggleValue ? "#2196F3" : "#f4f3f4"}
                        trackColor={{ false: "#ccc", true: "#90caf9" }}
                    />

                </View>

                {/* My Location Button */}
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

            <BusList
                buses={liveBuses}
                onScrollEnd={handleScrollEnd}
                navigateToDetails={(bus: Bus) =>
                    router.push({
                        pathname: "/screens/UserDashboard/BusDetailsMap/BusDetails",
                        params: {
                            busData: JSON.stringify(bus),
                            userLocation: JSON.stringify(location),
                            userStatus: userStatus,
                        }
                    })
                }
            />
        </View>
    );
}
