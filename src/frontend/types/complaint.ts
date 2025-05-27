export interface Attachment {
    id: number;
    file_name: string;
    file_size: number;
    file_type: string;
    file_url: string;
    uploaded_at: string;
}

export interface Complaint {
    id: number;
    title: string;
    category: string;
    semester: string;
    description: string;
    status: 'open' | 'in_progress' | 'escalated' | 'resolved' | 'closed';
    assigned_to?: {
        name: string;
        email: string;
        role: string;
    };
    student: {
        id: number;
        name: string;
        email: string;
        level: string;
    };
    attachments: Attachment[];
    created_at: string;
    updated_at: string;
}
