import axios, {isAxiosError} from 'axios';
import { getAccessToken, removeAccessToken } from "@/lib/token";
import { Complaint, CreateComplaintJSONPayload, CreateComplaintFormDataPayload } from "@/types/complaint";
import {Category} from "@/types/category";
import type { User } from "@/types/user";
import type { NextApiRequest, NextApiResponse } from 'next';
import { validateCategoryWithGemini } from "@/app/utils/geminiValidator";
import { CreateResolutionPayload, Resolution } from "@/types/resolution";

export interface CreateAssignmentPayload {
    complaint: number;
    staff: number;
}

export interface Assignment {
    id: number;
    complaint_id: number;
    staff_id: number;
    assigned_at: string;
}

export interface CreateNotificationPayload {
    recipient_id: number | undefined;
    message: string;
}

export interface Notification {
    id: number;
    recipient_id: number;
    message: string;
    is_read: boolean;
    created_at: string;
    updated_at: string;// or updated_at / created_at
}


interface ComplaintResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Complaint[];
}

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
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
                window.location.href = '/';
            }
        }
        return Promise.reject(error);
    }
);

// ======= AUTH =======
{/**
 export const loginUser = async (data: any) => {
 return (await api.put("/auth/login", data)).data;
 };

 export const updateLogin = async (data: any) => {
 return (await api.patch("/auth/login/", data)).data;
 };

 export const registerUser = async (data: any) => {
 return (await api.post("/auth/register/", data)).data;
 };
 **/}

export const getUser = async (token: string | null): Promise<User> => {
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
        role: raw.role,
        secondary_role: raw.secondary_role || "",
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

export const getCategories = async (): Promise<Category[]> =>
    (await api.get("/categories/")).data;

export const getCategory = async (id: number | string): Promise<Category> =>
    (await api.get(`/categories/${id}/`)).data;
{/**

 export const createCategory = async (data: Partial<Category>) =>
 (await api.post("/categories/", data)).data;

 export const updateCategory = async (id: number | string, data: Partial<Category>) =>
 (await api.put(`/categories/${id}/`, data)).data;

 export const patchCategory = async (id: number | string, data: Partial<Category>) =>
 (await api.patch(`/categories/${id}/`, data)).data;

 export const deleteCategory = async (id: number | string) =>
 (await api.delete(`/categories/${id}/`)).data;

 **/}
// ======= COMPLAINTS =======


export const getComplaints = async (
  page: number = 1,
  pageSize: number = 10
): Promise<ComplaintResponse> => {
  try {
    const response = await api.get<ComplaintResponse>('/complaints/', {
      params: {
        page,
        page_size: pageSize, // or 'limit' depending on your API
      },
    });
    return response.data;
  } catch (err) {
    console.error('Error fetching complaints:', err);
    throw new Error('Failed to fetch complaints');
  }
};

export const getComplaintsByUser = async (userId: number | undefined): Promise<Complaint[]> => {
    try {
        const response = await api.get<ComplaintResponse>(`/complaints/?userId=${userId}`);
        return response.data.results;
    } catch (err) {
        console.error("Error fetching user complaints:", err);
        throw new Error("Failed to fetch user complaints");
    }
};
export const getComplaintsAssigned = async (userId: number | undefined): Promise<Assignment[]> => {
    try {
        const response = await api.get<Assignment[]>(`/assignments/?userId=${userId}`);
        console.log("Raw assignment response:", response.data);
        return response.data; // ✅ it’s already the array
    } catch (err) {
        console.error("Error fetching assignments:", err);
        throw new Error("Failed to fetch user complaints");
    }
};

export interface Assignment {
    id: number;
    complaint: Complaint;
    assigned_at: string;
    reminder_count: number;
    message: string;
    created_at: string;
    updated_at: string;
    staff: number;
}

export const getAssignmentFromComplaint = async (complaintId: number): Promise<Assignment[]> => {
    try {
        const response = await api.get<Assignment[]>(`/assignments/?complaintId=${complaintId}`);
        return response.data;
    } catch (err) {
        console.error("Error fetching complaint assignments:", err);
        throw new Error("Failed to fetch complaint assignments");
    }
};



type ComplaintAPIErrorResponse = {
    detail?: string;
    [key: string]: string[] | string | undefined;
};

export const createComplaint = async (
    data: CreateComplaintJSONPayload | CreateComplaintFormDataPayload
): Promise<Complaint> => {
    try {
        const hasFiles =
            "attachments" in data &&
            Array.isArray(data.attachments) &&
            data.attachments.length > 0;

        if (hasFiles) {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (key === "attachments" && Array.isArray(value)) {
                    value.forEach((file) => formData.append("attachments", file));
                } else {
                    formData.append(key, String(value));
                }
            });

            const response = await api.post<Complaint>("/complaints/", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return response.data;
        } else {
            const response = await api.post<Complaint>("/complaints/", data);
            return response.data;
        }
    } catch (error: unknown) {
        if (isAxiosError<ComplaintAPIErrorResponse>(error) && error.response) {
            console.error("API Error Response:", error.response.data);
        } else if (error instanceof Error) {
            console.error("Unknown Error:", error.message);
        } else {
            console.error("Unexpected error:", error);
        }

        throw error;
    }
};

