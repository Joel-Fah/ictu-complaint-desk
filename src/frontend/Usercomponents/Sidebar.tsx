import React, { useState } from 'react';
import { ChevronDown, Filter, MessageSquare, Clock, CheckCircle, AlertCircle, Circle } from 'lucide-react';
import Image from 'next/image';


interface Complaint {
  id: number;
  title: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Escalated' | 'Resolved';
  timeAgo: string;
}

const ComplaintsUI = () => {
  const [statusFilter, setStatusFilter] = useState('Open');
  const [valueFilter, setValueFilter] = useState('Value');
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [valueDropdownOpen, setValueDropdownOpen] = useState(false);

  // Sample data - this would come from backend
  const complaints: Complaint[] = [
    {
      id: 4,
      title: "Untitled",
      description: "This complaint was submitted a while ago and the title...",
      status: "Escalated",
      timeAgo: "1 min ago"
    },
    {
      id: 3,
      title: "This complaint was submitted a while ago and the title is quite long",
      description: "This complaint was submitted a while ago and the title...",
      status: "Open",
      timeAgo: "2 mins ago"
    },
    {
      id: 2,
      title: "I just wanted to complain ohh ... Me I just wan testam",
      description: "This complaint was submitted a while ago and the title...",
      status: "In Progress",
      timeAgo: "last week"
    },
    {
      id: 1,
      title: "This is a complaint title that is only one line",
      description: "This complaint was submitted a while ago and the title...",
      status: "Resolved",
      timeAgo: "20/4/2025"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Open':
        return <Circle className="w-3 h-3 text-blue-500" />;
      case 'In Progress':
        return <Clock className="w-3 h-3 text-orange-500" />;
      case 'Escalated':
        return <AlertCircle className="w-3 h-3 text-red-500" />;
      case 'Resolved':
        return <CheckCircle className="w-3 h-3 text-green-500" />;
      default:
        return <Circle className="w-3 h-3 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'text-blue-600 bg-blue-50';
      case 'In Progress':
        return 'text-orange-600 bg-orange-50';
      case 'Escalated':
        return 'text-red-600 bg-red-50';
      case 'Resolved':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen border-l border-r border-gray-200">
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
          <div className="relative">
            <button
              onClick={() => {
                setStatusDropdownOpen(!statusDropdownOpen);
                setValueDropdownOpen(false);
              }}
              className="flex items-center gap-[10px] px-[8px] py-[8px] w-[145px] h-[36px] text-sm border border-primary-950 rounded-[12px] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <span className="text-primary-950 text-opacity-[80%] text-body font-sans">Status:</span>
              <span className="text-primary-950 font-medium font-sans">{statusFilter}</span>
              <Image
             src="/icons/arrow-down-01.svg"
             alt='Dropdown icon'
             height={18}
             width={18}
          /> 
            </button>
            
            {statusDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10">
                {['Open', 'In Progress', 'Escalated', 'Resolved'].map((status) => (
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
          <div className="relative">
            <button
              onClick={() => {
                setValueDropdownOpen(!valueDropdownOpen);
                setStatusDropdownOpen(false);
              }}
              className="flex items-center w-[136px] h-[36px] gap-[10px] px-[8px] py-[8px] text-sm border border-primary-950 rounded-[12px] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <span className="text-gray-600">Filter:</span>
              <span className="text-gray-900">{valueFilter}</span>
              <Image
             src="/icons/arrow-down-01.svg"
             alt='Dropdown icon'
             height={18}
             width={18}
          /> 
            </button>
            
            {valueDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10">
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

        {/* Complaints List */}
        <div className="space-y-3">
          {complaints.map((complaint) => (
            <div
              key={complaint.id}
              className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[18px] leading-[20px] font-heading font-medium text-darkColor">{complaint.id}.</span>
                  <h3 className="text-[18px] font-medium text-darkColor leading-[20px] flex-1 font-sans">
                    {complaint.title}
                  </h3>
                </div>
                <button className="text-gray-400 hover:text-gray-600 ml-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
              </div>
              
              <p className="text-xs text-gray-500 mb-3">{complaint.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(complaint.status)}
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(complaint.status)}`}>
                    {complaint.status}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>{complaint.timeAgo}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Click outside to close dropdowns */}
      {(statusDropdownOpen || valueDropdownOpen) && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => {
            setStatusDropdownOpen(false);
            setValueDropdownOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default ComplaintsUI;

