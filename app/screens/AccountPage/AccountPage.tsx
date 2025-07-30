import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    SafeAreaView,
    Alert,
    TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './AccountpageStyle';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchUserProfile } from '@/app/services/api';
import { Dropdown } from 'react-native-element-dropdown';

type UserData = {
    id: string;
    fullName: string;
    address: string;
    class: string;
    section: string;
    roll_no: string;
    selectedType: 'School' | 'College';
};

const schoolClassOptions = [
    { label: 'Class 1', value: '1' },
    { label: 'Class 2', value: '2' },
    { label: 'Class 3', value: '3' },
    { label: 'Class 4', value: '4' },
    { label: 'Class 5', value: '5' },
    { label: 'Class 6', value: '6' },
    { label: 'Class 7', value: '7' },
    { label: 'Class 8', value: '8' },
    { label: 'Class 9', value: '9' },
    { label: 'Class 10', value: '10' },
    { label: 'Class 11', value: '11' },
    { label: 'Class 12', value: '12' },
];

const collegeSemesterOptions = [
    { label: 'Semester 1', value: '1' },
    { label: 'Semester 2', value: '2' },
    { label: 'Semester 3', value: '3' },
    { label: 'Semester 4', value: '4' },
    { label: 'Semester 5', value: '5' },
    { label: 'Semester 6', value: '6' },
    { label: 'Semester 7', value: '7' },
    { label: 'Semester 8', value: '8' },
];

const schoolSectionOptions = [
    { label: 'A', value: 'A' },
    { label: 'B', value: 'B' },
    { label: 'C', value: 'C' },
    { label: 'D', value: 'D' },
];

const collegeDeptOptions = [
    { label: 'CSE', value: 'CSE' },
    { label: 'ME', value: 'ME' },
    { label: 'EE', value: 'EE' },
    { label: 'CE', value: 'CE' },
];

