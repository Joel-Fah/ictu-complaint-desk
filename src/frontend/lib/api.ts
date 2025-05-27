import axios from 'axios';
import {getAccessToken, removeAccessToken} from "@/lib/token";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// export const logout = async () => {
//     try {
//         const response = await api.post('auth/logout/', {}, {
//             headers: {
//                 Authorization: `Bearer ${getAccessToken()}`,
//             },
//         });
//
//         if (response.status === 200) {
//             removeAccessToken();
//             window.location.href = '/';
//         } else {
//             console.error('Logout failed:', response.statusText);
//         }
//     } catch (error) {
//         console.error('An error occurred during logout:', error);
//     }
// }

export const getUser = async (token: string | null) => {
    try {
        const response = await api.get("auth/login/", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const raw = response.data;
        const extra = raw.google_data?.extra_data || {};

        return {
            id: raw.id,
            username: raw.username,
            email: raw.email,
            fullName: extra.name || `${raw.first_name} ${raw.last_name}`,
            firstName: extra.given_name || raw.first_name,
            lastName: extra.family_name || raw.last_name,
            picture: extra.picture || "",
            isStaff: raw.is_staff,
            isSuperuser: raw.is_superuser,
            lastLogin: raw.last_login,
            dateJoined: raw.date_joined,
            googleUid: raw.google_data?.uid || "",
            domain: extra.hd || "",
        };

    } catch (err) {
        console.log(err);
        throw err;
    }
};

api.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            removeAccessToken();
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;