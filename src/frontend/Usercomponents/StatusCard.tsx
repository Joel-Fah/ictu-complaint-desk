import React from "react";
import Image from "next/image";

interface AssignedPerson {
    name: string;
    role: string;
    imageUrl: string;
}

interface StatusCardProps {
    status: string;
    assignedTo: AssignedPerson[];
}

const StatusCard: React.FC<StatusCardProps> = ({ status, assignedTo }) => {
    const getStatusStyles = () => {
        switch (status.toLowerCase()) {
            case "escalated":
                return "bg-red-100 border-error text-error";
            case "in progress":
                return "bg-yellow-50 border-warning text-warning";
            case "resolved":
                return "bg-green-50 border-success text-success";
            default:
                return "bg-primary-50 border-info text-info";
        }
    };

    const getStatusIcon = () => {
        switch (status.toLowerCase()) {
            case "escalated":
                return "/icons/help-circle-red.svg";
            case "in progress":
                return "/icons/loading-02.svg";
            case "resolved":
                return "/icons/target-02.svg";
            default:
                return "/icons/status.svg";
        }
    };

    const getDescription = () => {
        switch (status.toLowerCase()) {
            case "escalated":
                return "You are seeing this because the deadline for complaints has passed and this has still not been reviewed.";
            case "in progress":
                return "Your complaint is currently being handled by those involved. Please be patient.";
            case "resolved":
                return "Congratulations on getting your complaint resolution.";
            default:
                return "This complaint has been filed but the concerned parties have not reviewed it yet. Please be patient.";
        }
    };

    return (
        <div className="w-full max-w-md sm:max-w-sm lg:max-w-xs mx-auto px-4">
            {/* Status Section */}
            <div className="mb-6">
                <h2 className="text-lg sm:text-xl font-heading text-greyColor mb-4">Status</h2>
                <div
                    className={`border border-dashed rounded-2xl p-3 ${getStatusStyles()} w-full`}
                >
                    <div className="flex items-center justify-center gap-2">
                        <Image
                            src={getStatusIcon()}
                            alt={`${status} icon`}
                            width={24}
                            height={24}
                        />
                        <span
                            className={`text-base sm:text-lg font-medium capitalize font-heading ${getStatusStyles()}`}
                        >
              {status}
            </span>
                    </div>
                </div>
                <p className="text-greyColor text-sm mt-2 leading-relaxed">{getDescription()}</p>
            </div>

            {/* Separator */}
            <hr className="border-gray-200 mb-6" />

            {/* Assigned To Section */}
            <div>
                <h2 className="text-lg font-heading font-medium text-greyColor mb-2">Assigned to:</h2>
                <p className="text-greyColor text-sm mb-4">
                    This complaint was assigned to the following administrative entities:
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
                                <div className="font-heading text-darkColor text-base font-medium">
                                    {person.name}
                                </div>
                                <div className="text-darkColor font-sans text-sm">{person.role}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StatusCard;
