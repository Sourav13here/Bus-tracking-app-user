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

const LoginScreen = () => {
    const [phoneNumber, setPhoneNumber] = useState('');

    const handleGetOTP = () => {
        // Handle OTP request logic here
        console.log('Requesting OTP for:', phoneNumber);
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
                    <Text style={styles.welcomeText}>Welcome Back!</Text>
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
                <View style={styles.signUpContainer}>
                    <Text style={styles.signUpText}>Don't have an account? </Text>
                    <TouchableOpacity onPress={()=>router.push('../screens/SignupScreen/SignupScreen')}>
                        <Text style={styles.signUpLink}>Sign up</Text>
                    </TouchableOpacity>
                 </View>
                </View>
            </View>
        </SafeAreaView>
    );
};


export default LoginScreen;