import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollContent: {
        paddingHorizontal: 30,
        paddingVertical: 20,
        paddingBottom: 100, // to prevent last content from hiding behind FAB
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 40,
    },
    logo: {
        width: 70,
        height: 70,
        backgroundColor: '#00b894',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    welcomeContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    fillformText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
    },
    UserDetailText: {
        fontSize: 21,
        fontWeight: 'bold',
        alignItems:'center',
        justifyContent:'center',
        color: '#333',
    },
    sectionContainer: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 20,
        paddingLeft: 5,
    },
    inputWrapper: {
        backgroundColor: 'white',
        borderRadius: 25,
        paddingHorizontal: 20,
        justifyContent: 'center',
        height: 50,
        marginBottom: 15,
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    textInput: {
        fontSize: 16,
        color: '#333',
        paddingVertical: 0,
    },
    toggleContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        backgroundColor: 'white',
        borderRadius: 25,
        padding: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    toggleButton: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 21,
    },
    toggleButtonLeft: {
        marginRight: 2,
    },
    toggleButtonRight: {
        marginLeft: 2,
    },
    toggleButtonActive: {
        backgroundColor: '#151515',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 3,
    },
    toggleText: {
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
    },
    toggleTextActive: {
        color: 'white',
        fontWeight: '600',
    },
    academicRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfWidth: {
        width: '48%',
    },
    dropdownStyle: {
        backgroundColor: '#fff',
        borderRadius: 25,
        height: 55,
        paddingHorizontal: 15,
        justifyContent: 'center',
        borderWidth: 0.5,
        borderColor: '#ccc',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    dropdownText: {
        fontSize: 14,
        color: '#333',
    },
    dropdownPlaceholder: {
        fontSize: 14,
        color: '#999',
    },
    // Enhanced Card Style
    childSummaryCard: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    childName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 6,
    },
    childDetail: {
        fontSize: 15,
        color: '#555',
        marginBottom: 4,
    },
    editText: {
        marginTop: 10,
        color: '#007bff',
        fontWeight: '600',
        fontSize: 15,
    },
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        backgroundColor: '#2d3436',
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
    },
    fabIcon: {
        color: '#fff',
        fontSize: 28,
        fontWeight: 'bold',
    },
    // Done button styling
    doneButton: {
        backgroundColor: '#151515',
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 20,
    },
    doneButtonText: {
        color: 'white',
        fontSize: 17,
        fontWeight: '600',
    },
    cardActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    deleteText: {
        color: '#e74c3c',
        fontWeight: '600',
        fontSize: 15,
    },

});

export default styles;
