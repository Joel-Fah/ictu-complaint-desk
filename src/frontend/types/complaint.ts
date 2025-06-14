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
    attachments?: Attachment[];
}

export interface Attachment {
    id: number;
    file: string; // URL to file
    complaint: number;
    uploaded_at: string;
}
// Payload without attachments (when sending JSON)
export type CreateComplaintJSONPayload = {
    title: string;
    description: string;
    category: string;
    semester: string;
    course: number;
    student?: number;
};

export type CreateComplaintFormDataPayload = CreateComplaintJSONPayload & {
    attachments?: File[]; // Future file uploads
};

