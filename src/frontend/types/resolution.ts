
export interface Resolution {
    id: number;
    complaint_id: number; //
    resolved_by: number; //
    reviewed_by?: number;
    is_reviewed: boolean;
    comments: string;
    created_at: string; // ISO string timestamp from Django
    updated_at: string;

    attendance_mark?: number | null;
    assignment_mark?: number | null;
    ca_mark?: number | null;
    final_mark?: number | null;
}