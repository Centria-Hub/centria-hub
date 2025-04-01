import { notFound } from 'next/navigation'

import { readItem, readItems } from '@directus/sdk'

import PostLayout from '@/components/PostLayout'
import directus from '@/lib/directus'

const fetchNewsItem = async (id: number) => {
	try {
		return directus.request(
			readItem('news', id, {
				fields: ['*'],
			})
		)
	} catch {
		notFound()
	}
}

// Fetch news_tags data
const fetchNewsTags = async () => {
	return directus.request(readItems('news_tags'))
}

// Fetch tags data
const fetchTags = async () => {
	return directus.request(readItems('tags'))
}

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = await params
	const newsData = await fetchNewsItem(+id)
	const news_tags = await fetchNewsTags()
	const tags = await fetchTags()

	return (
		<div className='mx-10 my-5 min-h-[100vh]'>
			<PostLayout
				breadcrumbPath='/news'
				type='news'
				data={newsData}
				titleField='news_name'
				tagIdsField='news_tags'
				tags_for_post={tags}
				tagsForPostIdField='tags_id'
				post_tags_for_post={news_tags}
				imageField='news_image'
				contentField='new_content'
			/>
		</div>
	)
}

export default Page
