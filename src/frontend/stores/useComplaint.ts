{
    /**
     import { create } from 'zustand';
     import {Complaint} from "@/types/complaint";

     interface ComplaintState {
     selectedComplaint: Complaint | null;
     setSelectedComplaint: (complaint: Complaint) => void;
     clearSelectedComplaint: () => void;
     }

     export const useComplaintStore = create<ComplaintState>((set) => ({
     selectedComplaint: null,
     setSelectedComplaint: (complaint) => set({ selectedComplaint: complaint }),
     clearSelectedComplaint: () => set({ selectedComplaint: null }),
     }));
     **/
}