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
    has_arived: number;
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

    useEffect(() => {
        (async () => {
            if (typeof busData !== "string") return;

            setBus(JSON.parse(busData));
            if (typeof userLocRaw === "string") {
                setULoc(JSON.parse(userLocRaw));
            }

            try {
                const res = await fetch(
                    `http://192.168.38.91:9000/api/bus-route?busName=${encodeURIComponent(
                        JSON.parse(busData).bus_name
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

    const unvisited = useMemo(() => {
        const list = stoppages.filter((s) => s.has_arived === 0);
        return isMorning
            ? list.sort((a, b) => a.stoppage_number - b.stoppage_number)
            : list.sort((a, b) => b.stoppage_number - a.stoppage_number);
    }, [stoppages, isMorning]);

    useEffect(() => {
        (async () => {
            if (!bus || isMorning) {
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
                    ]
                    : [
                        [+bus.bus_longitude, +bus.bus_latitude],
                        [+bus.bus_longitude, +bus.bus_latitude],
                    ];

            try {
                setPoly(await orsRoute(coords));
            } catch (e) {
                console.error("ORS error:", e);
            }
        })();
    }, [bus, unvisited, isMorning]);

    useEffect(() => {
        if (!bus) return;
        const allVisited = stoppages.every((s) => s.has_arived === 1);

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
                {polyline.length > 1 && (
                    <Polyline coordinates={polyline} strokeColor="#464657" strokeWidth={3} />
                )}
            </MapView>

            <TouchableOpacity
                style={styles.myLocationButton}
                onPress={() =>
                    mapRef.current?.animateToRegion(
                        {
                            latitude: +bus.bus_latitude,
                            longitude: +bus.bus_longitude,
                            latitudeDelta: 0.02,
                            longitudeDelta: 0.02,
                        },
                        600
                    )
                }
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