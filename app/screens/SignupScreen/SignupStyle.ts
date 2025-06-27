import {StyleSheet} from "react-native";
import SignupScreen from "@/app/screens/SignupScreen/SignupScreen";

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollContent: {
        paddingHorizontal: 30,
        paddingVertical: 20,
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 15,
    },
    logo: {
        width: 80,
        height: 80,
        backgroundColor: '#00b894',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    welcomeContainer: {
        alignItems: 'center',
        marginBottom: 60,
    },
    signupText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    welcomeText: {
        fontSize: 18,
        color: '#666',
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
        paddingVertical: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,

    },
    textInput: {
        fontSize: 16,
        color: '#333',
        paddingVertical: 0,
    },
    phoneInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 25,
        paddingHorizontal: 20,
        paddingVertical: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    countryCode: {
        fontSize: 16,
        color: '#333',
        marginRight: 10,
        fontWeight: '500',
    },
    phoneInput: {
        flex: 1,
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
        shadowOffset: {
            width: 0,
            height: 2,
        },
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
        backgroundColor: '#2e2e2e',
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
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
        width: '49%',
    },
    signupButton: {
        backgroundColor: '#2d3436',
        borderRadius: 25,
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    signupButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    loginText: {
        fontSize: 16,
        color: '#666',
    },
    loginLink: {
        fontSize: 17,
        color: '#18a319',
        fontWeight: '600',
    },
    backButton: {
        position: 'absolute',
        backgroundColor:"#2d3436",
        width:50,
        height:50,
        borderRadius:25,
        justifyContent:'center',
        alignItems:'center',
        top: 40,
        left: 20,
        zIndex: 10,
    },

     dropdownWrapper: {
        borderRadius: 25,
        backgroundColor: '#fff',
        height: 55,
        justifyContent: 'center',
        },

    picker: {
        height: 55,
        width: '100%',
        color: '#000',
        fontSize: 16,
    },

    dropdownStyle: {
        borderRadius: 25,
        backgroundColor: '#fff',
        height: 45,
        justifyContent: 'center',
        paddingHorizontal: 15,
    },

    dropdownText: {
        fontSize: 13,
        color: '#333',
        lineHeight:16,
        paddingVertical:0,
        includeFontPadding:false,

    },
    dropdownPlaceholder: {
        fontSize: 13,
        color: '#333',
        lineHeight:16,
        paddingVertical:0,
        includeFontPadding:false,
    },



});
export default style;