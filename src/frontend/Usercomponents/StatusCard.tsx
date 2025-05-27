import React from 'react';
import Image from 'next/image';

interface AssignedPerson {
    name: string;
    role: string;
    imageUrl: string;
}

interface StatusCardProps {
    status: string;
    statusColor: '#DB4437' | '#4285F4' | '#0F9D58' | '#F49200';
    description: string;
    assignedTo: AssignedPerson[];
}

const StatusCard: React.FC<StatusCardProps> = ({
    status,
    description,
    assignedTo
}) => {
    const getStatusStyles = () => {
        switch (status.toLowerCase()) {
            case 'escalated':
                return 'bg-red-100 border-error text-error';
            case 'in progress':
                return 'bg-yellow-50 border-warning text-warning';
            case 'resolved':
                return 'bg-green-50 border-success text-success';
            default:
                return 'bg-primary-50 border-info text-info';
        }
    };

    const getStatusIcon = () => {
        switch (status.toLowerCase()) {
            case 'escalated':
                return '/icons/help-circle-red.svg';
            case 'in progress':
                return '/icons/loading-02.svg';
            case 'resolved':
                return '/icons/target-02.svg';
            default:
                return '/icons/status.svg';
        }
    };

    return (
        <div className="max-w-[265px] mx-auto">
            {/* Status Section */}
            <div className="mb-6">
                <h2 className="text-h3 font-heading text-greyColor mb-4">Status</h2>
                <div className={`border-[1px] border-dashed rounded-[16px] p-[10px] gap-2 ${getStatusStyles()} w-[265px] h-[58px]`}>
                    <div className="flex items-center justify-center gap-[8px] mt-1">
                            <Image
                                src={getStatusIcon()}
                                alt={`${status} icon`}
                                width={24}
                                height={24}
                            />
                        
                        <span className={`text-h3 font-medium capitalize font-heading ${getStatusStyles()}`}>{status}</span>
                    </div>
                </div>
                <p className="text-greyColor text-small mt-1 leading-relaxed">
                    {description}
                </p>
            </div>

            {/* Separator */}
            <hr className="border-gray-200 mb-6" />

            {/* Assigned To Section */}
            <div>
                <h2 className="text-h3 font-heading font-medium text-greyColor mb-2">Assigned to:</h2>
                <p className="text-greyColor text-small mb-4">
                    This complaint was assigned to the following administrative entities
                </p>

                <div className="space-y-4">
                    {assignedTo.map((person, index) => (
                        <div key={index} className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 relative">
                                <Image
                                    src={person.imageUrl}
                                    alt={person.name}
                                    fill
                                    className="rounded-full object-cover"
                                />
                            </div>
                            <div>
                                <div className="font-heading text-darkColor text-h3 font-medium">{person.name}</div>
                                <div className="text-darkColor font-sans text-small">{person.role}</div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default StatusCard;
