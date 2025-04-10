import { notFound } from 'next/navigation'

import { readItems } from '@directus/sdk'

import PostLayout from '@/components/PostLayout'
import directus from '@/lib/directus'

const fetchNewsItem = async (slug: string) => {
	try {
		return directus.request(
			readItems('news', {
				filter: { slug: { _eq: slug } },
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

const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
	const { slug } = await params
	const newsData = await fetchNewsItem(slug)
	const news_tags = await fetchNewsTags()
	const tags = await fetchTags()

	return (
		<div className='mx-10 my-5 min-h-[100vh]'>
			<PostLayout
				type='news'
				data={newsData}
				post_tags={news_tags}
				tags={tags}
			/>
		</div>
	)
}

export default Page
