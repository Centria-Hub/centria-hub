import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'

import DateFormat from '@/components/DateFormat'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'

const ItemCard = ({
	type,
	item,
	tags,
}: {
	type: 'news' | 'event' | 'article'
	item: any
	tags: any
}) => {
	const getDate = () => {
		if (type === 'event') {
			return !item.end_date
				? DateFormat(item.start_date)
				: `${DateFormat(item.start_date)} - ${DateFormat(item.end_date)}`
		}
		return item.date_updated
			? DateFormat(item.date_updated)
			: DateFormat(item.date_created)
	}

	const renderTags = (tagIds: number[] = []) => {
		return tagIds.map((tagId: number) => {
			const tag = tags.find((t: any) => t.id === tagId)
			return tag ? (
				<Badge key={tag.id} variant='outline' className='w-fit'>
					{type === 'article' ? tag.name : tag.tag}
				</Badge>
			) : null
		})
	}

	const getDescription = () => {
		return item.short_description.length > 100
			? `${item.short_description.substring(0, 200)}...`
			: item.short_description
	}

	if (type === 'article') {
		return (
			<Card key={item.id} className='flex flex-col md:flex-row'>
				<CardHeader className='flex-1'>
					<CardTitle>{item.title}</CardTitle>
					<CardDescription>{getDate()}</CardDescription>
					<div className='flex flex-wrap gap-3'>
						{renderTags(item.article_tags)}
					</div>
					<p className='mt-5'>{getDescription()}</p>
					<Link
						href={`/articles/${item.id}`}
						className={`${buttonVariants({ variant: 'centriaRed_outline', size: 'lg' })} w-fit`}
					>
						Read More
					</Link>
				</CardHeader>
				<CardContent className='flex items-center justify-center md:my-auto md:justify-start md:!pb-0 md:!pl-0'>
					<Image
						src={`${process.env.NEXT_PUBLIC_PUBLIC_URL}/assets/${item.article_image}`}
						alt={item.title}
						quality={100}
						width={200}
						height={133}
						className='h-[133px] w-[200px] rounded-lg object-cover shadow-md'
					/>
				</CardContent>
			</Card>
		)
	}
	if (type === 'news' || type === 'event') {
		return (
			<Card key={item.id}>
				<CardHeader className=''>
					<CardTitle>{type === 'news' ? item.news_name : item.title}</CardTitle>
					<CardDescription>{getDate()}</CardDescription>
					<div className='flex flex-wrap gap-3'>
						{renderTags(type === 'news' ? item.news_tags : item.event_tags)}
					</div>
				</CardHeader>
				<CardContent className='justify-content flex flex-col items-center'>
					<Image
						src={
							type === 'news'
								? `${process.env.NEXT_PUBLIC_PUBLIC_URL}/assets/${item.news_image}`
								: `${process.env.NEXT_PUBLIC_PUBLIC_URL}/assets/${item.event_image}`
						}
						quality={100}
						width={1280}
						height={768}
						alt={type === 'news' ? item.news_name : item.title}
						className='mb-5 h-auto w-full rounded-lg object-cover shadow-md'
					/>
				</CardContent>
				<CardFooter className='flex flex-col gap-5'>
					<p className='mt-5'>{getDescription()}</p>
					<Link
						href={type === 'news' ? `/news/${item.id}` : `/events/${item.id}`}
						className={`${buttonVariants({ variant: 'centriaRed_outline', size: 'lg' })}`}
					>
						Read More
					</Link>
				</CardFooter>
			</Card>
		)
	}
	return null
}

export const DisplayItems = ({
	type,
	isLoading,
	displayedItems,
	tags,
}: {
	type: 'news' | 'event' | 'article'
	isLoading: boolean
	displayedItems: any[]
	tags: any
}) => {
	if (type === 'article') {
		return (
			<Suspense>
				{isLoading ? (
					<p>Loading...</p>
				) : (
					<div className='grid grid-cols-1 gap-5'>
						{displayedItems.map(item => (
							<ItemCard key={item.id} type={type} item={item} tags={tags} />
						))}
					</div>
				)}
			</Suspense>
		)
	}
	if (type === 'news' || type === 'event') {
		return (
			<Suspense>
				{isLoading ? (
					<p>Loading...</p>
				) : (
					<div className='grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3'>
						{displayedItems.map(item => (
							<ItemCard key={item.id} type={type} item={item} tags={tags} />
						))}
					</div>
				)}
			</Suspense>
		)
	}
}
