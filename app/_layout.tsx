import { Stack } from "expo-router";

export default function RootLayout() {
  // @ts-ignore
    return <Stack>
        <Stack.Screen name= "index" options={{headerShown:false}}/>
        <Stack.Screen name= "screens/SignupScreen/SignupScreen" options={{headerShown:false}}/>
        <Stack.Screen name="screens/LoginScreen/LoginOTP/LoginOTPScreen" options={{headerShown:false}}/>
        <Stack.Screen name="screens/UserDashboard/UserMainScreen" options={{headerShown:false}}/>
        <Stack.Screen name="screens/AccountPage/AccountPage" options={{headerShown:false}}/>
        <Stack.Screen name="screens/UserProfile/FillFormScreen" options={{headerShown:false}}/>
        <Stack.Screen name="screens/LoginScreen/LoginScreen" options={{headerShown:false}}/>




    </Stack>


}
