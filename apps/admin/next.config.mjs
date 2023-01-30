/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    transpilePackages: ["ui"],
    fontLoaders: [
      {
        loader: "@next/font/google",
        options: { subsets: ["latin"] },
      },
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dlooyijwaxajycrakkeq.supabase.co",
        pathname: "/storage/v1/object/**",
      },
    ],
  },
}

export default nextConfig
