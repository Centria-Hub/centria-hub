import Link from 'next/link'
import { notFound } from 'next/navigation'

import { readItem, readItems } from '@directus/sdk'

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
import { buttonVariants } from '@/components/ui/button'
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

const Page = async ({
	params,
	searchParams,
}: {
	params: { id: string }
	searchParams: Record<string, string>
}) => {
	const { id } = await params
	const newsData = await getNewsItem(+id)
	const tags = await getTags()

	const queryString = new URLSearchParams(
		Object.fromEntries(
			Object.entries(searchParams).filter(([_, v]) => typeof v === 'string')
		)
	).toString()

	return (
		<div className='mx-10 my-5 min-h-[100vh]'>
			<Breadcrumb className='mb-5'>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href='/public'>Home</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink href='/news'>News</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>{newsData.news_name}</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
			{/* Published Date & Tags */}
			<div className='mb-5 flex flex-col gap-3 md:flex-row md:items-center'>
				<p className='text-sm text-gray-500'>
					{newsData.date_updated
						? DateFormat(newsData.date_updated)
						: DateFormat(newsData.date_created)}
				</p>
				<div className='flex flex-wrap gap-3'>
					{newsData.news_tags?.map((tagId: number) => {
						const tag = tags?.find((t: any) => t.id === tagId)
						return tag ? (
							<Badge key={tag.id} variant='outline' className='w-fit'>
								{tag.tag}
							</Badge>
						) : null
					})}
				</div>
			</div>
			{/* Title & Image & Text */}
			<h1 className='mb-5 text-3xl font-bold md:text-5xl'>
				{newsData.news_name}
			</h1>
			<p className='mb-5 text-xl font-semibold md:text-2xl lg:mx-40'>
				{newsData.short_description}
			</p>
			<div className='mx-auto flex max-w-[50vw] justify-center'>
				<img
					src={`${process.env.PUBLIC_URL}/assets/${newsData.news_image}`}
					width={100}
					height={100}
					alt={newsData.news_name}
					className='mb-5 h-auto w-full rounded-lg object-cover shadow-md'
				/>
			</div>
			<div
				dangerouslySetInnerHTML={{ __html: newsData.new_content }}
				className='mb-5 lg:mx-40 lg:text-lg'
			/>
			{/* Back Button */}
			<div className='flex justify-center'>
				<Link
					href={`/news${queryString ? `?${queryString}` : ''}`}
					className={`${buttonVariants({ variant: 'centriaRed' })}`}
				>
					Back
				</Link>
			</div>
		</div>
	)
}
export default Page
