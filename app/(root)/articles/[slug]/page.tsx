import { notFound } from 'next/navigation'

import { readItems } from '@directus/sdk'

import PostLayout from '@/components/PostLayout'
import directus from '@/lib/directus'

const fetchArticleItem = async (slug: string) => {
	try {
		return directus.request(
			readItems('articles', {
				filter: { slug: { _eq: slug } },
			})
		)
	} catch {
		notFound()
	}
}

// Fetch articles_tags data
const fetchArticleTagsForArticle = async () => {
	return directus.request(readItems('articles_tags'))
}

// Fetch tags data
const fetchTagsForArticle = async () => {
	return directus.request(readItems('tags'))
}

const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
	const { slug } = await params
	const articleData = await fetchArticleItem(slug)
	const articles_tags = await fetchArticleTagsForArticle()
	const tags = await fetchTagsForArticle()

	return (
		<div className='mx-10 my-5 min-h-[100vh]'>
			<PostLayout
				type='articles'
				data={articleData}
				post_tags={articles_tags}
				tags={tags}
			/>
		</div>
	)
}
export default Page
