import { notFound } from 'next/navigation'

import { readItem, readItems } from '@directus/sdk'

import PostLayout from '@/components/PostLayout'
import directus from '@/lib/directus'

const fetchArticleItem = async (id: number) => {
	try {
		return directus.request(
			readItem('article', id, {
				fields: ['*'],
			})
		)
	} catch {
		notFound()
	}
}

// Fetch article_tags_for_articles data
const fetchArticleTagsForArticle = async () => {
	return directus.request(readItems('article_tags_for_articles'))
}

// Fetch tags_for_articles data
const fetchTagsForArticle = async () => {
	return directus.request(readItems('tags_for_articles'))
}

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = await params
	const articleData = await fetchArticleItem(+id)
	const article_tags_for_articles = await fetchArticleTagsForArticle()
	const tags_for_articles = await fetchTagsForArticle()

	return (
		<div className='mx-10 my-5 min-h-[100vh]'>
			<PostLayout
				breadcrumbPath='/articles'
				type='article'
				data={articleData}
				titleField='title'
				tagIdsField='article_tags'
				tags_for_post={tags_for_articles}
				tagsForPostIdField='tags_for_articles_id'
				post_tags_for_post={article_tags_for_articles}
				imageField='article_image'
				contentField='article_content'
			/>
		</div>
	)
}
export default Page
