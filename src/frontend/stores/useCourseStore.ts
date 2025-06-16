import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getCourses } from "@/lib/api";

type Lecturer = {
    id: number;
    user: number;
};

type Course = {
    id: number;
    code: string;
    title: string;
    semester: string;
    year: number;
    lecturer: Lecturer;
};

type CourseState = {
    courses: Course[];
    loading: boolean;
    fetchCourses: () => Promise<void>;
};

export const useCourseStore = create(
    persist<CourseState>(
        (set) => ({
            courses: [],
            loading: false,
            fetchCourses: async () => {
                set({ loading: true });
                try {
                    const data = await getCourses(); // Should return the nested structure
                    set({ courses: data });
                } catch (error) {
                    console.error("Failed to fetch courses:", error);
                } finally {
                    set({ loading: false });
                }
            },
        }),
        {
            name: "course-store",
        }
    )
);