'use client'

import { Button } from './ui/button'

interface OpenMapButtonProps {
	location_address: string
}

const OpenMapButton: React.FC<OpenMapButtonProps> = ({ location_address }) => {
	const openGoogleMap = () => {
		const location = encodeURIComponent(location_address)
		const url = `https://www.google.com/maps?q=${location}`
		window.open(url, '_blank')
	}

	return (
		<Button
			variant='centriaRed_outline'
			className='w-fit'
			onClick={openGoogleMap}
			size='sm'
		>
			Open Map
		</Button>
	)
}

export default OpenMapButton
