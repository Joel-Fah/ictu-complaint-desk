interface ProfileData {
    id: number;
    student_number: string;
    user: number;
    office: string;
}

interface Profile {
    type: string;
    data: ProfileData;
}

export interface User {
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
    role: 'Student' | 'Lecturer' | 'Admin' | 'Complaint Coordinator';
    secondary_role?: 'Complaint Coordinator' | 'Lecturer' | 'Admin';
    profiles: Profile[];
}