export interface Notification {
    id: number;
    recipient: number;
    message: string;
    is_read: boolean;
    created_at: string; // ISO date string
    updated_at: string; // ISO date string
}
