import React from 'react';
import { View, Text, StyleSheet,Image } from 'react-native';
import { Marker, Callout } from 'react-native-maps';

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
        anchor={{ x: 0.5, y: 1 }}
        calloutAnchor={{ x: 0.5, y: 0.3 }}
    >
        <View style={[
            styles.markerContainer,
            isVisited && styles.visitedContainer,
            markerStyle
        ]}>
            {/* Main marker circle */}
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

        {/* Custom callout */}
        <Callout tooltip>
            <View style={styles.calloutContainer}>
                <Text style={styles.calloutText}>{title}</Text>
            </View>
        </Callout>
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
    markerTail: {
        width: 0,
        height: 0,
        borderLeftWidth: 6,
        borderRightWidth: 6,
        borderTopWidth: 10,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: '#ae5151',
        marginTop: -1,
    },

    calloutContainer: {
        backgroundColor: '#2C3E50',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        maxWidth: 200,
    },
    calloutText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center',
    },
});

export default StoppageMarker;