export const updateComp = async (id: number, data: Partial<Complaint>) =>
    (await api.patch(`/complaints/${id}/`, data)).data;

export const updateComplaint = async (data: {
  id: number;
  category?: number | string;
  semester?: string;
  course?: number;
  deadline?: string;
  status?: string;
  description?: string;
  attachments?: File[];
}) => {
  const response = await api.patch(`/complaints/${data.id}/`, {
    category: data.category,
    deadline: data.deadline,
    semester: data.semester,
    course: data.course,
    status: data.status,
    description: data.description,
    // attachments can be handled separately if using FormData
  });

  return response.data;
};

export const deleteComplaint = async (id: number | string) => (await api.delete(`/complaints/${id}/`)).data;

{/**

 export const getComplaintById = async (id: number): Promise<Complaint> => {
 try {
 const response = await api.get<Complaint>(`/complaints/${id}/`);
 return response.data;
 } catch (err) {
 console.error(`Error fetching complaint with ID ${id}:`, err);
 throw new Error('Failed to fetch complaint');
 }
 };
 export const patchComplaint = async (id: number | string, data: any) => (await api.patch(`/complaints/${id}/`, data)).data;

 **/}
// ======= Courses =======
export const getCourses = async () => (await api.get("/courses/")).data;
{/**
 export const createCourse = async (data: any) => (await api.post("/courses/", data)).data;
 export const getCourse = async (id: number | string) => (await api.get(`/courses/${id}/`)).data;
 export const updateCourse = async (id: number | string, data: any) => (await api.put(`/courses/${id}/`, data)).data;
 export const patchCourse = async (id: number | string, data: any) => (await api.patch(`/courses/${id}/`, data)).data;
 export const deleteCourse = async (id: number | string) => (await api.delete(`/courses/${id}/`)).data;
 **/}
// ======= NOTIFICATIONS =======

export const createNotification = async (data: CreateNotificationPayload): Promise<Notification> => {
    try {
        const response = await api.post("/notifications/", data);
        return response.data;
    } catch (err) {
        console.error("Error creating notification:", err);
        throw new Error("Failed to send notification");
    }
};

export const markNotificationAsRead = async (id: number | string) => (await api.post(`/notifications/${id}/mark_as_read/`)).data;
export const getNotifications = async () => (await api.get("/notifications/")).data;

{/**
 export const getNotification = async (id: number | string) => (await api.get(`/notifications/${id}/`)).data;
 export const updateNotification = async (id: number | string, data: any) => (await api.put(`/notifications/${id}/`, data)).data;
 export const patchNotification = async (id: number | string, data: any) => (await api.patch(`/notifications/${id}/`, data)).data;

 **/}
// ======= REMINDERS =======

