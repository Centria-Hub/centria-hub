import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { readItem } from '@directus/sdk'

// Temporary implementation
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

type NewsItem = {
	id: number
	name: string
	thumbnail: string
	posted_date: string
	text: string
	tags: string[]
}

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

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = await params
	const newsData = await getNewsItem(+id)

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
				<p className='text-sm text-gray-500'>{newsData.news_name}</p>
				<div className='flex flex-wrap gap-3'></div>
			</div>

			{/* Title & Image & Text */}
			<h1 className='mb-5 text-3xl font-bold md:text-5xl'>{newsData.title}</h1>
			<div className='mx-auto flex max-w-[50vw] justify-center'>
				<img
					src={`${process.env.PUBLIC_URL}/assets/${newsData.news_image}`}
					width={100}
					height={100}
					alt={newsData.news_name}
					className='mb-5 h-auto w-full rounded-lg object-cover shadow-md'
				/>
			</div>
			<p className='mb-5 lg:mx-40 lg:text-lg'>{newsData.new_content}</p>

			{/* Back Button */}
			<div className='flex justify-center'>
				<Link
					href='/news'
					className={`${buttonVariants({ variant: 'centriaRed' })}`}
				>
					Back
				</Link>
			</div>
		</div>
	)
}
export default Page