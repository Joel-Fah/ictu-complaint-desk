// stores/editComplaintStore.ts
import { create } from 'zustand';
import { Complaint } from '@/types/complaint';

interface EditComplaintState {
    complaint: Complaint | null;
    setComplaint: (c: Complaint | null) => void;
}

export const useEditComplaintStore = create<EditComplaintState>((set) => ({
    complaint: null,
    setComplaint: (c) => set({ complaint: c }),
}));
