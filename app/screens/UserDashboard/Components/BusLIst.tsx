import React from "react";
import { FlatList, TouchableOpacity, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../UserDashboardStyle";

interface Props {
    buses: any[];
    onScrollEnd: any;
    navigateToDetails: (bus: any) => void;
}

const BusList = ({ buses, onScrollEnd, navigateToDetails }: Props) => (
    <View style={styles.busesContainer}>
        <Text style={styles.sectionTitle}>Available Buses</Text>
        <FlatList
            data={buses}
            keyExtractor={(item) => item.bus_ID.toString()}
            onMomentumScrollEnd={onScrollEnd}
            contentContainerStyle={styles.busListContainer}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
                <TouchableOpacity
                    onPress={() => navigateToDetails(item)}
                    style={styles.otherBusCard}
                    activeOpacity={0.8}
                >
                    <View style={styles.busRow}>
                        <View style={styles.busPicSmall}>
                            <Ionicons name="bus" size={20} color="#2196F3" />
                        </View>
                        <View style={styles.busInfo}>
                            <View style={styles.driverRow}>
                                <Text style={styles.driverName}>{item.driver_name}</Text>
                                <Text style={styles.driverNumber}> | {item.driver_phone_no}</Text>
                            </View>
                            <View style={styles.busNumberBoxAlt}>
                                <Text style={styles.busNumberTextAlt}>{item.bus_name}</Text>
                            </View>
                            <Text style={styles.routeText}>{item.route}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            )}
        />
    </View>
);

export default BusList;
