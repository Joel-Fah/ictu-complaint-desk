import axios from 'axios';
import { getAccessToken, removeAccessToken } from "@/lib/token";
import {Complaint} from "@/types/complaint";

interface ComplaintResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Complaint[];
}

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
    headers: {
        "Content-Type": "application/json",
    },
});

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
        if (error.response?.status === 401) {
            removeAccessToken();
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// ======= AUTH =======

export const loginUser = async (data: any) => {
    return (await api.put("/auth/login", data)).data;
};

export const updateLogin = async (data: any) => {
    return (await api.patch("/auth/login/", data)).data;
};

export const registerUser = async (data: any) => {
    return (await api.post("/auth/register/", data)).data;
};

export const getUser = async (token: string | null) => {
    const response = await api.get("auth/login/", {
        headers: { Authorization: `Bearer ${token}` },
    });
    const raw = response.data;
    const extra = raw.google_data?.extra_data || {};
    return {
        id: raw.id,
        username: raw.username,
        email: raw.email,
        fullName: extra.name,
        firstName: raw.first_name,
        lastName: extra.family_name || raw.last_name,
        picture: extra.picture || "",
        isStaff: raw.is_staff,
        isSuperuser: raw.is_superuser,
        lastLogin: raw.last_login,
        dateJoined: raw.date_joined,
        googleUid: raw.google_data?.uid || "",
        domain: extra.hd || "",
        profiles: raw.profiles,
    };
};

// ======= CATEGORIES =======

export const getCategories = async () => (await api.get("/categories/")).data;
export const createCategory = async (data: any) => (await api.post("/categories/", data)).data;
export const getCategory = async (id: number | string) => (await api.get(`/categories/${id}/`)).data;
export const updateCategory = async (id: number | string, data: any) => (await api.put(`/categories/${id}/`, data)).data;
export const patchCategory = async (id: number | string, data: any) => (await api.patch(`/categories/${id}/`, data)).data;
export const deleteCategory = async (id: number | string) => (await api.delete(`/categories/${id}/`)).data;

// ======= COMPLAINTS =======
export const getComplaints = async (): Promise<Complaint[]> => {
    try {
        const response = await api.get<ComplaintResponse>('/complaints/');
        return response.data.results;
    } catch (err) {
        console.error('Error fetching complaints:', err);
        throw new Error('Failed to fetch complaints');
    }
};

export const createComplaint = async (data: any) => (await api.post("/complaints/", data)).data;
export const getComplaint = async (id: number | string) => (await api.get(`/complaints/${id}/`)).data;
export const updateComplaint = async (id: number | string, data: any) => (await api.put(`/complaints/${id}/`, data)).data;
export const patchComplaint = async (id: number | string, data: any) => (await api.patch(`/complaints/${id}/`, data)).data;
export const deleteComplaint = async (id: number | string) => (await api.delete(`/complaints/${id}/`)).data;

// ======= NOTIFICATIONS =======

export const getNotifications = async () => (await api.get("/notifications/")).data;
export const createNotification = async (data: any) => (await api.post("/notifications/", data)).data;
export const getNotification = async (id: number | string) => (await api.get(`/notifications/${id}/`)).data;
export const updateNotification = async (id: number | string, data: any) => (await api.put(`/notifications/${id}/`, data)).data;
export const patchNotification = async (id: number | string, data: any) => (await api.patch(`/notifications/${id}/`, data)).data;
export const markNotificationAsRead = async (id: number | string) => (await api.post(`/notifications/${id}/mark_as_read/`)).data;

// ======= REMINDERS =======

export const getReminders = async () => (await api.get("/reminders/")).data;
export const createReminder = async (data: any) => (await api.post("/reminders/", data)).data;
export const getReminder = async (id: number | string) => (await api.get(`/reminders/${id}/`)).data;
export const updateReminder = async (id: number | string, data: any) => (await api.put(`/reminders/${id}/`, data)).data;
export const patchReminder = async (id: number | string, data: any) => (await api.patch(`/reminders/${id}/`, data)).data;
export const deleteReminder = async (id: number | string) => (await api.delete(`/reminders/${id}/`)).data;

// ======= RESOLUTIONS =======

export const getResolutions = async () => (await api.get("/resolutions/")).data;
export const createResolution = async (data: any) => (await api.post("/resolutions/", data)).data;
export const getResolution = async (id: number | string) => (await api.get(`/resolutions/${id}/`)).data;
export const updateResolution = async (id: number | string, data: any) => (await api.put(`/resolutions/${id}/`, data)).data;
export const patchResolution = async (id: number | string, data: any) => (await api.patch(`/resolutions/${id}/`, data)).data;
export const deleteResolution = async (id: number | string) => (await api.delete(`/resolutions/${id}/`)).data;

// ======= USERS =======

export const getUsers = async () => (await api.get("/users/")).data;
export const createUser = async (id: number | string, data: any) => (await api.post(`/users/${id}/`, data)).data;
export const getUserById = async (id: number | string) => (await api.get(`/users/${id}/`)).data;
export const updateUser = async (id: number | string, data: any) => (await api.put(`/users/${id}/`, data)).data;
export const patchUser = async (id: number | string, data: any) => (await api.patch(`/users/${id}/`, data)).data;
export const updateStudentProfile = async (data: { student_number: string }) => {
    return (await api.patch("/users/students/profile/", data)).data;
};


export default api;
