import React, { useState, useRef, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    Alert,
    Keyboard,
} from 'react-native';
import {ActivityIndicator} from "react-native";

const OTPVerification = () => {
    const { phone } = useLocalSearchParams();
    const router = useRouter();
    const [otp, setOtp] = useState(['', '', '', '']);
    const [isResending, setIsResending] = useState(false);
    const [timer, setTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const inputRefs = useRef<TextInput[]>([]);
    const [isVerifying, setIsVerifying] = useState(false);


    // Timer countdown
    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        } else {
            setCanResend(true);
        }
    }, [timer]);

    const handleInputChange = (index: number, value: string) => {
        if (value && !/^\d$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 3) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (index: number, key: string) => {
        if (key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleResendOTP = async () => {
        setIsResending(true);
        setCanResend(false);
        setTimer(30);

        try {
            // Simulate API call
            setTimeout(() => {
                setIsResending(false);
                Alert.alert('Success', `OTP has been resent to ${phone || 'your number'}`);
            }, 1000);
        } catch (error) {
            setIsResending(false);
            Alert.alert('Error', 'Failed to resend OTP. Please try again.');
        }
    };

    const handleVerify = () => {
        const otpValue = otp.join('');
        if (otpValue.length === 4) {
            Keyboard.dismiss();
            setIsVerifying(true);
            console.log('Verifying OTP:', otpValue);
            setTimeout(() => {
                        setIsVerifying(false);
                        router.push('/screens/UserDashboard/UserMainScreen')
                        console.log("Otp verified succesfully")
            }, 2000);
        }
    };

    const isComplete = otp.every(digit => digit !== '');

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />



            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>Verify OTP</Text>
                    <Text style={styles.subtitle}>Enter verification code</Text>
                    <Text style={styles.phoneNumber}>
                        Sent to {phone || 'your number'}
                    </Text>
                </View>

                <View style={styles.otpContainer}>
                    {otp.map((digit, index) => (
                        <TextInput
                            key={index}
                            ref={(ref) => {
                                inputRefs.current[index] = ref!;
                            }}
                            style={[
                                styles.otpInput,
                                digit ? styles.otpInputFilled : null
                            ]}
                            value={digit}
                            onChangeText={(value) => handleInputChange(index, value)}
                            onKeyPress={({ nativeEvent }) => handleKeyPress(index, nativeEvent.key)}
                            keyboardType="number-pad"
                            maxLength={1}
                            textAlign="center"
                            selectTextOnFocus
                            autoFocus={index === 0}
                        />
                    ))}
                </View>

                <View style={styles.resendContainer}>
                    <TouchableOpacity
                        onPress={handleResendOTP}
                        disabled={!canResend || isResending}
                        style={[
                            styles.resendButton,
                            (!canResend || isResending) && styles.resendButtonDisabled
                        ]}
                        activeOpacity={0.7}
                    >
                        <Text style={[
                            styles.resendButtonText,
                            (!canResend || isResending) && styles.resendButtonTextDisabled
                        ]}>
                            {isResending
                                ? 'Resending...'
                                : canResend
                                    ? 'Resend OTP'
                                    : `Resend OTP (${timer}s)`}
                        </Text>
                    </TouchableOpacity>
                </View>
                {isVerifying ? (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color="#1f2937" />
                    </View>
                ) : (

                <TouchableOpacity
                    onPress={handleVerify}
                    disabled={!isComplete}
                    style={[
                        styles.verifyButton,
                        !isComplete && styles.verifyButtonDisabled
                    ]}
                    activeOpacity={0.8}
                >
                    <Text style={styles.verifyButtonText}>Verify</Text>
                </TouchableOpacity>
                    )}

                <View style={styles.infoContainer}>
                    <Text style={styles.infoText}>
                        Didn't receive the code? Check your SMS or try again.
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 60,
    },
    header: {
        alignItems: 'center',
        marginBottom: 50,
    },
    title: {
        fontSize: 28,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#6b7280',
        marginBottom: 4,
    },
    phoneNumber: {
        fontSize: 14,
        color: '#9ca3af',
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
        marginBottom: 40,
    },
    otpInput: {
        width: 56,
        height: 56,
        borderWidth: 2,
        borderColor: '#e5e7eb',
        borderRadius: 12,
        fontSize: 20,
        fontWeight: '600',
        color: '#111827',
        backgroundColor: '#ffffff',
    },
    otpInputFilled: {
        borderColor: '#3b82f6',
        backgroundColor: '#f8fafc',
    },
    resendContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    resendButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        backgroundColor: '#f3f4f6',
        borderRadius: 24,
    },
    resendButtonDisabled: {
        backgroundColor: '#f9fafb',
    },
    resendButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
    },
    resendButtonTextDisabled: {
        color: '#9ca3af',
    },
    verifyButton: {
        backgroundColor: '#1f2937',
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        marginBottom: 24,
    },
    verifyButtonDisabled: {
        backgroundColor: '#8b8c8c',
    },
    verifyButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    infoContainer: {
        alignItems: 'center',
    },
    infoText: {
        fontSize: 12,
        color: '#6b7280',
        textAlign: 'center',
        lineHeight: 16,
    },
    backButton: {
        backgroundColor: '#2d3436',
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 10,
    },
    loaderContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        marginBottom: 24,
    },

});

export default OTPVerification;
