
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1A1A1A',
    },
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#1A1A1A',
    },


    visited: {
        opacity: 0.35
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#E5E5E5',
        fontWeight: '500',
    },
    errorText: {
        fontSize: 16,
        color: '#E57373',
        fontWeight: '500',
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    header: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        paddingTop: 44,
        paddingBottom: 12,
        paddingHorizontal: 16,
        backgroundColor: 'transparent',
        zIndex: 1000,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    logoContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: 'rgba(2,2,2,0.29)',
        borderRadius: 25,
        paddingHorizontal: 16,
        paddingVertical: 10,

    },
    profileContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderRadius: 25,
        padding: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    logo: {
        width: 30,
        height: 30,

    },

    companyName: {
        fontSize: 15,
        fontWeight: "700",
        marginLeft: 9,
        color: "#000000",
    },
    profileButton: {
        padding: 0,
    },
    mapContainer: {
        overflow: "hidden",
    },
    map: {
        flex: 1,
    },
    myLocationButton: {
        position: "absolute",
        bottom: 20,
        right: 20,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        borderRadius: 28,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    busesContainer: {
        flex: 1,
        paddingTop: 20,
        backgroundColor: '#FFFFFF',
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: "800",
        color: "#1A1A1A",
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    busListContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    otherBusCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 1,
        borderColor: 'rgba(33, 150, 243, 0.1)',
    },
    busRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    busPicSmall: {
        width: 48,
        height: 48,
        backgroundColor: "#E3F2FD",
        borderRadius: 24,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
        borderWidth: 2,
        borderColor: 'rgba(33, 150, 243, 0.2)',
    },
    busInfo: {
        flex: 1,
    },
    driverRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        marginBottom: 8,
    },
    driverName: {
        fontSize: 16,
        fontWeight: "700",
        color: "#1A1A1A",
    },
    driverNumber: {
        fontSize: 14,
        color: "#666",
        fontWeight: '500',
    },
    busNumberBoxAlt: {
        backgroundColor: "#2196F3",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        alignSelf: "flex-start",
        marginBottom: 8,
    },
    busNumberTextAlt: {
        color: "#FFFFFF",
        fontSize: 12,
        fontWeight: "700",
    },
    routeText: {
        fontSize: 14,
        color: "#666",
        lineHeight: 20,
        fontWeight: '500',
    },
    markerContainer: {
        width: 44,
        height: 42,
        alignItems: 'center',
        justifyContent: 'center',
    },
    markerImage: {
        width:"100%",
        height:"100%",
        resizeMode: 'contain',
    },
    bus_markerContainer:{
        width: 37,
        height: 37,
        alignItems:'center',
        justifyContent:'center',

    },
    bus_markerImage:{
        width:"100%",
        height:"100%",
        resizeMode:"contain",


    }

});

const greyStyle = [
    {
        elementType: "geometry",
        stylers: [{ color: "#f5f7fa" }],
    },



    {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#c1c8d1" }],
    },
    {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#b0b8c1" }],
    },

    {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#a4c4d4" }],
    },

    {
        featureType: "landscape",
        elementType: "geometry",
        stylers: [{ color: "#e6ebf0" }],
    },


    {
        featureType: "transit",
        elementType: "all",
        stylers: [{ visibility: "off" }],
    },



];
export default styles

