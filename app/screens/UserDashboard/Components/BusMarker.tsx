// components/BusMarker.tsx

import React from 'react';
import { View, Image } from 'react-native';
import { Marker } from 'react-native-maps';

interface BusMarkerProps {
    latitude: number;
    longitude: number;
    busName: string;
    driverName: string;
    driverPhone: string;
    imageSource: any;
    markerStyle: object;
}

const BusMarker: React.FC<BusMarkerProps> = ({
                                                 latitude,
                                                 longitude,
                                                 busName,
                                                 driverName,
                                                 driverPhone,
                                                 imageSource,
                                                 markerStyle
                                             }) => (
    <Marker
        coordinate={{ latitude, longitude }}
title={`Bus #${busName}`}
description={`Driver: ${driverName}`}
>
<View style={markerStyle}>
<Image source={imageSource} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />
</View>
</Marker>
);

export default BusMarker;
