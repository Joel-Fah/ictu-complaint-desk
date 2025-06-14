<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { ChevronDown, Filter, MessageSquare, MoreHorizontal, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Complaint {
  id: number;
  title: string;
  description: string;
  status: 'open' | 'escalated' | 'in-progress' | 'resolved';
  timeAgo: string;
  priority?: 'low' | 'medium' | 'high';
}

const Sidebar: React.FC = () => {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<string>('Open');
  const [priorityFilter, setPriorityFilter] = useState<string>('Value');
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([]);

  const complaints: Complaint[] = [
    {
      id: 4,
      title: 'Untitled',
      description: 'This complaint was submitted a while ago and the title...',
      status: 'escalated',
      timeAgo: '1min ago',
      priority: 'high'
    },
    {
      id: 3,
      title: 'This complaint was submitted a while ago and the title is quite long',
      description: 'This complaint was submitted a while ago and the title...',
      status: 'open',
      timeAgo: '2mins ago',
      priority: 'medium'
    },
    {
      id: 2,
      title: 'I just wanted to complain ohh ... Me I just wan testam',
      description: 'This complaint was submitted a while ago and the title...',
      status: 'in-progress',
      timeAgo: 'last week',
      priority: 'low'
    },
    {
      id: 1,
      title: 'This is a complaint title that is only one line',
      description: 'This complaint was submitted a while ago and the title...',
      status: 'resolved',
      timeAgo: '29/4/2025',
      priority: 'medium'
    }
  ];

  useEffect(() => {
    const result = complaints.filter(complaint => {
      const statusMatch = statusFilter === 'Open' || 
                         getStatusText(complaint.status) === statusFilter;
      const priorityMatch = priorityFilter === 'Value' || 
                          complaint.priority === priorityFilter.toLowerCase();
      return statusMatch && priorityMatch;
    });
    setFilteredComplaints(result);
  }, [statusFilter, priorityFilter]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'escalated': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'in-progress': return <Clock className="w-4 h-4 text-orange-500" />;
      case 'resolved': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <Clock className="w-4 h-4 text-blue-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'escalated': return 'Escalated';
      case 'in-progress': return 'In Progress';
      case 'resolved': return 'Resolved';
      default: return 'Open';
=======
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
>>>>>>> 7b32ef82e65d2cafc28c764b5d04e1ff63c5d65d
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
<<<<<<< HEAD
      case 'escalated': return 'text-red-600 bg-red-50';
      case 'in-progress': return 'text-orange-600 bg-orange-50';
      case 'resolved': return 'text-green-600 bg-green-50';
      default: return 'text-blue-600 bg-blue-50';
    }
  };

  const handleComplaintClick = (complaintId: number) => {
    router.push(`/complaints/${complaintId}`);
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 h-screen flex flex-col">
      {/* Filters Section */}
      <div className="p-4 border-b border-dashed border-blue-300 bg-blue-50">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-gray-600" />
          <span className="font-medium text-gray-800">Filters</span>
        </div>
        
        <div className="flex gap-2">
          <div className="relative">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded px-3 py-1.5 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Open</option>
              <option>Escalated</option>
              <option>In Progress</option>
              <option>Resolved</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-500 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            <span className="absolute -top-1 left-2 text-xs text-gray-500 bg-white px-1">Status:</span>
          </div>
          
          <div className="relative">
            <select 
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded px-3 py-1.5 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Value</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-500 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            <span className="absolute -top-1 left-2 text-xs text-gray-500 bg-white px-1">Priority:</span>
          </div>
        </div>
      </div>

      {/* My Complaints Section */}
      <div className="flex-1 overflow-auto">
        <div className="p-4 border-b border-dashed border-blue-300">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-gray-800">My Complaints</span>
            <span className="ml-auto text-xs text-gray-500">
              {filteredComplaints.length} items
            </span>
          </div>
        </div>

        {/* Complaints List */}
        <div className="divide-y divide-gray-100">
          {filteredComplaints.map((complaint) => (
            <div 
              key={complaint.id} 
              className="p-4 hover:bg-gray-50 cursor-pointer border-b border-dashed border-blue-200"
              onClick={() => handleComplaintClick(complaint.id)}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium text-gray-800 text-sm">{complaint.id}.</span>
                <button 
                  className="text-gray-400 hover:text-gray-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle more options click
                  }}
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
              
              <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
                {complaint.title}
              </h3>
              
              <p className="text-gray-500 text-xs mb-3 line-clamp-1">
                {complaint.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                  {getStatusIcon(complaint.status)}
                  {getStatusText(complaint.status)}
                </div>
                
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  {complaint.timeAgo}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
=======
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
>>>>>>> 7b32ef82e65d2cafc28c764b5d04e1ff63c5d65d
