import { StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#1b1a1a',
        paddingHorizontal: 10,
        paddingVertical: 15,
        paddingTop: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1b1a1a", // or any background you like
    },
    loadingText: {
        fontSize: 16,
        color: "#fff",
    },

    dropdown: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        paddingHorizontal: 12,
        height: 48,
        justifyContent: 'center',
        marginTop: 4,
    },

    headerButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },

    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: 'white',
    },

    scrollContainer: {
        flex: 1,
    },

    profileSection: {
        backgroundColor: 'white',
        paddingVertical: 30,
        paddingHorizontal: 20,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },

    driverName: {
        fontSize: 22,
        fontWeight: '600',
        color: '#333',
        marginBottom: 5,
    },

    driverId: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
    },

    infoCard: {
        backgroundColor: 'white',
        marginHorizontal: 20,
        marginTop: 15,
        borderRadius: 12,
        borderWidth:1,
        borderColor:"black",
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },

    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#f8f9fa',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },

    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginLeft: 10,
    },

    cardContent: {
        padding: 20,
    },

    infoRow: {
        marginBottom: 20,
    },

    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#555',
        marginBottom: 6,
    },

    value: {
        fontSize: 15,
        color: '#333',
        backgroundColor: '#f8f9fa',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },

    multilineValue: {
        minHeight: 60,
        textAlignVertical: 'top',
    },

    input: {
        fontSize: 15,
        color: '#333',
        backgroundColor: 'white',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#4A90E2',
    },

    textArea: {
        minHeight: 80,
        textAlignVertical: 'top',
    },

    actionButtons: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 20,
        gap: 10,
    },

    saveButton: {
        flex: 1,
        backgroundColor: '#4A90E2',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 8,
        elevation: 2,
        shadowColor: '#4A90E2',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },

    cancelButton: {
        flex: 1,
        backgroundColor: '#6c757d',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 8,
        elevation: 2,
        shadowColor: '#6c757d',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },

    buttonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
        marginLeft: 8,
    },

    settingsSection: {
        backgroundColor: 'white',
        marginHorizontal: 20,
        marginTop: 15,
        marginBottom: 20,
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },

    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 18,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    classSectionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },

    settingText: {
        flex: 1,
        fontSize: 15,
        fontWeight: '500',
        color: '#333',
        marginLeft: 15,
    },

    logoutItem: {
        borderBottomWidth: 0,
    },

    logoutText: {
        color: '#dc3545',
    },
});

export default styles;
