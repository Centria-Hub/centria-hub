import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	output: 'standalone',
	eslint: {
		ignoreDuringBuilds: true,
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'api.hub.solo-web.studio',
				pathname: '/assets/**',
			},
		],
	},
}

export default nextConfig