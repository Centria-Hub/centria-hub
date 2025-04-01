import { notFound } from 'next/navigation'

import { readItem, readItems } from '@directus/sdk'

import PostLayout from '@/components/PostLayout'
import directus from '@/lib/directus'

const getNewsItem = async (id: number) => {
	try {
		const post = await directus.request(
			readItem('news', id, {
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
		const data = await directus.request(readItems('tags'))
		return data
	} catch (error) {
		console.error('Failed to fetch tags:', error)
	}
}

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = await params
	const newsData = await getNewsItem(+id)
	const tags = await getTags()

	return (
		<div className='mx-10 my-5 min-h-[100vh]'>
			<PostLayout
				breadcrumbPath='/news'
				type='news'
				data={newsData}
				titleField='news_name'
				tagIdsField='news_tags'
				tags={tags}
				imageField='news_image'
				contentField='new_content'
			/>
		</div>
	)
}

export default Page
