import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	output: 'standalone',
	eslint: {
		ignoreDuringBuilds: true,
	},
	async rewrites() {
		return [
			{
				source: '/admin/:path*',
				destination: '/admin/:path*', // Фейковий rewrite для блокування обробки /admin у Next
			},
			{
				source: '/:path*',
				destination: '/:path*', // Дефолтний маршрут
			},
		]
	},
	async redirects() {
		return [
			{
				source: '/admin',
				destination: '/admin/',
				permanent: true,
			},
		]
	},
}

export default nextConfig