import { useQuery } from "@tanstack/react-query";
import { getAssignmentFromComplaint, getUserById } from "@/lib/api";

export const getEnrichedAssignments = async (complaintId: number) => {
    const assignments = await getAssignmentFromComplaint(complaintId);

    return Promise.all(
        assignments.map(async (a) => {
            const staff = await getUserById(a.staff);
            return {
                user: staff,
                fullName: `${staff.firstName} ${staff.lastName}`,
                picture: staff.picture || " ",
                role: staff.role || "Staff",
                complaintId: complaintId,
            };
        })
    );
};

export function useComplaintAssignments(complaintId: number | undefined) {
    return useQuery({
        queryKey: ["complaintAssignments", complaintId],
        queryFn: () => {
            if (!complaintId) throw new Error("No complaint ID");
            return getEnrichedAssignments(complaintId);
        },
        enabled: !!complaintId,
        staleTime: 60 * 1000,
    });
}
