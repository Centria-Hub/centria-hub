'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'

import { articles } from '@/app/data/articles'
import DateFormat from '@/components/DateFormat'
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

type ArticleItem = {
	id: number
	title: string
	thumbnail: string
	posted_date: string
	text: string
	tags: string[]
}

const Page = () => {
	const { id } = useParams()
	const articleData: ArticleItem | undefined = articles.find(
		item => item.id === Number(id)
	)

	if (!articleData) {
		return <p>No Event Data.</p>
	}

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
					{DateFormat(articleData?.posted_date)}
				</p>
				<div className='flex flex-wrap gap-3'>
					{articleData.tags?.map(tag => (
						<Badge key={tag} variant='outline' className='w-fit'>
							{tag}
						</Badge>
					))}
				</div>
			</div>

			{/* Title & Image & Text */}
			<h1 className='mb-5 text-3xl font-bold md:text-5xl'>
				{articleData.title}
			</h1>
			<div className='mx-auto flex max-w-[50vw] justify-center'>
				<Image
					src={articleData.thumbnail}
					alt={articleData.title}
					width={600}
					height={400}
					className='mb-5 h-auto w-full rounded-lg object-cover shadow-md'
				/>
			</div>
			<p className='mb-5 lg:mx-40 lg:text-lg'>{articleData.text}</p>

			{/* Back Button */}
			<div className='flex justify-center'>
				<Link
					href='/articles'
					className={`${buttonVariants({ variant: 'centriaRed' })}`}
				>
					Back
				</Link>
			</div>
		</div>
	)
}
export default Page