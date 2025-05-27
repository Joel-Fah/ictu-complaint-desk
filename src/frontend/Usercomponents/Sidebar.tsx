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
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
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
