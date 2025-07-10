export async function fetchUserProfile(phone:string) {
    const url = `http://192.168.190.91:9000/api/profile?phone=${encodeURIComponent(phone)}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.success) {
        return data.user;
    } else {
        throw new Error(data.message || "Failed to fetch profile.");
    }
}