/* BusDetails.tsx — hide visited‑stoppages in the route */
/* eslint-disable camelcase */
import React, { useEffect, useMemo, useState, useRef } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import MapView, { Polyline } from "react-native-maps";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import styles         from "../UserDashboardStyle";
import BusMarker      from "../Components/BusMarker";
import UserMarker     from "../Components/UserMarker";
import SchoolMarker   from "../Components/SchoolMarker";
import StoppageMarker from "../Components/StoppageMarker";
import { orsRoute }   from "@/app/services/directionsService";

interface Bus {
    bus_name:        string;
    bus_latitude:    string;
    bus_longitude:   string;
    driver_name:     string;
    driver_phone_no: string;
}

interface Stoppage {
    route_id:          number;
    stoppage_number:   number;
    stoppage_name:     string;
    stoppage_latitude: string;
    stoppage_longitude:string;
    has_arived:        number;   // 0 = not visited, 1 = visited
}

type LatLng = { latitude: number; longitude: number };
const SCHOOL: LatLng = { latitude: 26.179404, longitude: 91.734876 };

/* cheap Haversine in metres */
const haversine = (a: LatLng, b: LatLng) => {
    const toRad = (x:number)=>x*Math.PI/180, R=6371000;
    const dLat=toRad(b.latitude-a.latitude), dLng=toRad(b.longitude-a.longitude);
    const lat1=toRad(a.latitude), lat2=toRad(b.latitude);
    const h = Math.sin(dLat/2)**2 + Math.sin(dLng/2)**2 * Math.cos(lat1)*Math.cos(lat2);
    return R*2*Math.atan2(Math.sqrt(h),Math.sqrt(1-h));
};

const BusDetails: React.FC = () => {
    /* ───────────────────────── params / state ───────────────────────── */
    const { busData, userLocation:userLocRaw } = useLocalSearchParams<{
        busData:string; userLocation:string;
    }>();

    const mapRef = useRef<MapView>(null);

    const [bus,setBus]                 = useState<Bus|null>(null);
    const [userLoc,setULoc]            = useState<LatLng|null>(null);
    const [stoppages,setStops]         = useState<Stoppage[]>([]);
    const [polyline,setPoly]           = useState<LatLng[]>([]);
    const [loading,setLoad]            = useState(true);

    useEffect(() => {
        (async () => {
            if (typeof busData !== "string") return;

            const parsed = JSON.parse(busData) as Bus;
            setBus(parsed);

            if (typeof userLocRaw === "string") {
                setULoc(JSON.parse(userLocRaw));
            }

            try {
                const res = await fetch(
                    `http://192.168.190.91:9000/api/bus-route?busName=${encodeURIComponent(parsed.bus_name)}`
                );
                const jsonData = await res.json();

                if (!Array.isArray(jsonData.route)) {
                    console.warn("Invalid route response:", jsonData.route);
                    setStops([]); // fallback to empty array
                } else {
                    setStops(jsonData.route);
                }
            } catch (error) {
                console.error("Failed to fetch bus route:", error);
                setStops([]);
            }

            setLoad(false);
        })();
    }, [busData, userLocRaw]);


    /* ─────────────── memo helpers derived from stoppages ─────────────── */
    const unvisited = useMemo(
        () => stoppages.filter(s => s.has_arived === 0).sort(
            (a,b)=>a.stoppage_number - b.stoppage_number),
        [stoppages]
    );
    const visitedIds = useMemo(
        () => new Set(stoppages.filter(s=>s.has_arived===1).map(s=>s.route_id)),
        [stoppages]
    );

    /* ──────────────────────── build ORS polyline ─────────────────────── */
    useEffect(() => {
        (async () => {
            if(!bus || unvisited.length === 0) return;

            /* coords list: bus → remaining stops → back to SCHOOL */
            const coords:[number,number][] = [
                [+bus.bus_longitude, +bus.bus_latitude],
                ...unvisited.map(s=>[+s.stoppage_longitude,+s.stoppage_latitude] as [number,number]),
                [SCHOOL.longitude,   SCHOOL.latitude]
            ];

            try { setPoly(await orsRoute(coords)); }
            catch(e){ console.error("ORS failed", e); }
        })();
    }, [bus, unvisited]);

    /* ─────────────────────────── fit map once ─────────────────────────── */
    useEffect(() => {
        if(!mapRef.current || unvisited.length === 0) return;
        mapRef.current.fitToCoordinates(
            [SCHOOL, ...unvisited.map(s=>({
                latitude:+s.stoppage_latitude,
                longitude:+s.stoppage_longitude
            }))],
            { edgePadding:{top:80,bottom:80,left:80,right:80}, animated:true }
        );
    }, [unvisited]);

    /* ───────────────────────────   UI   ──────────────────────────────── */
    if(loading || !bus){
        return(
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#2196F3"/>
                <Text style={styles.loadingText}>Preparing map…</Text>
            </View>
        );
    }

    return(
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={styles.map}
                customMapStyle={greyStyle}
                initialRegion={{
                    latitude:SCHOOL.latitude, longitude:SCHOOL.longitude,
                    latitudeDelta:0.05, longitudeDelta:0.05
                }}>


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

                {/* user marker if present */}
                {userLoc && <UserMarker key="user" location={userLoc}/>}

                {/* school marker */}
                <SchoolMarker
                    key="school"
                    coordinate={SCHOOL}
                    emoji="🏫"

                />


                {unvisited.map(s => (
                    <StoppageMarker
                        key={`${s.route_id}-${s.stoppage_number}`}
                        coordinate={{
                            latitude:  +s.stoppage_latitude,
                            longitude: +s.stoppage_longitude,
                        }}
                        title={`${s.stoppage_number}. ${s.stoppage_name}`}
                        imageSource={require("../../../../assets/images/stoppage10.png")}
                    />
                ))}


                {polyline.length > 1 && (
                    <Polyline
                        key="poly"
                        coordinates={polyline}
                        strokeColor="#464657"
                        strokeWidth={3}
                    />
                )}
            </MapView>

            {/* my‑location FAB */}
            {userLoc && (
                <TouchableOpacity
                    style={styles.myLocationButton}
                    onPress={()=>mapRef.current?.animateToRegion(
                        {...userLoc, latitudeDelta:0.02, longitudeDelta:0.02}, 600)}>
                    <Ionicons name="locate" size={22} color="#fff"/>
                </TouchableOpacity>
            )}
        </View>
    );
};

const greyStyle = [
    {
        elementType: "geometry",
        stylers: [{ color: "#f5f7fa" }],
    },



    {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#c1c8d1" }],
    },
    {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#b0b8c1" }],
    },

    {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#a4c4d4" }],
    },

    {
        featureType: "landscape",
        elementType: "geometry",
        stylers: [{ color: "#e6ebf0" }],
    },


    {
        featureType: "transit",
        elementType: "all",
        stylers: [{ visibility: "off" }],
    },


];



/* extra style to fade visited stops (optional) */
const extra = {
    visited: { opacity: 0.35 }  // <‑‑ add to your StyleSheet.create or import
};
Object.assign(styles, extra);

export default BusDetails;
