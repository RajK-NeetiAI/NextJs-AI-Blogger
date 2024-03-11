/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'tygxsrxyhvukeaepgdbq.supabase.co'
            }
        ]
    }
};

export default nextConfig;
