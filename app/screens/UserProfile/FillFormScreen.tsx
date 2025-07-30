import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { BackHandler, Image, TextInput } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
    SafeAreaView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
    ScrollView,
} from 'react-native';
import style from './FillFormStyle';

// Define the Child type
interface Child {
    name: string;
    address: string;
    selectedType: 'School' | 'College';
    classValue: string;
    section: string;
    rollNo: string;
}

const FillFormScreen: React.FC = () => {
    const [children, setChildren] = useState<Child[]>([]);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [selectedType, setSelectedType] = useState<'School' | 'College'>('School');
    const [classValue, setClassValue] = useState('');
    const [section, setSection] = useState('');
    const [rollNo, setRollNo] = useState('');

    const router = useRouter();

    useEffect(() => {
        const backAction = () => true;
        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
        return () => backHandler.remove();
    }, []);

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

    const collegeDeptOptions = [
        { label: 'CSE', value: 'CSE' },
        { label: 'ME', value: 'ME' },
        { label: 'EE', value: 'EE' },
        { label: 'CE', value: 'CE' },
    ];

    const schoolSectionOptions = [
        { label: 'A', value: 'A' },
        { label: 'B', value: 'B' },
        { label: 'C', value: 'C' },
        { label: 'D', value: 'D' },
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

    const clearForm = () => {
        setName('');
        setAddress('');
        setSelectedType('School');
        setClassValue('');
        setSection('');
        setRollNo('');
        setEditingIndex(null);
    };

    const handleAddOrUpdate = () => {
        if (!name || !address || !classValue || !section || !rollNo) {
            alert('Please fill all fields');
            return;
        }
        const newChild: Child = { name, address, selectedType, classValue, section, rollNo };
        if (editingIndex !== null) {
            const updated = [...children];
            updated[editingIndex] = newChild;
            setChildren(updated);
        } else {
            setChildren([...children, newChild]);
        }
        clearForm();
    };

    const handleEdit = (index: number) => {
        const child = children[index];
        setName(child.name);
        setAddress(child.address);
        setSelectedType(child.selectedType);
        setClassValue(child.classValue);
        setSection(child.section);
        setRollNo(child.rollNo);
        setEditingIndex(index);
    };

    const handleDelete = (index: number) => {
        const updated = [...children];
        updated.splice(index, 1);
        setChildren(updated);
    };

    const handleDone = async () => {
        // If no saved children but form has data, auto-add it
        if (children.length === 0 && name && address && classValue && section && rollNo) {
            const newChild: Child = { name, address, selectedType, classValue, section, rollNo };
            setChildren([newChild]);
            // Also clear form after adding
            clearForm();
        }

        // After adding if needed, check again
        const childrenToSend = children.length > 0 ? children : (name && address && classValue && section && rollNo ? [{
            name, address, selectedType, classValue, section, rollNo
        }] : []);

        if (childrenToSend.length === 0) {
            alert('Please add at least one user before proceeding.');
            return;
        }

        const phone = await AsyncStorage.getItem("phone",);
        if (!phone) {
            alert("Phone number not found. Please log in again.");
            return;
        }

        try {
            const response = await fetch("http://192.168.39.204:9000/api/complete-profile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    phone,
                    children: childrenToSend,
                }),
            });

            const data = await response.json();

            if (data.success) {
                router.push("/screens/UserDashboard/UserMainScreen");
            } else {
                alert(data.message || "Error saving profile.");
            }
        } catch (error) {
            console.error("API error:", error);
            alert("Server error. Please try again.");
        }
    };




    return (
        <SafeAreaView style={style.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
            <ScrollView contentContainerStyle={style.scrollContent}>
                <View style={style.logoContainer}>
                    <Image
                        source={require('../../../assets/images/geekworkxlogo.png')}
                        style={style.logo}
                    />
                </View>

                <View style={style.welcomeContainer}>
                    <Text style={style.fillformText}>Fill all the Details</Text>
                </View>

                <View style={style.sectionContainer}>
                    <View style={style.inputWrapper}>
                        <TextInput
                            style={style.textInput}
                            placeholder="Full Name"
                            placeholderTextColor="#999"
                            value={name}
                            onChangeText={setName}
                        />
                    </View>
                    <View style={style.inputWrapper}>
                        <TextInput
                            style={style.textInput}
                            placeholder="Address"
                            placeholderTextColor="#999"
                            value={address}
                            onChangeText={setAddress}
                        />
                    </View>
                </View>

                <View style={style.sectionContainer}>
                    <Text style={style.sectionTitle}>Academic Information</Text>

                    <View style={style.toggleContainer}>
                        <TouchableOpacity
                            style={[
                                style.toggleButton,
                                style.toggleButtonLeft,
                                selectedType === 'School' && style.toggleButtonActive,
                            ]}
                            onPress={() => {
                                setSelectedType('School');
                                setClassValue('');
                                setSection('');
                            }}
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
                            onPress={() => {
                                setSelectedType('College');
                                setClassValue('');
                                setSection('');
                            }}
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

                    <View style={style.academicRow}>
                        <View style={style.halfWidth}>
                            <Dropdown
                                style={style.dropdownStyle}
                                placeholderStyle={style.dropdownPlaceholder}
                                selectedTextStyle={style.dropdownText}
                                data={selectedType === 'School' ? schoolClassOptions :collegeSemesterOptions }
                                labelField="label"
                                valueField="value"
                                placeholder={selectedType === 'School' ? 'Class' : 'Semester'}
                                value={classValue}
                                onChange={(item) => setClassValue(item.value)}
                            />
                        </View>
                        <View style={style.halfWidth}>
                            <Dropdown
                                style={style.dropdownStyle}
                                placeholderStyle={style.dropdownPlaceholder}
                                selectedTextStyle={style.dropdownText}
                                data={selectedType === 'School' ? schoolSectionOptions :collegeDeptOptions }
                                labelField="label"
                                valueField="value"
                                placeholder={selectedType === 'School' ? 'Section' : 'Department'}
                                value={section}
                                onChange={(item) => setSection(item.value)}
                            />
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

                {children.map((child, index) => (
                    <View key={index}>
                        <Text style={style.UserDetailText}>User Details</Text>
                        <View style={style.childSummaryCard}>
                            <Text style={style.childName}>{child.name}</Text>
                            <Text style={style.childDetail}>
                                {child.selectedType === 'School'
                                    ? `Class ${child.classValue} - ${child.section}`
                                    : `${child.classValue} - Semester ${child.section}`}
                            </Text>
                            <Text style={style.childDetail}>
                                {child.selectedType === 'School'
                                    ? `Roll No: ${child.rollNo}`
                                    : `Student ID: ${child.rollNo}`}
                            </Text>
                            <View style={style.cardActions}>
                                <TouchableOpacity onPress={() => handleEdit(index)}>
                                    <Text style={style.editText}>Edit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleDelete(index)}>
                                    <Text style={style.deleteText}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                ))}

                <TouchableOpacity style={style.doneButton} onPress={handleDone}>
                    <Text style={style.doneButtonText}>Done</Text>
                </TouchableOpacity>
            </ScrollView>

            <TouchableOpacity style={style.fab} onPress={handleAddOrUpdate}>
                <Text style={style.fabIcon}>+</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default FillFormScreen;
