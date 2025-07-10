import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../UserDashboardStyle";
import { router } from "expo-router";

const Header = () => (
    <View style={styles.header}>
        <View style={styles.logoContainer}>
            <Image source={require('../../../../assets/images/school-bus.png')} style={styles.logo} />
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
);

export default Header;
