import React, { useState, useEffect } from 'react';
import { ChevronDown, Filter, MessageSquare, Clock, AlertCircle, CheckCircle, MoreHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Complaint {
  id: number;
  title: string;
  description: string;
  status: 'open' | 'escalated' | 'in-progress' | 'resolved' | 'Open' | 'In Progress' | 'Escalated' | 'Resolved';
  timeAgo: string;
  priority?: 'low' | 'medium' | 'high';
}

interface ComplaintsUIProps {
  onSelectItem?: (id: number) => void;
}

const ComplaintsUI: React.FC<ComplaintsUIProps> = ({ onSelectItem }) => {
  const router = useRouter();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [selectedComplaintId, setSelectedComplaintId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [priorityDropdownOpen, setPriorityDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data - replace with your actual data fetching
  useEffect(() => {
    const mockComplaints: Complaint[] = [
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

    setComplaints(mockComplaints);
    setIsLoading(false);
  }, []);

  const filteredComplaints = complaints.filter(complaint => {
    const statusMatch = statusFilter === 'All' || 
                      getStatusText(complaint.status) === statusFilter;
    const priorityMatch = priorityFilter === 'All' || 
                        complaint.priority === priorityFilter.toLowerCase();
    return statusMatch && priorityMatch;
  });

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'escalated': 
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'in-progress': 
      case 'in progress':
        return <Clock className="w-4 h-4 text-orange-500" />;
      case 'resolved': 
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'open': 
        return <MessageSquare className="w-4 h-4 text-blue-500" />;
      default: 
        return <MessageSquare className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'escalated': return 'Escalated';
      case 'in-progress': 
      case 'in progress': return 'In Progress';
      case 'resolved': return 'Resolved';
      default: return 'Open';
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

  const handleComplaintClick = (complaintId: number) => {
    setSelectedComplaintId(complaintId);
    if (onSelectItem) {
      onSelectItem(complaintId);
    } else {
      router.push(`/complaints/${complaintId}`);
    }
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 h-screen flex flex-col">
      {/* Filters Section */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <span className="font-medium text-gray-800 text-lg">Filters</span>
        </div>
        
        <div className="flex gap-2">
          {/* Status Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setStatusDropdownOpen(!statusDropdownOpen);
                setPriorityDropdownOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-1.5 w-36 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50"
            >
              <span className="text-gray-500">Status:</span>
              <span className="text-gray-800">{statusFilter}</span>
              <ChevronDown className="w-4 h-4 text-gray-500 ml-auto" />
            </button>
            
            {statusDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10">
                {['All', 'Open', 'In Progress', 'Escalated', 'Resolved'].map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setStatusFilter(status);
                      setStatusDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                  >
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Priority Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setPriorityDropdownOpen(!priorityDropdownOpen);
                setStatusDropdownOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-1.5 w-36 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50"
            >
              <span className="text-gray-500">Priority:</span>
              <span className="text-gray-800">{priorityFilter}</span>
              <ChevronDown className="w-4 h-4 text-gray-500 ml-auto" />
            </button>
            
            {priorityDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10">
                {['All', 'High', 'Medium', 'Low'].map((priority) => (
                  <button
                    key={priority}
                    onClick={() => {
                      setPriorityFilter(priority);
                      setPriorityDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                  >
                    {priority}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* My Complaints Section */}
      <div className="flex-1 overflow-auto">
        <div className="p-4 border-b border-gray-200">
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
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Loading complaints...</div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">{error}</div>
          ) : filteredComplaints.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No complaints found</div>
          ) : (
            filteredComplaints.map((complaint) => (
              <div 
                key={complaint.id} 
                className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                  selectedComplaintId === complaint.id ? 'bg-blue-50' : ''
                }`}
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
            ))
          )}
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(statusDropdownOpen || priorityDropdownOpen) && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => {
            setStatusDropdownOpen(false);
            setPriorityDropdownOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default ComplaintsUI;