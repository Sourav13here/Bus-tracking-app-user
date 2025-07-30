/* app/services/directionsService.ts */
import Constants from 'expo-constants';

type LatLng = { latitude: number; longitude: number };

const ORS_KEY = Constants.expoConfig?.extra?.orsApiKey;

export const orsRoute = async (
    points: [number, number][],
): Promise<LatLng[]> => {
    if (!ORS_KEY) throw new Error('❌ ORS key missing');

    const res = await fetch(
        'https://api.openrouteservice.org/v2/directions/driving-car/geojson',
        {
            method: 'POST',
            headers: {
                Authorization: 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjNiYzhkN2YwNTgxMjRiN2I5M2UwYWFiOGFjZGM0OWJjIiwiaCI6Im11cm11cjY0In0=',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ coordinates: points }),
        },
    );

    const data = await res.json();

    return (
        data?.features?.[0]?.geometry?.coordinates?.map(
            ([lng, lat]: number[]) => ({ latitude: lat, longitude: lng }),
        ) || []
    );
};
