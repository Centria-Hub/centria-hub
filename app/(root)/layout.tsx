'use client'

import React from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import BackToTop from '@/components/BackToTop'
import Footer from '@/components/Footer'
import NavBar from '@/components/NavBar'

const queryClient = new QueryClient()

const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
	return (
		<QueryClientProvider client={queryClient}>
			<div className='relative'>
				<NavBar />
				{children}
				<BackToTop />
				<Footer />
			</div>
		</QueryClientProvider>
	)
}
export default Layout
