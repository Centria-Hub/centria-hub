import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	output: 'standalone',
	eslint: {
		ignoreDuringBuilds: true,
	},
	// async rewrites() {
	// 	return [
	// 		{
	// 			source: '/admin/:path*',
	// 			destination: '/admin/:path*',
	// 		},
	// 		{
	// 			source: '/:path*',
	// 			destination: '/:path*',
	// 		},
	// 	]
	// },
	// async redirects() {
	// 	return [
	// 		{
	// 			source: '/admin',
	// 			destination: '/admin/',
	// 			permanent: true,
	// 		},
	// 	]
	// },
}

export default nextConfig