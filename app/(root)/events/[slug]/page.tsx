import { notFound } from 'next/navigation'

import { readItems } from '@directus/sdk'

import PostLayout from '@/components/PostLayout'
import directus from '@/lib/directus'

const fetchEventItem = async (slug: string) => {
	try {
		return directus.request(
			readItems('events', {
				filter: { slug: { _eq: slug } },
			})
		)
	} catch {
		notFound()
	}
}

// Fetch events_tags
const fetchEventsTagsForEvents = async () => {
	return directus.request(readItems('events_tags'))
}

// Fetch tags
const fetchTagsForEvents = async () => {
	return directus.request(readItems('tags'))
}

const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
	const { slug } = await params
	const eventData = await fetchEventItem(slug)
	const events_tags = await fetchEventsTagsForEvents()
	const tags = await fetchTagsForEvents()

	return (
		<PostLayout
			type='events'
			data={eventData}
			post_tags={events_tags}
			tags={tags}
		/>
	)
}
export default Page
