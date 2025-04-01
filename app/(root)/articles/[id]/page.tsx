import { notFound } from 'next/navigation'

import { readItem, readItems } from '@directus/sdk'

import PostLayout from '@/components/PostLayout'
import directus from '@/lib/directus'

const getArticleItem = async (id: number) => {
	try {
		const post = await directus.request(
			readItem('article', id, {
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
		const data = await directus.request(readItems('tags_for_articles'))
		return data
	} catch (error) {
		console.error('Failed to fetch tags:', error)
	}
}

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = await params
	const articleData = await getArticleItem(+id)
	const tags = await getTags()

	return (
		<div className='mx-10 my-5 min-h-[100vh]'>
			<PostLayout
				breadcrumbPath='/articles'
				type='article'
				data={articleData}
				titleField='title'
				tagIdsField='article_tags'
				tags={tags}
				imageField='article_image'
				contentField='article_content'
			/>
		</div>
	)
}
export default Page
