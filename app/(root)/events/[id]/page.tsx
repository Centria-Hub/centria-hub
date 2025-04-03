import { notFound } from 'next/navigation'

import { readItem, readItems } from '@directus/sdk'

import PostLayout from '@/components/PostLayout'
import directus from '@/lib/directus'

const fetchEventItem = async (id: number) => {
	try {
		return directus.request(
			readItem('events', id, {
				fields: ['*'],
			})
		)
	} catch {
		notFound()
	}
}

// Fetch events_tags_for_events data
const fetchEventsTagsForEvents = async () => {
	return directus.request(readItems('events_tags_for_events'))
}

// Fetch tags_for_events data
const fetchTagsForEvents = async () => {
	return directus.request(readItems('tags_for_events'))
}

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = await params
	const eventData = await fetchEventItem(+id)
	const events_tags_for_events = await fetchEventsTagsForEvents()
	const tags_for_events = await fetchTagsForEvents()

	return (
		<div className='mx-10 my-5 min-h-[100vh]'>
			<PostLayout
				breadcrumbPath='/events'
				type='event'
				data={eventData}
				titleField='title'
				tagIdsField='event_tags'
				tags_for_post={tags_for_events}
				tagsForPostIdField='tags_for_events_id'
				post_tags_for_post={events_tags_for_events}
				imageField='event_image'
				contentField='event_content'
			/>
		</div>
	)
}
export default Page
