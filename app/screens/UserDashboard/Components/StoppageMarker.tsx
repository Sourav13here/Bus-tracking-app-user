import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Marker } from 'react-native-maps';

interface Props {
    coordinate: { latitude: number; longitude: number };
    title: string;
    emoji?: string;
    imageSource?: any;
    markerStyle?: object;
    isVisited?: boolean;
}

const StoppageMarker: React.FC<Props> = ({
                                             coordinate,
                                             title,
                                             emoji = "🚏",
                                             imageSource,
                                             markerStyle,
                                             isVisited = false,
                                         }) => (
    <Marker
        coordinate={coordinate}
        title={title} // ✅ Native popup title (like in BusMarker)
        anchor={{ x: 0.5, y: 1 }}
        calloutAnchor={{ x: 0.5, y: 0.3 }}
    >
        <View style={[
            styles.markerContainer,
            isVisited && styles.visitedContainer,
            markerStyle
        ]}>
            <View style={[
                styles.markerCircle,
                isVisited && styles.visitedCircle
            ]}>
                {imageSource ? (
                    <Image
                        source={imageSource}
                        style={styles.markerImage}
                        resizeMode="contain"
                    />
                ) : (
                    <Text style={[
                        styles.markerEmoji,
                        isVisited && styles.visitedEmoji
                    ]}>
                        {emoji}
                    </Text>
                )}
            </View>
        </View>
    </Marker>
);

const styles = StyleSheet.create({
    markerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    markerCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#e33f3f',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    visitedCircle: {
        backgroundColor: '#E8F5E8',
        borderColor: '#4CAF50',
    },
    markerEmoji: {
        fontSize: 18,
    },
    visitedEmoji: {
        opacity: 0.7,
    },
    markerImage: {
        width: 20,
        height: 20,
    },
    visitedContainer: {
        opacity: 0.8,
    },
});

export default StoppageMarker;
