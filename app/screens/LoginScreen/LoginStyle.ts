import {StyleSheet} from "react-native";
import LoginScreen from "@/app/screens/LoginScreen/LoginScreen";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    content: {
        flex: 1,
        paddingTop:150,
        paddingHorizontal: 30,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 15,
    },
    logo: {
        width: 80,
        height: 80,
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
        marginBottom: 40,
    },
    loginText: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    welcomeText: {
        fontSize: 18,
        color: '#666',
    },
    inputContainer: {
        marginBottom: 30,
    },
    phoneInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 25,
        paddingHorizontal: 20,
        paddingVertical: 12,
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
    otpButton: {
        backgroundColor: '#2d3436',
        borderRadius: 25,
        paddingVertical: 15,
        alignItems: 'center',
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    otpButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    signUpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:20
    },
    signUpText: {
        fontSize: 16,
        color: '#666',
    },
    signUpLink: {
        fontSize: 17,
        color: '#18a319',
        fontWeight: '600',
    },
    formContainer: {
        justifyContent:'center',
        marginTop:50
    },

});

export default styles