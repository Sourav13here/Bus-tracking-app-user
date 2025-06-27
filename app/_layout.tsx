import { Stack } from "expo-router";

export default function RootLayout() {
  // @ts-ignore
    return <Stack>
        <Stack.Screen name= "index" options={{headerShown:false}}/>
        <Stack.Screen name= "screens/SignupScreen/SignupScreen" options={{headerShown:false}}/>

    </Stack>


}
