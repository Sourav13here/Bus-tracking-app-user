import React, { useState } from 'react';
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

const router = useRouter();

type UserData = {
    id: string;
    fullName: string;
    phone: string;
    address: string;
    class: string;
    section: string;
    roll_no: string;
};

const UserAccountScreen: React.FC = () => {
    const [isEditing, setIsEditing] = useState(false);

    const [users, setUsers] = useState<UserData[]>([
        {
            id: '1',
            fullName: 'Suman Sharma',
            phone: '+91 9876543210',
            address: 'Guwahati, Assam',
            class: '4',
            section: 'A',
            roll_no: '12',
        },
        {
            id: '2',
            fullName: 'Ananya Sharma',
            phone: '+91 9123456789',
            address: 'Guwahati, Assam',
            class: '2',
            section: 'B',
            roll_no: '5',
        },
    ]);

    const [tempUsers, setTempUsers] = useState<UserData[]>(JSON.parse(JSON.stringify(users)));

    const toggleEdit = () => {
        if (isEditing) {
            setTempUsers(JSON.parse(JSON.stringify(users)));
        }
        setIsEditing(!isEditing);
    };

    const saveChanges = () => {
        setUsers([...tempUsers]);
        setIsEditing(false);
        Alert.alert('Success', 'Changes saved successfully!');
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
            { text: 'Logout', onPress: () => console.log('Logout pressed') },
        ]);
    };

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
                                {isEditing ? (
                                    <TextInput
                                        style={styles.input}
                                        value={user.phone}
                                        onChangeText={(text) =>
                                            handleUserDataChange(user.id, 'phone', text)
                                        }
                                    />
                                ) : (
                                    <Text style={styles.value}>{user.phone}</Text>
                                )}
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
                                    <Text style={[styles.value, styles.multilineValue]}>{user.address}</Text>
                                )}
                            </View>

                            {/* Class & Section */}
                            <View style={styles.classSectionRow}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.label}>Class</Text>
                                    {isEditing ? (
                                        <TextInput
                                            style={styles.input}
                                            value={user.class}
                                            onChangeText={(text) =>
                                                handleUserDataChange(user.id, 'class', text)
                                            }
                                        />
                                    ) : (
                                        <Text style={styles.value}>{user.class}</Text>
                                    )}
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.label}>Section</Text>
                                    {isEditing ? (
                                        <TextInput
                                            style={styles.input}
                                            value={user.section}
                                            onChangeText={(text) =>
                                                handleUserDataChange(user.id, 'section', text)
                                            }
                                        />
                                    ) : (
                                        <Text style={styles.value}>{user.section}</Text>
                                    )}
                                </View>
                            </View>

                            {/* Roll No */}
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Roll No</Text>
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
                        <Text style={[styles.settingText, styles.logoutText]}>Logout</Text>
                        <Ionicons name="chevron-forward" size={16} color="#ccc" />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default UserAccountScreen;
