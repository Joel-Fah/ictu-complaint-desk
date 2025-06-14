import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Complaint } from "@/types/complaint";
import { getComplaints } from '@/lib/api';
import { formatComplaintDate } from "@/lib/formatDate";
import axios from "axios";

interface ComplaintsUIProps {
  onSelectItem: (item: Complaint) => void;
}

const ComplaintsUI = ({ onSelectItem }: ComplaintsUIProps) => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [selectedComplaintId, setSelectedComplaintId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState('Open');
  const [valueFilter, setValueFilter] = useState('Value');
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [valueDropdownOpen, setValueDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const data = await getComplaints();
        if (Array.isArray(data)) {
          setComplaints(data);
        } else {
          console.error('Invalid response:', data);
          setError('Unexpected data format');
        }
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          console.error('Axios error:', err.message);
          setError(err.response?.data?.detail || 'Failed to fetch complaints');
        } else {
          console.error('Unexpected error:', err);
          setError('An unexpected error occurred');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const filteredComplaints = statusFilter === 'All'
      ? complaints
      : complaints.filter(c => c.status === statusFilter);

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
        return <Image src='/icons/status.svg' alt="Open complaint icon" width={12} height={12} />;
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
      {/* Overlay: Put it BEFORE dropdowns so it’s behind them */}
        {(statusDropdownOpen || valueDropdownOpen) && (
            <div
                className="fixed inset-0 z-10"
                onClick={() => {
                  setStatusDropdownOpen(false);
                  setValueDropdownOpen(false);
                }}
            />
        )}

        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Image
                src="/icons/preference-horizontal.svg"
                alt='Filter icon'
                height={24}
                width={24}
            />
            <span className="text-h2 font-semibold text-primary-950">Filters</span>
          </div>

          {/* Filter Dropdowns */}
          <div className="flex gap-2">
            {/* Status Filter */}
            <div className="relative z-[5]">
              <button
                  onClick={() => {
                    setStatusDropdownOpen(!statusDropdownOpen);
                    setValueDropdownOpen(false);
                  }}
                  className="flex items-center gap-[10px] px-[8px] py-[8px] w-[145px] h-[36px] text-sm border border-primary-950 rounded-[12px] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <span className="text-primary-950 text-opacity-[80%] text-body font-sans">Status:</span>
                <span className="text-primary-950 font-medium font-sans truncate text-ellipsis">{statusFilter}</span>
                <Image
                    src="/icons/arrow-down-01.svg"
                    alt='Dropdown icon'
                    height={18}
                    width={18}
                />
              </button>

              {statusDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-20">
                    {['All', 'Open', 'In Progress', 'Escalated', 'Resolved'].map((status) => (
                        <button
                            key={status}
                            onClick={() => {
                              setStatusFilter(status);
                              setStatusDropdownOpen(false);
                            }}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                        >
                          {status}
                        </button>
                    ))}
                  </div>
              )}
            </div>

            {/* Value Filter */}
            <div className="relative z-[5]">
              <button
                  onClick={() => {
                    setValueDropdownOpen(!valueDropdownOpen);
                    setStatusDropdownOpen(false);
                  }}
                  className="flex items-center w-[136px] h-[36px] gap-[10px] truncate px-[8px] py-[8px] text-sm border border-primary-950 rounded-[12px] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <span className="text-gray-600">Filter:</span>
                <span className="text-gray-900 truncate overflow-hidden text-ellipsis">{valueFilter}</span>
                <Image
                    src="/icons/arrow-down-01.svg"
                    alt='Dropdown icon'
                    height={18}
                    width={18}
                />
              </button>

              {valueDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-20">
                    {['Value', 'Date', 'Priority', 'Category'].map((filter) => (
                        <button
                            key={filter}
                            onClick={() => {
                              setValueFilter(filter);
                              setValueDropdownOpen(false);
                            }}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                        >
                          {filter}
                        </button>
                    ))}
                  </div>
              )}
            </div>
          </div>
        </div>

        {/* My Complaints Section */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Image
                src="/icons/megaphone-02.svg"
                alt='Megaphone icon'
                height={24}
                width={24}
            />
            <h2 className="text-h2 font-semibold text-primary-950">My Complaints</h2>
          </div>

          {isLoading && <p className="p-4 text-gray-500">Loading complaints...</p>}
          {error && <p className="p-4 text-red-500">{error}</p>}

          {/* Complaints List */}
          <div className="space-y-3 max-h-[calc(100vh-250px)] overflow-y-auto pr-2 rounded-[20px]">
            {filteredComplaints.slice().reverse().map((complaint, index) => (
                <div
                    key={complaint.id}
                    onClick={() => {
                      onSelectItem(complaint);
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
                    {filteredComplaints.length - index}.
                </span>
                      <h3 className="text-[18px] font-medium text-darkColor leading-[20px] flex-1 font-sans">
                        {complaint.title}
                      </h3>
                    </div>
                    <button className="ml-2">
                      <Image
                          src="/icons/more-horizontal.svg"
                          alt="Option icon"
                          height={24}
                          width={24}
                      />
                    </button>
                  </div>

                  <p className="text-[14px] ml-6 text-greyColor font-sans mb-3 truncate whitespace-nowrap overflow-hidden text-ellipsis pr-8">
                    {new DOMParser().parseFromString(complaint.description, "text/html").body.textContent || ""}
                  </p>

                  <div className="flex items-center justify-between ml-6">
                    <div className="flex items-center gap-2">
                <span className={`text-xs font-sans flex flex-row items-center justify-center px-[6px] py-[3px] gap-1 rounded-[8px] ${getStatusColor(complaint.status)}`}>
                    <div>{getStatusIcon(complaint.status)}</div>
                  {complaint.status}
                </span>
                      <div className="flex items-center gap-1 text-xs text-[#050041] text-opacity-[50%] font-sans">
                        <Image
                            src="/icons/clock-02.svg"
                            alt="Clock icon"
                            height={12}
                            width={12}
                        />
                        <span>{formatComplaintDate(complaint.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>
            ))}
          </div>
        </div>
      </div>
  );
};

export default ComplaintsUI;
