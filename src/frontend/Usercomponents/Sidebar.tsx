'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { Complaint } from "@/types/complaint";
import { getComplaintsByUser, getComplaints, getComplaintsAssigned } from '@/lib/api';
import { formatComplaintDate } from "@/lib/formatDate";
import { useUserStore } from "@/stores/userStore";

interface ComplaintsUIProps {
  onSelectItem: (item: Complaint, count: number) => void;
  statusFilter: string;
}

const pageSize = 10;

const ComplaintsUI = ({ onSelectItem, statusFilter }: ComplaintsUIProps) => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [selectedComplaintId, setSelectedComplaintId] = useState<number | null>(null);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [valueDropdownOpen, setValueDropdownOpen] = useState(false);
  const [count, setCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const userId = useUserStore((s) => s.user?.id);
  const activeRole = useUserStore((s) => s.activeRoleTab);

  useEffect(() => {
    const fetchComplaints = async () => {
      if (!userId || !activeRole) return;

      setIsLoading(true);
      setError(null);

      try {
        if (activeRole === 'student') {
          const data = await getComplaintsByUser(userId);
          setComplaints(data);
          setCount(data.length);
        } else if (["lecturer", "admin"].includes(activeRole)) {
          const assignments = await getComplaintsAssigned(userId);
          const uniqueComplaintsMap = new Map<number, Complaint>();
          assignments.forEach((a) => {
            if (a.complaint?.id) {
              uniqueComplaintsMap.set(a.complaint.id, a.complaint);
            }
          });
          const uniqueComplaints = Array.from(uniqueComplaintsMap.values());
          setComplaints(uniqueComplaints);
          setCount(uniqueComplaints.length);
        } else {
          const res = await getComplaints(currentPage, pageSize);
          setComplaints(res.results);
          setCount(res.count);
        }
      } catch {
        setError('Failed to fetch complaints');
      } finally {
        setIsLoading(false);
      }
    };

    fetchComplaints();
  }, [activeRole, userId, currentPage]);

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
    switch (status) {
      case 'Open':
        return 'text-info bg-primary-50';
      case 'In Progress':
        return 'text-warning bg-[#F49200] bg-opacity-[10%]';
      case 'Escalated':
        return 'text-error bg-[#DB4437] bg-opacity-[10%]';
      case 'Resolved':
        return 'text-success bg-[#0F9D58] bg-opacity-[10%]';
      default:
        return 'text-info bg-primary-50';
    }
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

          {isLoading && <p className="p-4 text-gray-500">Loading complaints...</p>}
          {error && <p className="p-4 text-red-500">{error}</p>}

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
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                    <span className="text-[18px] leading-[20px] font-heading font-medium text-darkColor">
                      {complaintCount}.
                    </span>
                        <h3 className="text-[18px] font-medium text-darkColor leading-[20px] flex-1 font-sans">
                          {complaint.title}
                        </h3>
                      </div>
                      <button className="ml-2">
                        <Image
                            src="/icons/more-horizontal.svg"
                            alt="Options"
                            width={24}
                            height={24}
                        />
                      </button>
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
      </div>
  );
};

export default ComplaintsUI;
