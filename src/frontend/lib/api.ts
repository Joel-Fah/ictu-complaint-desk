import axios from 'axios';
import { getAccessToken } from "@/lib/token";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL  || "http://localhost:8000/api",
    headers: {
        "Content-Type": "application/json",
    },
});

export const getUser = async (token: string | null) => {
    try {
        const response = await api.get("auth/user/", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }catch(err) {
        console.log(err);
        throw err;
    }
};

api.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token){
            config.headers["Authorization"] =  `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;