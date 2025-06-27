export interface Complaint {
    id: number;
    title: string;
    description: string;
    status: 'Open' | 'In Progress' | 'Resolved' | 'Escalated';
    type: 'Private' | 'Community';
    is_anonymous: boolean;
    slug: string;
    category: string;
    created_at: string;
    course: number; // or full object if you're returning populated data
    updated_at: string;
    semester: string;
    year: number;
    deadline: string;
    student?: number; // or full object if you're returning populated data
    attachments?: Attachment[];
}

export interface Attachment {
    id: number;
    file_url: string; // URL to file
    file_type: string; // e.g., 'image/png', 'application/pdf'
    complaint: number;
    uploaded_at: string;
}
// Payload without attachments (when sending JSON)
export type CreateComplaintJSONPayload = {
    description: string;
    category: string;
    semester: string;
    course: number;
    student?: number;
};

export type CreateComplaintFormDataPayload = CreateComplaintJSONPayload & {
    attachments?: File[]; // Future file uploads
};

