import * as Location from "expo-location";

let cachedLocation: Location.LocationObjectCoords | null = null;

export async function requestAndFetchLocation(): Promise<Location.LocationObjectCoords | null> {
    try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            console.warn("Permission to access location was denied");
            return null;
        }
        let loc = await Location.getCurrentPositionAsync({});
        cachedLocation = loc.coords;
        return cachedLocation;
    } catch (error) {
        console.error("Location error:", error);
        return null;
    }
}

export function getCachedLocation(): Location.LocationObjectCoords | null {
    return cachedLocation;
}
