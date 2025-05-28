import React from "react";

const ComplaintDetailSkeleton: React.FC = () => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-4xl mx-auto animate-pulse">
            {/* Header skeleton */}
            <div className="mb-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>

            {/* Details skeleton */}
            <div className="mb-8">
                <div className="h-6 bg-gray-200 rounded w-20 mb-4"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-gray-50 p-4 rounded-lg">
                            <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                        </div>
                    ))}
                </div>
                <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
            </div>

            {/* Attachments skeleton */}
            <div>
                <div className="h-6 bg-gray-200 rounded w-24 mb-4"></div>
                <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                            <div>
                                <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
                                <div className="h-3 bg-gray-200 rounded w-16"></div>
                            </div>
                        </div>
                        <div className="h-8 bg-gray-200 rounded w-24"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComplaintDetailSkeleton;