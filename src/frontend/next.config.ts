import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
                pathname: '/**', // Match all paths under this domain
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                pathname: '/**', // Match all paths under localhost
            },
        ],
    },
};

export default nextConfig;
