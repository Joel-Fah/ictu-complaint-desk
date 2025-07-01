'use client';

import React, { useEffect, useState, useMemo, useRef } from 'react';
import Image from 'next/image';
import { Complaint } from "@/types/complaint";
import { formatComplaintDate } from "@/lib/formatDate";
import { useUserStore } from "@/stores/userStore";
import ToastNotification from './ToastNotifications';
import { toast } from 'sonner';
import { Assignment, deleteComplaint } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useEditComplaintStore } from '@/stores/editComplaintStore';
import { useComplaints } from "@/hooks/useComplaints";
import { useUserComplaints } from "@/hooks/useUserComplaints";
import { useComplaintsAssigned } from "@/hooks/useComplaintsAssigned";
import { useQueryClient } from "@tanstack/react-query";

interface ComplaintsUIProps {
  onSelectItem: (item: Complaint, count: number) => void;
  statusFilter: string;
}

const pageSize = 10;

const ComplaintsUI = ({ onSelectItem, statusFilter }: ComplaintsUIProps) => {
  const queryClient = useQueryClient();
  const [selectedComplaintId, setSelectedComplaintId] = useState<number | null>(null);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [valueDropdownOpen, setValueDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const router = useRouter();
  const setComplaintToEdit = useEditComplaintStore((s) => s.setComplaint);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const userId = useUserStore((s) => s.user?.id);
  const activeRole = useUserStore((s) => s.activeRoleTab);

  // Call all hooks unconditionally
  const { data: userComplaintsData, isLoading: isLoadingUser, isError: isErrorUser, error: errorUser } = useUserComplaints(userId);
  const { data: assignedComplaintsData, isLoading: isLoadingAssigned, isError: isErrorAssigned, error: errorAssigned } = useComplaintsAssigned(userId);
  const { data: allComplaintsData, isLoading: isLoadingAll, isError: isErrorAll, error: errorAll } = useComplaints(currentPage, pageSize);

  // Memoize complaints based on role and data dependencies
  const complaints = useMemo(() => {
    if (activeRole === "student") {
      return userComplaintsData ?? [];
    } else if (["lecturer", "admin"].includes(activeRole)) {
      return (assignedComplaintsData ?? []).map((a: Assignment) =>
          typeof a.complaint === "object" ? a.complaint : ({} as Complaint)
      );
    } else {
      return allComplaintsData?.results ?? [];
    }
  }, [activeRole, userComplaintsData, assignedComplaintsData, allComplaintsData]);

  const count = complaints.length;

  // Select error/loading state based on role
  let isLoading: boolean;
  let isError: boolean;
  let error: unknown;

  if (activeRole === "student") {
    isLoading = isLoadingUser;
    isError = isErrorUser;
    error = errorUser;
  } else if (["lecturer", "admin"].includes(activeRole)) {
    isLoading = isLoadingAssigned;
    isError = isErrorAssigned;
    error = errorAssigned;
  } else {
    isLoading = isLoadingAll;
    isError = isErrorAll;
    error = errorAll;
  }


  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
          menuRef.current &&
          !menuRef.current.contains(event.target as Node)
      ) {
        setOpenMenuId(null);
      }
    }
    if (openMenuId !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuId]);

  const totalPages = Math.ceil(count / pageSize);

  const filteredComplaints = useMemo(() => {
    return statusFilter === 'All'
        ? complaints
        : complaints.filter(c => c.status === statusFilter);
  }, [complaints, statusFilter]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Open':
        return <Image src='/icons/status.svg' alt="Open complaint icon" width={12} height={12} />;
      case 'In Progress':
        return <Image src='/icons/loading-02.svg' alt="In-progress complaint icon" width={12} height={12} />;
      case 'Escalated':
        return <Image src='/icons/help-circle-red.svg' alt="Escalated complaint icon" width={12} height={12} />;
      case 'Resolved':
        return <Image src='/icons/target-02.svg' alt="Resolved complaint icon" width={12} height={12} />;
      default:
        return <Image src='/icons/status.svg' alt="Status icon" width={12} height={12} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'escalated': return 'text-red-600 bg-red-50';
      case 'in-progress':
      case 'in progress': return 'text-orange-600 bg-orange-50';
      case 'resolved': return 'text-green-600 bg-green-50';
      case 'open': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this complaint?");
    if (!confirmDelete) return;

    try {
      await deleteComplaint(id);
      toast.custom(t =>
              <ToastNotification
                  type="success"
                  title="Complaint deleted"
                  subtitle="It has been removed successfully"
                  onClose={() => toast.dismiss(t)}
                  showClose
              />,
          { duration: 4000 }
      );
      // Trigger React Query re-fetch
      await queryClient.invalidateQueries({ queryKey: ["complaints"] });
      await queryClient.invalidateQueries({ queryKey: ["complaints-by-user"] });
      await queryClient.invalidateQueries({ queryKey: ["complaints-assigned"] });
    } catch {
      toast.custom(t =>
              <ToastNotification
                  type="error"
                  title="Failed to delete complaint"
                  subtitle="Please try again later"
                  onClose={() => toast.dismiss(t)}
                  showClose
              />,
          { duration: 4000 }
      );
    }
  };

  const handleEdit = (complaintId: number) => {
    const complaint = complaints.find(c => c.id === complaintId);
    if (!complaint) return;

    setComplaintToEdit(complaint);
    router.push('/new');
  };

  return (
      <div className="md:fixed md:left-0 md:top-[72px] md:bottom-0 md:w-[320px] w-full bg-[#050041] bg-opacity-[5%] min-h-screen md:border-r border-gray-200 z-0">
        {(statusDropdownOpen || valueDropdownOpen) && (
            <div
                className="fixed inset-0 z-10"
                onClick={() => {
                  setStatusDropdownOpen(false);
                  setValueDropdownOpen(false);
                }}
            />
        )}

        <div className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Image src="/icons/megaphone-02.svg" alt="Megaphone" width={24} height={24} />
            <h2 className="text-h2 font-semibold text-primary-950">My Complaints</h2>
          </div>
        </div>
        {isLoading && (
            <div className="flex justify-center items-center py-8">
              <span>Loading complaints...</span>
            </div>
        )}
        {isError && (
            <div className="flex justify-center items-center py-4 text-red-600">
              <span>Error loading complaints: {error instanceof Error ? error.message : 'Unknown error'}</span>
            </div>
        )}
        {!isLoading && !error && (
            <div className="space-y-3 max-h-[calc(100vh-250px)] overflow-y-auto pr-2 rounded-[20px]">
              {filteredComplaints.slice().reverse().map((complaint, index) => {
                const complaintCount = filteredComplaints.length - index;
                return (
                    <div
                        key={complaint.id}
                        onClick={() => {
                          onSelectItem(complaint, complaintCount);
                          setSelectedComplaintId(complaint.id);
                        }}
                        className={`px-[16px] py-[21px] rounded-[20px] transition-all duration-300 cursor-pointer mb-1.5 ${
                            selectedComplaintId === complaint.id
                                ? 'bg-white shadow-lg'
                                : 'hover:bg-white hover:shadow-lg'
                        }`}
                    >
                      <div className="flex items-center gap-2">
                  <span className="text-[18px] leading-[20px] font-heading font-medium text-darkColor">
                    {complaintCount}.
                  </span>
                        <h3 className="text-[18px] font-medium text-darkColor leading-[20px] flex-1 font-sans">
                          {complaint.title}
                        </h3>
                      </div>
                      <div className="relative">
                        <button
                            className="ml-2"
                            onClick={e => {
                              e.stopPropagation();
                              setOpenMenuId(openMenuId === complaint.id ? null : complaint.id);
                            }}
                        >
                          <Image
                              src="/icons/more-horizontal.svg"
                              alt="Options"
                              width={30}
                              height={30}
                          />
                        </button>
                        {openMenuId === complaint.id && (
                            <div className="absolute right-0 mt-2 w-28 bg-white rounded shadow-lg z-30 flex flex-col">
                              {complaint.status !== 'Resolved' && (
                                  <button
                                      className="px-4 py-2 text-left hover:bg-gray-100"
                                      onClick={e => {
                                        e.stopPropagation();
                                        setOpenMenuId(null);
                                        handleEdit(complaint.id);
                                      }}
                                  >
                                    Edit
                                  </button>
                              )}
                              <button
                                  className="px-4 py-2 text-left hover:bg-gray-100 text-red-600"
                                  onClick={e => {
                                    e.stopPropagation();
                                    setOpenMenuId(null);
                                    handleDelete(complaint.id);
                                  }}
                              >
                                Delete
                              </button>
                            </div>
                        )}
                      </div>
                      <p className="text-[14px] ml-6 text-greyColor font-sans mb-3 truncate whitespace-nowrap overflow-hidden text-ellipsis pr-8">
                        {new DOMParser().parseFromString(complaint.description, 'text/html').body.textContent || ''}
                      </p>
                      <div className="flex items-center justify-between ml-6">
                        <div className="flex items-center gap-2">
                    <span className={`text-xs font-sans flex flex-row items-center justify-center px-[6px] py-[3px] gap-1 rounded-[8px] ${getStatusColor(complaint.status)}`}>
                      <div>{getStatusIcon(complaint.status)}</div>
                      {complaint.status}
                    </span>
                          <div className="flex items-center gap-1 text-xs text-[#050041] text-opacity-[50%] font-sans">
                            <Image src="/icons/clock-02.svg" alt="Clock" width={12} height={12} />
                            <span>{formatComplaintDate(complaint.created_at)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                );
              })}
            </div>
        )}

        {/* Pagination (not for student/admin/lecturer) */}
        {!['student', 'admin', 'lecturer'].includes(activeRole) && totalPages > 1 && (
            <div className="flex justify-center mt-4">
              <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 mx-1 rounded bg-gray-200 disabled:opacity-50"
              >
                Prev
              </button>
              {[...Array(totalPages)].map((_, i) => (
                  <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 mx-1 rounded ${currentPage === i + 1 ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}
                  >
                    {i + 1}
                  </button>
              ))}
              <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 mx-1 rounded bg-gray-200 disabled:opacity-50"
              >
                Next
              </button>
            </div>
        )}
      </div>
  );
};

export default ComplaintsUI;