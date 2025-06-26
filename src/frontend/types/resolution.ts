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
    complaint_id: number;
    resolved_by_id: number;
}

export interface UpdateResolutionPayload extends ResolutionBase {
    resolved_by_id: number;
}

export interface Resolution extends CreateResolutionPayload {
    id: number;
}
