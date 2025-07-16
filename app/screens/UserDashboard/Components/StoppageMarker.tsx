/* StoppageMarker.tsx */
import React from 'react';
import { Image, StyleSheet,Text } from 'react-native';
import { Marker, Callout } from 'react-native-maps';

interface Props {
    coordinate: { latitude: number; longitude: number };
    title: string;
    imageSource: any;
    /** extra styles if you need them */
    markerStyle?: object;
}

const StoppageMarker: React.FC<Props> = ({
                                             coordinate,
                                             title,
                                             imageSource,
                                             markerStyle,
                                         }) => (
    <Marker
        coordinate={coordinate}

        anchor={{ x: 0.4, y: 1 }}

        calloutAnchor={{ x: 0.5, y: 0.3 }}
        title={`ss`}
        description={`dnd`}
    >
        <Image
            source={imageSource}
            style={[styles.icon, markerStyle]}
            resizeMode="contain"
        />

    </Marker>
);

const styles = StyleSheet.create({
    icon: {
        width: 30,
        height: 30,
    },
});

export default StoppageMarker;
