import React, { useEffect, useState, useRef, useCallback } from "react";
import {
    StyleSheet,
    View,
    ActivityIndicator,
    Text,
    TouchableOpacity,
    ScrollView,
    Animated,
    Dimensions,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { Image as RNImage } from "react-native";
import { Image } from "react-native";

import { router } from "expo-router";
import { BackHandler, FlatList } from "react-native";
import { NativeSyntheticEvent, NativeScrollEvent } from "react-native";

const { height: screenHeight } = Dimensions.get("window");

export default function Map({ navigation }: { navigation: any }) {
    const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
    const [loading, setLoading] = useState(true);
    const [mapHeight] = useState(new Animated.Value(screenHeight * 0.65));
    const [isMapExpanded, setIsMapExpanded] = useState(true);
    const animationInProgress = useRef(false);
    const mapRef = useRef<MapView | null>(null);

    const availableBuses = [
        { id: "1", driver: "Sarah Lee", phone: "+91-9123456789", bus: "7", route: "Main Gate → Central Market → Springfield School" },
        { id: "2", driver: "Michael Scott", phone: "+91-9012345678", bus: "3", route: "Park Road → River Bridge → Springfield School" },
        { id: "3", driver: "Jim Halpert", phone: "+91-9876543210", bus: "5", route: "Downtown → High Street → Springfield School" },
        { id: "4", driver: "Pam Beesly", phone: "+91-9765432109", bus: "2", route: "East Market → Old Town → Springfield School" },
        { id: "5", driver: "Dwight Schrute", phone: "+91-9123456700", bus: "8", route: "Farm Road → West End → Springfield School" },
    ];

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

    useEffect(() => {
        const backAction = () => true;
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );
        return () => backHandler.remove();
    }, []);

    const [showGif, setShowGif] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowGif(false);
        }, 20000); // 20 seconds

        return () => clearTimeout(timer);
    }, []);


    const handleScrollEnd = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        if (animationInProgress.current) return;

        if (offsetY > 20 && isMapExpanded) {
            animationInProgress.current = true;
            setIsMapExpanded(false);
            Animated.timing(mapHeight, {
                toValue: screenHeight * 0.4,
                duration: 250,
                useNativeDriver: false,
            }).start(() => {
                animationInProgress.current = false;
            });
        } else if (offsetY <= 20 && !isMapExpanded) {
            animationInProgress.current = true;
            setIsMapExpanded(true);
            Animated.timing(mapHeight, {
                toValue: screenHeight * 0.65,
                duration: 250,
                useNativeDriver: false,
            }).start(() => {
                animationInProgress.current = false;
            });
        }
    }, [isMapExpanded, mapHeight]);

    if (loading) {
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
                <Text style={styles.errorText}>Location not available.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Map */}
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
                    <Marker
                        coordinate={{
                            latitude: location.latitude,
                            longitude: location.longitude,
                        }}
                        title="Student Location"
                        description="This is the student."
                    >
                        <View style={styles.markerContainer}>
                            <Image
                                source={require("../../../assets/images/studentMaker2.png")}
                                style={styles.markerImage}
                            />
                        </View>

                    </Marker>
                </MapView>

                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <Image source={require('../../../assets/images/school-bus.png')}
                               style={styles.logo}/>

                        <Text style={styles.companyName}>EduRide</Text>
                    </View>
                    <View style={styles.profileContainer}>
                        <TouchableOpacity
                            onPress={() => router.push('/screens/AccountPage/AccountPage')}
                            style={styles.profileButton}
                        >
                            <Ionicons name="person-circle" size={24} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                </View>

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

            {/* Available Buses */}
            <View style={styles.busesContainer}>
                <Text style={styles.sectionTitle}>Available Buses</Text>
                <FlatList
                    data={availableBuses}
                    keyExtractor={(item) => item.id}
                    onMomentumScrollEnd={handleScrollEnd}
                    contentContainerStyle={styles.busListContainer}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => navigation.navigate("BusDetails", { busNumber: item.bus })}
                            style={styles.otherBusCard}
                            activeOpacity={0.8}
                        >
                            <View style={styles.busRow}>
                                <View style={styles.busPicSmall}>
                                    <Ionicons name="bus" size={20} color="#2196F3" />
                                </View>
                                <View style={styles.busInfo}>
                                    <View style={styles.driverRow}>
                                        <Text style={styles.driverName}>{item.driver}</Text>
                                        <Text style={styles.driverNumber}> | {item.phone}</Text>
                                    </View>
                                    <View style={styles.busNumberBoxAlt}>
                                        <Text style={styles.busNumberTextAlt}>Bus #{item.bus}</Text>
                                    </View>
                                    <Text style={styles.routeText}>{item.route}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1A1A1A',
    },
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#1A1A1A',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#E5E5E5',
        fontWeight: '500',
    },
    errorText: {
        fontSize: 16,
        color: '#E57373',
        fontWeight: '500',
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    header: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        paddingTop: 44,
        paddingBottom: 12,
        paddingHorizontal: 16,
        backgroundColor: 'transparent',
        zIndex: 1000,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    logoContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderRadius: 25,
        paddingHorizontal: 16,
        paddingVertical: 10,

    },
    profileContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderRadius: 25,
        padding: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    logo: {
        width: 30,
        height: 30,

    },

    companyName: {
        fontSize: 15,
        fontWeight: "700",
        marginLeft: 9,
        color: "#000000",
    },
    profileButton: {
        padding: 0,
    },
    mapContainer: {
        overflow: "hidden",
    },
    map: {
        flex: 1,
    },
    myLocationButton: {
        position: "absolute",
        bottom: 20,
        right: 20,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        borderRadius: 28,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    busesContainer: {
        flex: 1,
        paddingTop: 20,
        backgroundColor: '#FFFFFF',
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: "800",
        color: "#1A1A1A",
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    busListContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    otherBusCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 1,
        borderColor: 'rgba(33, 150, 243, 0.1)',
    },
    busRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    busPicSmall: {
        width: 48,
        height: 48,
        backgroundColor: "#E3F2FD",
        borderRadius: 24,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
        borderWidth: 2,
        borderColor: 'rgba(33, 150, 243, 0.2)',
    },
    busInfo: {
        flex: 1,
    },
    driverRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        marginBottom: 8,
    },
    driverName: {
        fontSize: 16,
        fontWeight: "700",
        color: "#1A1A1A",
    },
    driverNumber: {
        fontSize: 14,
        color: "#666",
        fontWeight: '500',
    },
    busNumberBoxAlt: {
        backgroundColor: "#2196F3",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        alignSelf: "flex-start",
        marginBottom: 8,
    },
    busNumberTextAlt: {
        color: "#FFFFFF",
        fontSize: 12,
        fontWeight: "700",
    },
    routeText: {
        fontSize: 14,
        color: "#666",
        lineHeight: 20,
        fontWeight: '500',
    },
    markerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    markerImage: {
        width: 40,   // change to desired size
        height: 40,
        resizeMode: 'contain',
    },

});