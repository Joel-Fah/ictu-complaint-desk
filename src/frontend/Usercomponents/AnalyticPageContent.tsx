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
    Legend
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
    const [avgResolutionData, setAvgResolutionData] = useState<ChartData | null>(null);
    const [complaintsPerSemester, setComplaintsPerSemester] = useState<ChartData | null>(null);
    const [complaintsPerCategory, setComplaintsPerCategory] = useState<ChartData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch('/analytics/avg-resolution-time-per-semester/').then(res => res.json()),
            fetch('/analytics/complaints-per-semester').then(res => res.json()),
            fetch('/analytics/complaints-per-category-per-semester').then(res => res.json()),
        ])
            .then(([resTime, perSemester, perCategory]) => {
                setAvgResolutionData(resTime);
                setComplaintsPerSemester(perSemester);
                setComplaintsPerCategory(perCategory);
            })
            .catch(err => console.error('Error fetching analytics:', err))
            .finally(() => setLoading(false));
    }, []);

    const chartOptions = (title: string) => ({
        responsive: true,
        plugins: {
            legend: { position: 'top' as const },
            title: { display: true, text: title }
        }
    });

    const renderChart = (title: string, data: ChartData | null) => {
        if (loading) {
            return (
                <div className="w-full max-w-5xl mx-auto h-64 bg-gray-200 animate-pulse rounded-xl mb-10" />
            );
        }

        if (!data) {
            return (
                <p className="text-gray-500 mb-8 text-center">{title}: No data available.</p>
            );
        }

        return (
            <div className="w-full max-w-5xl mx-auto mb-10 px-4">
                <Bar
                    data={{
                        labels: data.labels,
                        datasets: data.datasets.map((ds, i) => ({
                            ...ds,
                            backgroundColor: `rgba(${54 + i * 50}, ${162 - i * 30}, 235, 0.6)`,
                            borderRadius: 6,
                            barPercentage: 0.6,
                        })),
                    }}
                    options={chartOptions(title)}
                />
            </div>
        );
    };

    return (
        <div className="flex flex-col items-center justify-start px-4 py-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                📊 Analytics
            </h1>

            {renderChart("Average Resolution Time per Semester", avgResolutionData)}
            {renderChart("Complaints per Semester", complaintsPerSemester)}
            {renderChart("Complaints per Category per Semester", complaintsPerCategory)}
        </div>
    );
};

export default AnalyticPageContent;
