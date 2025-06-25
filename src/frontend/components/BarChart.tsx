'use client';

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

export function BarChart({ data }: { data: Array<{ semester: string, total_complaints: number }> }) {
  const chartData = {
    labels: data.map(item => item.semester),
    datasets: [{
      label: 'Complaints',
      data: data.map(item => item.total_complaints),
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
    }]
  };

  return <Bar data={chartData} options={{
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Complaints by Semester' }
    }
  }} />;
}