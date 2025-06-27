import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import {Picker} from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import style from './SignupStyle';
import { Dropdown } from 'react-native-element-dropdown';

import{
    SafeAreaView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ScrollView,
} from 'react-native';
import styles from "@/app/screens/LoginScreen/LoginStyle";
import {Image} from "expo-image";

const SignUpScreen = () => {
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [selectedType, setSelectedType] = useState('School');
    const [classValue, setClassValue] = useState('');
    const [section, setSection] = useState('');
    const [rollNo, setRollNo] = useState('');

    const handleSignUp = () => {
        console.log('Creating account with:', {
            name,
            phoneNumber,
            selectedType,
            classValue,
            section,
            rollNo,
        });
    };

    const handleLogin = () => {
        console.log('Navigate to login');
    };

    const router= useRouter();

          //for picker(dropdown)
    const schoolSectionOptions = ['A', 'B', 'C'];

    const collegeSemesterOptions = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];


// class list,department list,Section list and Semester list
    const classList = [
        'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
        'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
        'Class 11', 'Class 12'
    ];
    const departmentList = ['CSE', 'ME', 'ETE', 'CE'];
    const SectionList=['A','B','C'];
    const SemesterList=['1st','2nd','3rd','4th','5th','6th','7th','8th']


// Convert to { label, value } format for dropdown
    const schoolClassOptions = classList.map(item => ({ label: item, value: item }));
    const collegeDeptOptions = departmentList.map(item => ({ label: item, value: item }));
    const SectionOptions=  SectionList.map(item=>({label:item,value:item}));
    const SemesterOptions=SemesterList.map(item=>({label:item,value:item}));





    return (
        <SafeAreaView style={style.container}>
            <StatusBar barStyle="light-content" backgroundColor="#f5f5f5" />

            <ScrollView contentContainerStyle={style.scrollContent} showsVerticalScrollIndicator={true}>

                {/* back button */}

                <TouchableOpacity style={style.backButton} onPress={()=>router.back()}>
                    <Ionicons name="arrow-back"
                              size={28}
                              color= "white"/>
                </TouchableOpacity>

                {/* Logo */}
                <View style={style.logoContainer}>
                    <Image
                        source={require('../../../assets/images/geekworkxlogo.png')}
                        style={styles.logo}/>
                </View>


                {/* Signup text */}

                <View style={style.welcomeContainer}>
                    <Text style={style.signupText}>Sign Up</Text>
                    <Text style={style.welcomeText}>Create Your Account</Text>
                </View>

                {/* Personal Information Section */}
                <View style={style.sectionContainer}>
                    <Text style={style.sectionTitle}>Personal Information</Text>

                    {/* Name Input */}
                    <View style={style.inputWrapper}>
                        <TextInput
                            style={style.textInput}
                            placeholder="Full Name"
                            placeholderTextColor="#999"
                            value={name}
                            onChangeText={setName}
                        />
                    </View>

                    {/* Phone Input */}
                    <View style={style.phoneInputWrapper}>
                        <Text style={style.countryCode}>+91</Text>
                        <TextInput
                            style={style.phoneInput}
                            placeholder="Phone Number"
                            placeholderTextColor="#999"
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                            keyboardType="phone-pad"
                            maxLength={10}
                        />
                    </View>
                </View>

                {/* Academic Information Section */}
                <View style={style.sectionContainer}>
                    <Text style={style.sectionTitle}>Academic Information</Text>

                    {/* Institution Type Selection */}
                    <View style={style.toggleContainer}>
                        <TouchableOpacity
                            style={[
                                style.toggleButton,
                                style.toggleButtonLeft,
                                selectedType === 'School' && style.toggleButtonActive,
                            ]}
                            onPress={() => setSelectedType('School')}
                        >
                            <Text
                                style={[
                                    style.toggleText,
                                    selectedType === 'School' && style.toggleTextActive,
                                ]}
                            >
                                School
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                style.toggleButton,
                                style.toggleButtonRight,
                                selectedType === 'College' && style.toggleButtonActive,
                            ]}
                            onPress={() => setSelectedType('College')}
                        >
                            <Text
                                style={[
                                    style.toggleText,
                                    selectedType === 'College' && style.toggleTextActive,
                                ]}
                            >
                                College
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Academic Details */}
                    <View style={style.academicRow}>
                        <View style={[style.inputWrapper, style.halfWidth, { paddingVertical: 0 }]}>
                            <View style={style.dropdownWrapper}>
                                <Dropdown
                                    style={style.dropdownStyle}
                                    data={selectedType === 'School' ? schoolClassOptions : collegeDeptOptions}
                                    labelField="label"
                                    valueField="value"
                                    placeholder={selectedType === 'School' ? 'Class' : 'Department'}
                                    value={classValue}
                                    onChange={(item) => setClassValue(item.value)}
                                    selectedTextStyle={style.dropdownText}
                                    placeholderStyle={style.dropdownPlaceholder}

                                />

                            </View>
                        </View>

                        <View style={[style.inputWrapper, style.halfWidth, { paddingVertical: 0 }]}>
                            <View style={style.dropdownWrapper}>
                                <Dropdown
                                    style={style.dropdownStyle}
                                    data={selectedType === 'School' ? SectionOptions: SemesterOptions}
                                    labelField="label"
                                    valueField="value"
                                    placeholder={selectedType === 'School' ? 'Section' : 'Semester'}
                                    value={classValue}
                                    onChange={(item) => setClassValue(item.value)}
                                    selectedTextStyle={style.dropdownText}
                                    placeholderStyle={style.dropdownPlaceholder}

                                />

                            </View>
                        </View>
                    </View>

                    <View style={style.inputWrapper}>
                        <TextInput
                            style={style.textInput}
                            placeholder={selectedType === 'School' ? 'Roll Number' : 'Student ID'}
                            placeholderTextColor="#999"
                            value={rollNo}
                            onChangeText={setRollNo}
                        />
                    </View>
                </View>

                {/* Sign Up Button */}
                <TouchableOpacity
                    style={style.signupButton}
                    onPress={handleSignUp}
                    activeOpacity={0.9}
                >
                    <Text style={style.signupButtonText}>CREATE ACCOUNT</Text>
                </TouchableOpacity>

                {/* Login Link */}
                <View style={style.loginContainer}>
                    <Text style={style.loginText}>Already have an account? </Text>
                    <TouchableOpacity onPress={()=> router.push('/')}>
                        <Text style={style.loginLink}>Login</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};



export default SignUpScreen;