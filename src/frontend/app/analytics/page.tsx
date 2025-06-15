'use client';

import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface SemesterComplaints {
  semester: string;  // e.g., "Spring 2023", "Fall 2023"
  total_complaints: number;
}

export default function ComplaintsPerSemesterChart() {
  const [chartData, setChartData] = useState<{
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor: string;
      borderWidth: number;
    }[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/analytics/complaints-per-semester/');
        if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
        
        const data: SemesterComplaints[] = await response.json();

        // Transform data for Chart.js
        setChartData({
          labels: data.map(item => item.semester),
          datasets: [{
            label: 'Number of Complaints',
            data: data.map(item => item.total_complaints),
            backgroundColor: 'rgba(59, 130, 246, 0.7)', // Blue with transparency
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 1
          }]
        });

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false 
      },
      title: {
        display: true,
        text: 'Complaints per Semester',
        font: {
          size: 18
        },
        padding: {
          top: 10,
          bottom: 20
        }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return `${context.parsed.y} complaints`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Complaints',
          font: {
            weight: 'bold'
          }
        },
        ticks: {
          precision: 0 
        }
      },
      x: {
        title: {
          display: true,
          text: 'Semester',
          font: {
            weight: 'bold'
          }
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-gray-500">Loading semester data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <strong>Error: </strong> {error}
      </div>
    );
  }

  if (!chartData) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        No semester complaint data available.
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Semester Complaints Overview</h2>
      <div className="h-[450px]"> {/* Fixed height container */}
        <Bar 
          options={options} 
          data={chartData} 
          redraw={true}
        />
      </div>
      <p className="text-sm text-gray-500 mt-2">
        Shows total complaints received per academic semester.
      </p>
    </div>
  );
}