{/**
 export const getReminders = async () => (await api.get("/reminders/")).data;
 export const createReminder = async (data: any) => (await api.post("/reminders/", data)).data;
 export const getReminder = async (id: number | string) => (await api.get(`/reminders/${id}/`)).data;
 export const updateReminder = async (id: number | string, data: any) => (await api.put(`/reminders/${id}/`, data)).data;
 export const patchReminder = async (id: number | string, data: any) => (await api.patch(`/reminders/${id}/`, data)).data;
 export const deleteReminder = async (id: number | string) => (await api.delete(`/reminders/${id}/`)).data;
 **/}
// ======= RESOLUTIONS =======

export const createResolution = async (
    data: CreateResolutionPayload
): Promise<Resolution> => {
    try {
        const response = await api.post("/resolutions/", data);
        return response.data;
    } catch (err) {
        console.error("Error creating resolution:", err);
        throw new Error("Failed to create resolution");
    }
};


export const updateResolution = async (
    id: number,
    data: CreateResolutionPayload
): Promise<Resolution> => {
    try {
        const response = await api.patch(`/resolutions/${id}/`, data);
        return response.data;
    } catch (err) {
        console.error("Error updating resolution:", err);
        throw new Error("Failed to update resolution");
    }
};

export const allResolutions = async (): Promise<Resolution[]> => {
    const response = await api.get("/resolutions/");
    return response.data;
};
{/**

 export const getResolution = async (id: number | string) => (await api.get(`/resolutions/${id}/`)).data;
 export const patchResolution = async (id: number | string, data: any) => (await api.patch(`/resolutions/${id}/`, data)).data;
 export const deleteResolution = async (id: number | string) => (await api.delete(`/resolutions/${id}/`)).data;

 **/}
// ======= USERS =======

{/**
 export const createUser = async (id: number | string, data: any) => (await api.post(`/users/${id}/`, data)).data;
 export const updateUser = async (id: number | string, data: any) => (await api.put(`/users/${id}/`, data)).data;
 export const patchUser = async (id: number | string, data: any) => (await api.patch(`/users/${id}/`, data)).data;
 **/}


export const getAllStaff = async (): Promise<User[]> => {
    try {
        const response = await api.get<User[]>("/users/");
        // Filter users with isStaff true
        console.log("Raw staff response:", response.data);
        return response.data.filter((user) => user.role.toLowerCase() === 'admin');
    } catch (err) {
        console.error("Error fetching users:", err);
        throw new Error("Failed to fetch staff users");
    }
};

export const updateStudentProfile = async (data: { student_number: string }) => {
    return (await api.patch("/users/students/profile/", data)).data;
};
export const getUserById = async (id: number | string): Promise<User> => {
    if (!id || isNaN(Number(id))) {
        throw new Error("Invalid user ID passed to getUserById: " + id);
    }
    const raw = (await api.get(`/users/${id}/`)).data;
    const extra = raw.google_data?.extra_data || {};
    return {
        id: raw.id,
        username: raw.username,
        email: raw.email,
        fullName: extra.name || raw.fullName || `${raw.first_name} ${raw.last_name}`,
        firstName: raw.first_name,
        lastName: extra.family_name || raw.last_name,
        picture: extra.picture || raw.picture || "",
        isStaff: raw.is_staff,
        isSuperuser: raw.is_superuser,
        lastLogin: raw.last_login,
        dateJoined: raw.date_joined,
        googleUid: raw.google_data?.uid || "",
        domain: extra.hd || "",
        role: raw.role || "Student",
        secondary_role: raw.secondary_role || "",
        profiles: raw.profiles,
    };
};

// ======== Assignments =======
export const createAssignment = async (data: CreateAssignmentPayload): Promise<Assignment> => {
    console.log("Sending assignment payload:", data); // 👈 Add this
    try {
        const response = await api.post("/assignments/", data);
        return response.data;
    } catch (err) {
        console.error("Error creating assignment:", err);
        throw new Error("Failed to assign staff");
    }
};
// ======= Gemini =======
// pages/api/validateCategory.ts

export async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).end('Method not allowed');

    const { category, description } = req.body;
    if (!category || !description) return res.status(400).json({ error: "Missing data" });

    const result = await validateCategoryWithGemini(category, description);
    return res.status(200).json(result);
}


export default api;
