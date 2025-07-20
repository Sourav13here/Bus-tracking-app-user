import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import {
    SafeAreaView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import {Image} from "expo-image";
import styles from "@/app/screens/LoginScreen/LoginStyle";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = () => {
    const [phoneNumber, setPhoneNumber] = useState('');

    const handleGetOTP = async () => {
        if (!phoneNumber || phoneNumber.length !== 10) {
            alert("Please enter a valid 10-digit phone number");
            return;
        }
        try {
            // Call your backend API
            const response = await fetch("http://192.168.38.91:9000/api/request-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    phone: phoneNumber,
                }),
            });

            const data = await response.json();

            if (data.success) {

                // Navigate to OTP screen
                router.push({
                    pathname: "/screens/LoginScreen/LoginOTP/LoginOTPScreen",
                    params: { phone: phoneNumber },
                });
            } else {
                alert(data.message || "Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error(error);
            alert("Network error. Could not connect to server.");
        }

        // Navigate and pass phone number

    };



    const router= useRouter();



    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />

            <View style={styles.content}>

                {/* Logo */}
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../../../assets/images/geekworkxlogo.png')}
                        style={styles.logo}/>
                </View>

                {/* Welcome Text */}
                <View style={styles.welcomeContainer}>
                    <Text style={styles.loginText}>Login</Text>
                    <Text style={styles.welcomeText}>Welcome !</Text>
                </View>
                <View style={styles.formContainer}>
                {/* Phone Input */}
                <View style={styles.inputContainer}>
                    <View style={styles.phoneInputWrapper}>
                        <Text style={styles.countryCode}>+91</Text>
                        <TextInput
                            style={styles.phoneInput}
                            placeholder="Phone No."
                            placeholderTextColor="#999"
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                            keyboardType="phone-pad"
                            maxLength={10}
                        />
                    </View>
                </View>

                {/* Get OTP Button */}
                <TouchableOpacity style={styles.otpButton} onPress={handleGetOTP} activeOpacity={0.8} >
                    <Text style={styles.otpButtonText}>GET OTP</Text>
                </TouchableOpacity>

                {/* Sign Up Link */}

                </View>
            </View>
        </SafeAreaView>
    );
};


export default LoginScreen;