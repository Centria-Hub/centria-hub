'use client'

import { Button } from './ui/button'

interface AddToCalenderProps {
	title: string
	start_date: string
	end_date?: string
	location_address?: string
}

const AddToCalender: React.FC<AddToCalenderProps> = ({
	title,
	start_date,
	end_date,
	location_address,
}) => {
	const addToGoogleCalendar = () => {
		const eventName = encodeURIComponent(title)
		const startDate = new Date(start_date)
			.toISOString()
			.replace(/-|:|\.\d+/g, '')

		const endDate = end_date
			? new Date(end_date).toISOString().replace(/-|:|\.\d+/g, '')
			: startDate

		const location = location_address
			? `&location=${encodeURIComponent(location_address)}`
			: ''

		const googleCalenderURL = `https://www.google.com/calendar/render?action=TEMPLATE&text=${eventName}&dates=${startDate}/${endDate}${location}`

		window.open(googleCalenderURL, '_blank')
	}

	return (
		<Button
			variant='centriaRed_outline'
			className='w-fit'
			onClick={addToGoogleCalendar}
			size='sm'
		>
			Add to Calender
		</Button>
	)
}

export default AddToCalender
