import Image from 'next/image'
import { notFound } from 'next/navigation'

import { readItem, readItems } from '@directus/sdk'

import BackButton from '@/components/BackButton'
import DateFormat from '@/components/DateFormat'
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

	console.log('tags: ', tags)
	console.log('articles_tags: ', articleData.article_tags)

	return (
		<div className='mx-10 my-5 min-h-[100vh]'>
			<Breadcrumb className='mb-5'>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href='/public'>Home</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink href='/articles'>Articles</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>{articleData.title}</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			{/* Published Date & Tags */}
			<div className='mb-5 flex flex-col gap-3 md:flex-row md:items-center'>
				<p className='text-sm text-gray-500'>
					{articleData.date_updated
						? DateFormat(articleData.date_updated)
						: DateFormat(articleData.date_created)}
				</p>
				<div className='flex flex-wrap gap-3'>
					{articleData.article_tags?.map((tagId: number) => {
						const tag = tags?.find((t: any) => t.id === tagId)
						return tag ? (
							<Badge key={tag.id} variant='outline' className='w-fit'>
								{tag.name}
							</Badge>
						) : null
					})}
				</div>
			</div>

			{/* Title & Image & Text */}
			<h1 className='mb-5 text-3xl font-bold md:text-5xl'>
				{articleData.title}
			</h1>
			<p className='mb-5 text-xl font-semibold md:text-2xl lg:mx-40'>
				{articleData.short_description}
			</p>
			<div className='mx-auto flex max-w-[50vw] justify-center'>
				<Image
					src={`${process.env.NEXT_PUBLIC_PUBLIC_URL}/assets/${articleData.article_image}`}
					quality={100}
					width={1280}
					height={768}
					alt={articleData.title}
					className='mb-5 h-auto w-full rounded-lg object-cover shadow-md'
				/>
			</div>
			<div
				dangerouslySetInnerHTML={{ __html: articleData.article_content }}
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
