import React from 'react';
import { View, Text,StyleSheet } from 'react-native';
import { Marker,Callout } from 'react-native-maps';

interface Props {
    coordinate: { latitude: number; longitude: number };
    title?: string;
    markerStyle?: object;
    emoji?: string;
}

const SchoolMarker: React.FC<Props> = ({ coordinate, title, markerStyle,emoji }) => (
    <Marker
        coordinate={coordinate}
        anchor={{ x: 0.5, y: 1 }}
        calloutAnchor={{ x: 0.5, y: 0.3 }}

        description="School"
    >
        <View style={[styles.marker, markerStyle]}>
            <Text style={styles.emoji}>{emoji}</Text>
        </View>
    </Marker>
);

const styles = StyleSheet.create({
    marker: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#838383',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#171a1b',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 3,
    },
    emoji: {
        fontSize: 20,
    },
});


export default SchoolMarker;
