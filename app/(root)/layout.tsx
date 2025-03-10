import React from 'react'

import BackToTop from '@/components/BackToTop'
import Footer from '@/components/Footer'
import NavBar from '@/components/NavBar'

const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
	return (
		<div className='relative'>
			<NavBar />
			{children}
			<BackToTop />
			<Footer />
		</div>
	)
}
export default Layout
