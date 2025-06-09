import Image from "next/image";
import React, { FC } from "react";

type Action = {
    label: string;
    onClick: () => void;
    variant?: "primary" | "secondary";
    className?: string;
    disabled?: boolean;
};

interface ToastNotificationProps extends React.HTMLAttributes<HTMLDivElement> {
    type?: "success" | "error" | "warning" | "info";
    title?: string;
    subtitle?: string;
    showIcon?: boolean;
    showClose?: boolean;
    actions?: Action[];
    onClose?: () => void;
    className?: string;
    titleClassName?: string;
    subtitleClassName?: string;
    iconClassName?: string;
    actionsClassName?: string;
}

const ToastNotification: FC<ToastNotificationProps> = ({
                                                           type = "success",
                                                           title = "Success notification",
                                                           subtitle = "Subtitle and associated information pertaining to the event. Information to not exceed [x] characters.",
                                                           showIcon = true,
                                                           showClose = true,
                                                           actions = [],
                                                           onClose,
                                                           className = "",
                                                           titleClassName = "",
                                                           subtitleClassName = "",
                                                           iconClassName = "",
                                                           actionsClassName = "",
                                                           ...props
                                                       }) => {
    const iconPaths = {
        success: "/icons/checkmark-circle-04.svg",
        error: "/icons/alert-circle.svg",
        warning: "/icons/alert-02.svg",
        info: "/icons/information-circle.svg",
    };

    const typeStyles = {
        success: {
            container: "bg-gray-800 border-green-500",
            icon: "text-green-500",
            title: "text-white",
            subtitle: "text-gray-300",
        },
        error: {
            container: "bg-gray-800 border-red-500",
            icon: "text-red-500",
            title: "text-white",
            subtitle: "text-gray-300",
        },
        warning: {
            container: "bg-gray-800 border-yellow-500",
            icon: "text-yellow-500",
            title: "text-white",
            subtitle: "text-gray-300",
        },
        info: {
            container: "bg-gray-800 border-blue-500",
            icon: "text-blue-500",
            title: "text-white",
            subtitle: "text-gray-300",
        },
    };

    const styles = typeStyles[type] || typeStyles.success;

    return (
        <div
            className={`
        relative flex items-start gap-3 p-4 rounded-lg border-l-4 shadow-lg max-w-md w-full
        ${styles.container}
        ${className}
      `}
            {...props}
        >
            {/* Icon */}
            {showIcon && (
                <div className={`flex-shrink-0 mt-0.5 ${iconClassName}`}>
                    <Image
                        src={iconPaths[type]}
                        alt={`${type} icon`}
                        width={20}
                        height={20}
                        className={`w-5 h-5 ${styles.icon}`}
                        draggable={false}
                    />
                </div>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0">
                <h4
                    className={`font-medium text-sm leading-5 ${styles.title} ${titleClassName}`}
                >
                    {title}
                </h4>

                {subtitle && (
                    <p
                        className={`mt-1 text-xs leading-4 ${styles.subtitle} ${subtitleClassName}`}
                    >
                        {subtitle}
                    </p>
                )}

                {/* Actions */}
                {actions.length > 0 && (
                    <div className={`flex gap-2 mt-3 ${actionsClassName}`}>
                        {actions.map((action, index) => (
                            <button
                                key={index}
                                onClick={action.onClick}
                                className={`
                  px-3 py-1.5 text-xs font-medium rounded
                  ${
                                    action.variant === "primary"
                                        ? "bg-blue-600 text-white hover:bg-blue-700"
                                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                }
                  transition-colors duration-200
                  ${action.className || ""}
                `}
                                disabled={action.disabled}
                                type="button"
                            >
                                {action.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Close button */}
            {showClose && (
                <button
                    onClick={() => onClose && onClose()}
                    className="flex-shrink-0 p-1 text-gray-400 hover:text-white transition-colors duration-200"
                    aria-label="Close notification"
                    type="button"
                >
                    <Image
                        src="/icons/cancel-01.svg"
                        alt="Close"
                        width={16}
                        height={16}
                        className="w-4 h-4"
                        draggable={false}
                    />
                </button>
            )}
        </div>
    );
};

export default ToastNotification;
