import { Stack, router } from "expo-router";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SplashScreen from "expo-splash-screen";
import { requestAndFetchLocation } from "@/app/services/locationService";

export default function RootLayout() {
    useEffect(() => {
        const initApp = async () => {
            try {
                await SplashScreen.preventAutoHideAsync();

                // Fetch location (optional)
                requestAndFetchLocation()
                    .then(() => console.log("Location fetched successfully"))
                    .catch((error) => console.error("Error fetching location:", error));

                // Check login status
                const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");
                if (isLoggedIn === "true") {
                    console.log("User already logged in, redirecting...");
                    router.replace("/screens/UserDashboard/UserMainScreen");
                } else {
                    console.log("User not logged in, redirecting to Login...");
                    router.replace("/screens/LoginScreen/LoginScreen");
                }
            } catch (error) {
                console.error("Error during startup:", error);
                router.replace("/screens/LoginScreen/LoginScreen");
            } finally {
                await SplashScreen.hideAsync();
            }
        };

        initApp();
    }, []);

    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="screens/SignupScreen/SignupScreen" options={{ headerShown: false }} />
            <Stack.Screen name="screens/LoginScreen/LoginOTP/LoginOTPScreen" options={{ headerShown: false }} />
            <Stack.Screen name="screens/UserDashboard/UserMainScreen" options={{ headerShown: false }} />
            <Stack.Screen name="screens/AccountPage/AccountPage" options={{ headerShown: false }} />
            <Stack.Screen name="screens/UserProfile/FillFormScreen" options={{ headerShown: false }} />
            <Stack.Screen name="screens/LoginScreen/LoginScreen" options={{ headerShown: false }} />
            <Stack.Screen name="screens/UserDashboard/BusDetailsMap/BusDetails" options={{ headerShown: false }} />

        </Stack>
    );
}
