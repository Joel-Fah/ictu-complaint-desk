import React, { ReactNode } from 'react';

type FooterProps = {
    leftContent: ReactNode;
    rightContent: ReactNode;
};

const Footer: React.FC<FooterProps> = ({ leftContent, rightContent }) => {
    return (
        <footer className="w-full bg-transparent text-greyColor py-8 md:py-16 px-6 md:px-20 flex flex-col md:flex-row justify-between items-start md:items-center gap-y-4">
            <div className="flex items-center space-x-4">{leftContent}</div>
            <div className="flex items-center space-x-4">{rightContent}</div>
        </footer>
    );
};

export default Footer;
