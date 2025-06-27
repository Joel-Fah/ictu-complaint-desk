export interface ResolutionBase {
    attendance_mark?: number;
    assignment_mark?: number;
    ca_mark?: number;
    final_mark?: number;
    comments?: string;
    is_reviewed?: boolean;
    reviewed_by?: number;
}


export interface CreateResolutionPayload extends ResolutionBase {
    complaint: number;          // ✅ match backend field name
}
export interface Resolution extends CreateResolutionPayload {
    id: number;
}
