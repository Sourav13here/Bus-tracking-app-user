import "dotenv/config";

export default {
    expo: {
        name: "Live Bus Tracker",
        slug: "live-bus-tracker",
        version: "1.0.0",
        orientation: "portrait",
        extra: {
            orsApiKey: process.env.EXPO_PUBLIC_ORS_API_KEY,
        },
    },
};
