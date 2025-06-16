// app/analytics/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';

export default function AnalyticsPage() {
  const [chartData, setChartData] = useState(null);
  const [filters, setFilters] = useState({
    semester: '',
    startDate: '',
    endDate: ''
  });

  const fetchData = async () => {
    try {
      // Build query params
      const params = new URLSearchParams();
      if (filters.semester) params.append('semester', filters.semester);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const res = await fetch(`/api/analytics/complaints-per-semester?${params}`);
      const data = await res.json();

      setChartData({
        labels: data.map(item => item.semester),
        datasets: [{
          label: 'Complaints',
          data: data.map(item => item.total_complaints),
          backgroundColor: 'rgba(59, 130, 246, 0.7)'
        }]
      });
    } catch (error) {
      console.error("Fetch failed:", error);
    }
  };

  useEffect(() => { fetchData(); }, [filters]);

  return (
    <div className="p-6">
      {/* Filter Controls */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <select
          value={filters.semester}
          onChange={(e) => setFilters({...filters, semester: e.target.value})}
          className="border p-2 rounded"
        >
          <option value="">All Semesters</option>
          <option value="Spring 2023">Spring 2024</option>
          <option value="Fall 2023">Fall 2024</option>
					<option value="Summer 2023">Summer 2024</option>
        </select>
        
        <input
          type="date"
          value={filters.startDate}
          onChange={(e) => setFilters({...filters, startDate: e.target.value})}
          className="border p-2 rounded"
        />
        
        <input
          type="date"
          value={filters.endDate}
          onChange={(e) => setFilters({...filters, endDate: e.target.value})}
          className="border p-2 rounded"
        />
      </div>

      {/* Chart */}
      {chartData ? (
        <Bar 
          data={chartData}
          options={{ responsive: true }}
        />
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
}