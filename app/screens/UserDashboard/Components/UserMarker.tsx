import React from "react";
import { Marker } from "react-native-maps";
import { View, Image } from "react-native";
import styles from "../UserDashboardStyle";

const UserMarker = ({ location }: { location: { latitude: number; longitude: number } }) => (
    <Marker coordinate={location} title="Student Location" description="This is the student.">
        <View style={styles.markerContainer}>
            <Image source={require("../../../../assets/images/studentMaker2.png")} style={styles.markerImage} />
        </View>
    </Marker>
);

export default UserMarker;