const UserAccountScreen: React.FC = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [tempUsers, setTempUsers] = useState<UserData[]>([]);
    const [phone, setPhone] = useState<string>('');
    const router = useRouter();

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const storedPhone = await AsyncStorage.getItem('phone');
                if (!storedPhone) {
                    Alert.alert('Error', 'No phone number found.');
                    router.replace('/screens/LoginScreen/LoginScreen');
                    return;
                }

                const userData = await fetchUserProfile(storedPhone);
                console.log("Loaded userData:", JSON.stringify(userData, null, 2));

                setPhone(userData.phone || '');
                setUsers(userData.children || []);
                setTempUsers(userData.children || []);
            } catch (err) {
                console.error('Fetch profile error:', err);
                Alert.alert('Error', 'Failed to load profile.');
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, []);

    const toggleEdit = () => {
        if (isEditing) {
            setTempUsers(JSON.parse(JSON.stringify(users)));
        }
        setIsEditing(!isEditing);
    };

    const saveChanges = async () => {
        try {
            const storedPhone = await AsyncStorage.getItem('phone');
            if (!storedPhone) throw new Error('No phone number found');

            const payload = {
                phone: storedPhone,
                children: tempUsers.map((u) => ({
                    name: u.fullName,
                    address: u.address,
                    selectedType: u.selectedType,
                    classValue: u.class,
                    section: u.section,
                    rollNo: u.roll_no,
                })),
            };

            const response = await fetch('http://192.168.39.204:9000/api/complete-profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (!data.success) throw new Error(data.message);

            setUsers([...tempUsers]);
            setIsEditing(false);
            Alert.alert('Success', 'Changes saved successfully!');
        } catch (err) {
            console.error('Save profile error:', err);
            Alert.alert('Error', (err as Error).message || 'Failed to save profile.');
        }
    };

    const handleUserDataChange = (
        userId: string,
        field: keyof UserData,
        value: string
    ) => {
        setTempUsers((prev) => {
            const index = prev.findIndex((u) => u.id === userId);
            if (index === -1) return prev;

            const updatedUsers = [...prev];
            updatedUsers[index] = { ...updatedUsers[index], [field]: value };
            return updatedUsers;
        });
    };

    const handleLogout = () => {
        Alert.alert('Logout', 'Are you sure you want to logout?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Logout',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await AsyncStorage.multiRemove(['phone', 'isLoggedIn']);                        
                        router.replace('/screens/LoginScreen/LoginScreen');
                    } catch (error) {
                        console.error('Logout error:', error);
                        Alert.alert('Error', 'Failed to log out. Please try again.');
                    }
                },
            },
        ]);
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Loading...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1b1a1a" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.headerButton}
                    onPress={() => router.push('/screens/UserDashboard/UserMainScreen')}
                >
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>User Account</Text>

                <TouchableOpacity style={styles.headerButton} onPress={toggleEdit}>
                    <Ionicons
                        name={isEditing ? 'close' : 'create-outline'}
                        size={24}
                        color="white"
                    />
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {tempUsers.map((user, index) => (
                    <View key={user.id} style={styles.infoCard}>
                        <View style={styles.cardHeader}>
                            <Ionicons name="person" size={20} color="#4A90E2" />
                            <Text style={styles.cardTitle}>
                                User Information {index + 1}
                            </Text>
                        </View>

                        <View style={styles.cardContent}>
                            {/* Full Name */}
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Full Name</Text>
                                {isEditing ? (
                                    <TextInput
                                        style={styles.input}
                                        value={user.fullName}
                                        onChangeText={(text) =>
                                            handleUserDataChange(user.id, 'fullName', text)
                                        }
                                    />
                                ) : (
                                    <Text style={styles.value}>{user.fullName}</Text>
                                )}
                            </View>

                            {/* Phone */}
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Phone Number</Text>
                                <Text style={styles.value}>{phone}</Text>
                            </View>

                            {/* Address */}
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Address</Text>
                                {isEditing ? (
                                    <TextInput
                                        style={[styles.input, styles.textArea]}
                                        value={user.address}
                                        onChangeText={(text) =>
                                            handleUserDataChange(user.id, 'address', text)
                                        }
                                        multiline
                                        numberOfLines={3}
                                    />
                                ) : (
                                    <Text style={[styles.value, styles.multilineValue]}>
                                        {user.address}
                                    </Text>
                                )}
                            </View>

                            {/* Class & Section Dropdown */}
                            <View style={styles.classSectionRow}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.label}>
                                        {user.selectedType === 'College' ? 'Semester' : 'Class'}
                                    </Text>
                                    {isEditing ? (
                                        <Dropdown
                                            style={styles.dropdown}
                                            data={
                                                user.selectedType === 'College'
                                                    ? collegeSemesterOptions
                                                    : schoolClassOptions
                                            }
                                            labelField="label"
                                            valueField="value"
                                            value={user.class}
                                            placeholder="Select"
                                            onChange={(item) =>
                                                handleUserDataChange(user.id, 'class', item.value)
                                            }
                                        />
                                    ) : (
                                        <Text style={styles.value}>{user.class}</Text>
                                    )}
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.label}>
                                        {user.selectedType === 'College' ? 'Department' : 'Section'}
                                    </Text>
                                    {isEditing ? (
                                        <Dropdown
                                            style={styles.dropdown}
                                            data={
                                                user.selectedType === 'College'
                                                    ? collegeDeptOptions
                                                    : schoolSectionOptions
                                            }
                                            labelField="label"
                                            valueField="value"
                                            value={user.section}
                                            placeholder="Select"
                                            onChange={(item) =>
                                                handleUserDataChange(user.id, 'section', item.value)
                                            }
                                        />
                                    ) : (
                                        <Text style={styles.value}>{user.section}</Text>
                                    )}
                                </View>
                            </View>

                            {/* Roll No */}
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>
                                    {user.selectedType === 'College' ? 'Student ID' : 'Roll No'}
                                </Text>
                                {isEditing ? (
                                    <TextInput
                                        style={styles.input}
                                        value={user.roll_no}
                                        onChangeText={(text) =>
                                            handleUserDataChange(user.id, 'roll_no', text)
                                        }
                                    />
                                ) : (
                                    <Text style={styles.value}>{user.roll_no}</Text>
                                )}
                            </View>
                        </View>
                    </View>
                ))}

                {isEditing && (
                    <View style={styles.actionButtons}>
                        <TouchableOpacity style={styles.saveButton} onPress={saveChanges}>
                            <Ionicons name="checkmark" size={20} color="white" />
                            <Text style={styles.buttonText}>Save Changes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cancelButton} onPress={toggleEdit}>
                            <Ionicons name="close" size={20} color="white" />
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <View style={styles.settingsSection}>
                    <TouchableOpacity style={styles.settingItem}>
                        <Ionicons name="help-circle" size={20} color="#4A90E2" />
                        <Text style={styles.settingText}>Help & Support</Text>
                        <Ionicons name="chevron-forward" size={16} color="#ccc" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.settingItem, styles.logoutItem]}
                        onPress={handleLogout}
                    >
                        <Ionicons name="log-out" size={20} color="#dc3545" />
                        <Text style={[styles.settingText, styles.logoutText]}>
                            Logout
                        </Text>
                        <Ionicons name="chevron-forward" size={16} color="#ccc" />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default UserAccountScreen;
