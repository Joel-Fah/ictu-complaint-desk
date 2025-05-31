import { create } from 'zustand';

interface User {
    id: number;
    username: string;
    email: string;
    fullName: string;
    firstName: string;
    lastName: string;
    picture: string;
    isStaff: boolean;
    isSuperuser: boolean;
    lastLogin: string;
    dateJoined: string;
    googleUid: string;
    domain: string;
    role: 'Student' | 'Lecturer' | 'Admin';
}

interface UserState {
    user: User | null;
    setUser: (user: User) => void;
    clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    clearUser: () => set({ user: null }),
}));
