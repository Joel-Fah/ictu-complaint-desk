export interface Complaint {
    id: number;
    title: string;
    description: string;
    status: 'Open' | 'In Progress' | 'Resolved' | 'Escalated' | 'Closed';
    type: 'Private' | 'Community';
    is_anonymous: boolean;
    slug: string;
    category: string;
    created_at: string;
    updated_at: string;
    semester: string;
    year: number;
    deadline: string;
    student?: number; // or full object if you're returning populated data
}

