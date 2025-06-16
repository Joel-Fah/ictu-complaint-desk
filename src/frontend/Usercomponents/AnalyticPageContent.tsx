'use client';

import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type ChartData = {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor?: string;
        borderRadius?: number;
        barPercentage?: number;
    }[];
};
  


const AnalyticPageContent = () => {
    const [chartData, setChartData] = useState<ChartData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/analytics/avg-resolution-time-per-semester/')
            .then((res) => res.json())
            .then((data) => {
                setChartData(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' as const },
            title: {
                display: true,
                text: 'Average Resolution Time per Semester',
            },
        },
    };

    return (
        <div style={{ maxWidth: 700, margin: '0 auto', padding: 32 }}>
            <h1 className="text-2xl font-bold mb-4">Analytics Dashboard</h1>
            <h2 className="text-lg font-semibold mb-6">Average Resolution Time per Semester</h2>

            {loading && <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />}

            {!loading && chartData && (
                <Bar
                    data={{
                        labels: chartData.labels,
                        datasets: chartData.datasets.map((ds, i) => ({
                            ...ds,
                            backgroundColor: `rgba(${54 + i * 50}, ${162 - i * 40}, 235, 0.6)`,
                            borderRadius: 6,
                            barPercentage: 0.6,
                        })),
                    }}
                    options={options}
                />
            )}


            {!loading && !chartData && <p className="text-gray-500">No data available.</p>}
        </div>
    );
}
export default AnalyticPageContent;
