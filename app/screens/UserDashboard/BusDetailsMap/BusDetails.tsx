		//working bus_details.tsx file

/* BusDetails.tsx — final version: shift-aware routing + banner logic */
/* eslint-disable camelcase */
import React, { useEffect, useMemo, useState, useRef } from "react";
import {
    View,
    Text,
    ActivityIndicator,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import MapView, { Polyline } from "react-native-maps";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import styles from "../UserDashboardStyle";
import BusMarker from "../Components/BusMarker";
import UserMarker from "../Components/UserMarker";
import SchoolMarker from "../Components/SchoolMarker";
import StoppageMarker from "../Components/StoppageMarker";
import { orsRoute } from "@/app/services/directionsService";

interface Bus {
    bus_name: string;
    bus_latitude: string;
    bus_longitude: string;
    driver_name: string;
    driver_phone_no: string;
}

interface Stoppage {
    route_id: number;
    stoppage_number: number;
    stoppage_name: string;
    stoppage_latitude: string;
    stoppage_longitude: string;
    has_arrived: number;
}

type LatLng = { latitude: number; longitude: number };

const SCHOOL: LatLng = { latitude: 26.179404, longitude: 91.734876 };
const AFTERNOON_CUTOFF_HR = 11; // 11 a.m.
const NEAR_SCHOOL_M = 120;

const haversine = (a: LatLng, b: LatLng) => {
    const R = 6371000;
    const dLat = ((b.latitude - a.latitude) * Math.PI) / 180;
    const dLng = ((b.longitude - a.longitude) * Math.PI) / 180;
    const lat1 = (a.latitude * Math.PI) / 180;
    const lat2 = (b.latitude * Math.PI) / 180;
    const h =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
};

const BusDetails: React.FC = () => {
    const { busData, userLocation: userLocRaw, userStatus } = useLocalSearchParams<{
        busData: string;
        userLocation: string;
        userStatus?: "inside" | "outside";
    }>();

    const mapRef = useRef<MapView>(null);
    const [bus, setBus] = useState<Bus | null>(null);
    const [userLoc, setULoc] = useState<LatLng | null>(null);
    const [stoppages, setStops] = useState<Stoppage[]>([]);
    const [polyline, setPoly] = useState<LatLng[]>([]); 
    const [loading, setLoad] = useState(true);
    const [banner, setBanner] = useState<string | null>(null);

    const isMorning = new Date().getHours() < AFTERNOON_CUTOFF_HR;

    const fetchLiveBusLocation = async (busName: string) => {
        try {
            const res = await fetch(`http://192.168.39.204:9000/api/bus-locations`);
            const json = await res.json();
            
            if (json.success && Array.isArray(json.data)) {

                const updatedBus = json.data.find((b: any) => b.bus_name === busName);
                
                if (updatedBus) {
                    setBus((prev) => prev ? {
                        ...prev,
                        bus_latitude: updatedBus.bus_latitude,
                        bus_longitude: updatedBus.bus_longitude
                    } : null);
                } else {
                    console.warn("Bus not found in live data:", busName);
                }
            } else {
                console.warn("Invalid API response structure:", json);
            }
        } catch (err) {
            console.error("Failed to fetch live bus location", err);
        }
    };

    // Live location tracking
    useEffect(() => {
        if (!bus?.bus_name) return;

        fetchLiveBusLocation(bus.bus_name);

        const interval = setInterval(() => {
            fetchLiveBusLocation(bus.bus_name);
        }, 3000); 

        return () => clearInterval(interval);
    }, [bus?.bus_name]);

    useEffect(() => {
        (async () => {
            if (typeof busData !== "string") return;

            const parsedBus = JSON.parse(busData);
            setBus(parsedBus);
            
            if (typeof userLocRaw === "string") {
                setULoc(JSON.parse(userLocRaw));
            }

            try {
                const res = await fetch(
                    `http://192.168.39.204:9000/api/bus-route?busName=${encodeURIComponent(
                        parsedBus.bus_name
                    )}`
                );
                const json = await res.json();
                setStops(Array.isArray(json.route) ? json.route : []);
            } catch (e) {
                console.warn("Route fetch failed:", e);
                setStops([]);
            }
            setLoad(false);
        })();
    }, [busData, userLocRaw]);

    // For dynamically updating the stoppages
    useEffect(() => {
        if (!bus) return;

        const interval = setInterval(async () => {
            try {
                const res = await fetch(
                    `http://192.168.39.204:9000/api/bus-route?busName=${encodeURIComponent(bus.bus_name)}`
                );
                const json = await res.json();
                console.log("Updated route:", json.route);
                setStops(Array.isArray(json.route) ? json.route : []);
            } catch (e) {
                console.warn("Stoppage refresh failed:", e);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [bus?.bus_name]);


    const unvisited = useMemo(() => {
        const list = stoppages.filter((s) => s.has_arrived === 0);
        return isMorning
            ? list.sort((a, b) => a.stoppage_number - b.stoppage_number)
            : list.sort((a, b) => b.stoppage_number - a.stoppage_number);
    }, [stoppages, isMorning]);

    useEffect(() => {
        (async () => {
            if (!bus || !bus.bus_latitude || !bus.bus_longitude) {
                return; // Don't clear polyline, just return if bus data is incomplete
            }

            // Only skip routes for morning hours if you don't want morning routes
            // Comment out these lines if you want routes to show in morning too
            if (isMorning) {
                setPoly([]);
                return;
            }

            const coords: [number, number][] =
                unvisited.length > 0
                    ? [
                        [+bus.bus_longitude, +bus.bus_latitude],
                        ...unvisited.map(
                            (s) =>
                                [+s.stoppage_longitude, +s.stoppage_latitude] as [number, number]
                        ),
                        [SCHOOL.longitude, SCHOOL.latitude],
                    ]
                    : [
                        [+bus.bus_longitude, +bus.bus_latitude],
                        [SCHOOL.longitude, SCHOOL.latitude],
                    ];

            try {
                const newRoute = await orsRoute(coords);
                if (newRoute && newRoute.length > 0) {
                    setPoly(newRoute);
                }
            } catch (e) {
                console.error("ORS error:", e);
                // Don't clear the polyline on API error, keep the previous route
            }
        })();
    }, [bus?.bus_latitude, bus?.bus_longitude, unvisited, isMorning]);

    useEffect(() => {
        if (!bus) return;
        const allVisited = stoppages.every((s) => s.has_arrived === 1);

        if (allVisited) {
            if (isMorning) {
                const dist = haversine(
                    { latitude: +bus.bus_latitude, longitude: +bus.bus_longitude },
                    SCHOOL
                );
                setBanner(dist < NEAR_SCHOOL_M ? "School reached — morning run complete" : null);
            } else {
                setBanner("Drop‑off complete — see you tomorrow!");
            }
        } else {
            setBanner(null);
        }
    }, [bus, stoppages, isMorning]);

    if (loading || !bus) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#2196F3" />
                <Text style={styles.loadingText}>Preparing map…</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={styles.map}
                customMapStyle={greyStyle}
                initialRegion={{
                    latitude: SCHOOL.latitude,
                    longitude: SCHOOL.longitude,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
            >
                {userLoc && userStatus !== "inside" && (
                    <UserMarker key="user" location={userLoc} />
                )}
                <SchoolMarker key="school" coordinate={SCHOOL} emoji="🏫" />
                {unvisited.map((s) => (
                    <StoppageMarker
                        key={s.route_id}
                        coordinate={{
                            latitude: +s.stoppage_latitude,
                            longitude: +s.stoppage_longitude,
                        }}
                        title={`${s.stoppage_number}. ${s.stoppage_name}`}
                        imageSource={require("../../../../assets/images/stoppage10.png")}
                    />
                ))}
                {bus.bus_latitude && bus.bus_longitude && (
                    <BusMarker
                        latitude={+bus.bus_latitude}
                        longitude={+bus.bus_longitude}
                        busName={bus.bus_name}
                        driverName={bus.driver_name}
                        driverPhone={bus.driver_phone_no}
                        markerStyle={styles.bus_markerContainer}
                        emoji="🚍"
                        key="bus"
                    />
                )}
                {polyline.length > 1 && (
                    <Polyline coordinates={polyline} strokeColor="#464657" strokeWidth={3} />
                )}
            </MapView>

            <TouchableOpacity
                style={styles.myLocationButton}
                onPress={() => {
                    if (bus?.bus_latitude && bus?.bus_longitude) {
                        mapRef.current?.animateToRegion(
                            {
                                latitude: +bus.bus_latitude,
                                longitude: +bus.bus_longitude,
                                latitudeDelta: 0.02,
                                longitudeDelta: 0.02,
                            },
                            600
                        );
                    }
                }}
            >
                <Ionicons name="locate" size={22} color="#fff" />
            </TouchableOpacity>

            {banner && (
                <View style={bannerStyles.banner}>
                    <Text style={bannerStyles.text}>{banner}</Text>
                </View>
            )}
        </View>
    );
};

const greyStyle = [
    { elementType: "geometry", stylers: [{ color: "#f5f7fa" }] },
    { elementType: "labels.icon", stylers: [{ visibility: "off" }] },

    { featureType: "road", elementType: "geometry", stylers: [{ color: "#c1c8d1" }] },
    { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#b0b8c1" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#a4c4d4" }] },
    { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#e6ebf0" }] },
    { featureType: "transit", elementType: "all", stylers: [{ visibility: "off" }] },
];

const bannerStyles = StyleSheet.create({
    banner: {
        position: "absolute",
        top: 40,
        alignSelf: "center",
        backgroundColor: "#2d8249",
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        elevation: 3,
    },
    text: { color: "#fff", fontWeight: "600", fontSize: 15 },
});

export default BusDetails;