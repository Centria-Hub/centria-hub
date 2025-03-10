import type { Metadata } from 'next'
import localFont from 'next/font/local'

import './globals.css'

const nunito = localFont({
	src: [
		{
			path: './fonts/Nunito-Black.ttf',
			weight: '900',
			style: 'normal',
		},
		{
			path: './fonts/Nunito-ExtraBold.ttf',
			weight: '800',
			style: 'normal',
		},
		{
			path: './fonts/Nunito-Bold.ttf',
			weight: '700',
			style: 'normal',
		},
		{
			path: './fonts/Nunito-SemiBold.ttf',
			weight: '600',
			style: 'normal',
		},
		{
			path: './fonts/Nunito-Medium.ttf',
			weight: '500',
			style: 'normal',
		},
		{
			path: './fonts/Nunito-Regular.ttf',
			weight: '400',
			style: 'normal',
		},
		{
			path: './fonts/Nunito-Light.ttf',
			weight: '200',
			style: 'normal',
		},
		{
			path: './fonts/Nunito-ExtraLight.ttf',
			weight: '100',
			style: 'normal',
		},
	],
	variable: '--font-nunito-sans',
})

export const metadata: Metadata = {
	title: 'Centria Hub',
	description: 'Where Campus Life Converges',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en'>
			<body className={nunito.variable}>{children}</body>
		</html>
	)
}
