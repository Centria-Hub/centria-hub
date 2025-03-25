import Image from 'next/image'
import { notFound } from 'next/navigation'

import { readItem, readItems } from '@directus/sdk'
import { CalendarDays, Euro, MapPin } from 'lucide-react'

import AddToCalender from '@/components/AddToCalender'
import BackButton from '@/components/BackButton'
import DateFormat from '@/components/DateFormat'
import OpenMapButton from '@/components/OpenMapButton'
import { Badge } from '@/components/ui/badge'
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import directus from '@/lib/directus'

const getEventsItem = async (id: number) => {
	try {
		const post = (await directus.request(
			readItem('events', id, {
				fields: ['*'],
			})
		)) as EventItem
		return post
	} catch {
		notFound()
	}
}

const getTags = async () => {
	try {
		const data = await directus.request(readItems('tags_for_events'))
		return data
	} catch (error) {
		console.error('Failed to fetch tags:', error)
	}
}

type EventItem = {
	id: number
	title: string
	event_image: string
	date_created: string
	date_updated: string
	start_date: string
	end_date: string
	event_content: string
	event_tags: number[]
	location: Location
	is_free: boolean
	fee: string
	short_description: string
	location_address: string
}

type Location = {
	type: string
	coordinates: number[]
}

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = await params
	const eventData: EventItem | undefined = await getEventsItem(+id)
	const tags = await getTags()

	return (
		<div className='mx-10 my-5 min-h-[100vh]'>
			<Breadcrumb className='mb-5'>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href='/public'>Home</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink href='/events'>Events</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>{eventData.title}</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			{/* Posted Date & Tags & AddToCalenderButton */}
			<div className='mb-5 flex flex-col gap-3 md:flex-row md:items-center'>
				<p className='text-sm text-gray-500'>
					{eventData.date_updated
						? DateFormat(eventData.date_updated)
						: DateFormat(eventData.date_created)}
				</p>
				<div className='flex flex-wrap gap-3'>
					{eventData.event_tags?.map((tagId: number) => {
						const tag = tags?.find((t: any) => t.id == tagId)
						return tag ? (
							<Badge key={tag.id} variant='outline' className='w-fit'>
								{tag.tag}
							</Badge>
						) : null
					})}
				</div>
				<AddToCalender
					title={eventData.title}
					start_date={eventData.start_date}
					end_date={eventData.end_date}
					location_address={eventData.location_address}
				/>
			</div>

			{/* Title & Event Date & Image & Text */}
			<h1 className='mb-5 text-3xl font-bold md:text-5xl'>{eventData.title}</h1>
			<div className='mb-5 flex flex-col gap-3'>
				<div className='flex flex-row gap-3'>
					<CalendarDays />
					<h1 className='text-sm font-bold md:text-xl'>
						{!eventData.end_date
							? `${DateFormat(eventData.start_date)}`
							: `${DateFormat(eventData.start_date)} - ${DateFormat(eventData.end_date)}`}
					</h1>
				</div>
				<div className='flex flex-row gap-3'>
					<Euro />
					{eventData.is_free ? (
						<h1 className='text-sm font-bold md:text-xl'>Free</h1>
					) : (
						<h1 className='text-sm font-bold md:text-xl'>{eventData.fee}</h1>
					)}
				</div>
				{eventData.location_address ? (
					<div className='flex flex-row flex-wrap items-center gap-3 overflow-visible'>
						<MapPin />
						<h1 className='text-sm font-bold md:text-xl'>
							{eventData.location_address}
						</h1>
						<OpenMapButton location_address={eventData.location_address} />
					</div>
				) : null}
			</div>
			<p className='mb-5 text-xl font-semibold md:text-2xl lg:mx-40'>
				{eventData.short_description}
			</p>
			<div className='mx-auto flex max-w-[50vw] justify-center'>
				<Image
					src={`${process.env.NEXT_PUBLIC_PUBLIC_URL}/assets/${eventData.event_image}`}
					quality={100}
					width={1280}
					height={768}
					alt={eventData.event_image}
					className='mb-5 h-auto w-full rounded-lg object-cover shadow-md'
				/>
			</div>
			<div
				dangerouslySetInnerHTML={{ __html: eventData.event_content }}
				className='mb-5 lg:mx-40 lg:text-lg'
			/>
			{/* Back Button */}
			<div className='flex justify-center'>
				<BackButton />
			</div>
		</div>
	)
}
export default Page
