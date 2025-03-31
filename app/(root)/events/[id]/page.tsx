import { notFound } from 'next/navigation'

import { readItem, readItems } from '@directus/sdk'

import PostLayout from '@/components/PostLayout'
import directus from '@/lib/directus'

const getEventsItem = async (id: number) => {
	try {
		const post = await directus.request(
			readItem('events', id, {
				fields: ['*'],
			})
		)
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

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = await params
	const eventData = await getEventsItem(+id)
	const tags = await getTags()

	return (
		<div className='mx-10 my-5 min-h-[100vh]'>
			<PostLayout
				breadcrumbPath='/events'
				type='event'
				data={eventData}
				titleField='title'
				tagIdsField='event_tags'
				tags={tags}
				imageField='event_image'
				contentField='event_content'
			/>
		</div>
	)
}
export default Page
