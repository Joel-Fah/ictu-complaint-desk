import React, { ReactNode } from 'react';

type FooterProps = {
    leftContent: ReactNode;
    rightContent: ReactNode;
};

const Footer: React.FC<FooterProps> = ({ leftContent, rightContent }) => {
    return (
        <footer className="w-full bg-transparent text-greyColor py-16 px-20 flex justify-between items-center">
            <div className="flex items-center space-x-4">{leftContent}</div>
            <div className="flex items-center space-x-4">{rightContent}</div>
        </footer>
    );
};

export default Footer;
