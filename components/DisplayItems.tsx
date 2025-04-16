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
	CardHeader,
	CardTitle,
} from '@/components/ui/card'

const ItemCard = ({
	type,
	item,
	tags,
	post_tags,
}: {
	type: 'news' | 'events' | 'articles'
	item: any
	tags: any
	post_tags: any
}) => {
	const getDate = () => {
		if (type === 'events') {
			return DateFormat(item.time)
		}
		return item.date_updated
			? DateFormat(item.date_updated)
			: DateFormat(item.date_created)
	}

	const renderTags = (tagIds: number[] = []) => {
		return tagIds.map((tagId: number) => {
			const data = post_tags.find((t: any) => t.id === tagId)
			const tag = tags.find((t: any) => t.id === data.tags_id)
			return tag ? (
				<Badge key={tag.id} variant='outline' className='w-fit'>
					{tag.tag}
				</Badge>
			) : null
		})
	}

	const getDescription = (maxLength: number) => {
		return item.short_description.length > maxLength
			? `${item.short_description.substring(0, maxLength)}...`
			: item.short_description
	}

	if (type === 'articles') {
		return (
			<Card key={item.id} className='flex flex-col md:flex-row'>
				<CardHeader className='flex-1'>
					<CardTitle>{item.title}</CardTitle>
					<CardDescription>{getDate()}</CardDescription>
					<div className='flex flex-wrap gap-3'>{renderTags(item.tags)}</div>
					<p className='mt-5'>{getDescription(200)}</p>
					<Link
						href={`/articles/${item.slug}`}
						className={`${buttonVariants({ variant: 'centriaRed_outline', size: 'lg' })} w-fit`}
					>
						Read More
					</Link>
				</CardHeader>
				<CardContent className='flex items-center justify-center md:my-auto md:justify-start md:!pb-0 md:!pl-0'>
					<Image
						src={`${process.env.NEXT_PUBLIC_PUBLIC_URL}/assets/${item.image}`}
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
	if (type === 'news' || type === 'events') {
		return (
			<Link href={`/${type}/${item.slug}`} className=''>
				<Card
					key={item.id}
					className='relative flex h-full flex-col overflow-hidden rounded-lg shadow-md transition-transform duration-300 hover:scale-105'
				>
					<CardContent className='p-0'>
						<div className='relative'>
							<Image
								src={`${process.env.NEXT_PUBLIC_PUBLIC_URL}/assets/${item.image}`}
								alt={item.title}
								quality={100}
								width={1280}
								height={768}
								className='h-60 w-full rounded-t-lg object-cover'
							/>
							<div className='absolute bottom-0 left-0 right-0 h-2/5 bg-gradient-to-t from-white to-transparent'></div>
						</div>
					</CardContent>
					<CardHeader className='relative z-10 -mt-16 p-5'>
						<CardTitle>{item.title}</CardTitle>
						<p className='mt-5 text-sm text-gray-600'>{getDate()}</p>
						<p className='mt-5 text-sm text-gray-600'>{getDescription(100)}</p>
						<div className='mt-5 flex flex-wrap gap-2'>
							{renderTags(item.tags)}
						</div>
					</CardHeader>
				</Card>
			</Link>
		)
	}
	return null
}

export const DisplayItems = ({
	type,
	isLoading,
	displayedItems,
	tags,
	post_tags,
}: {
	type: 'news' | 'events' | 'articles'
	isLoading: boolean
	displayedItems: any[]
	tags: any
	post_tags: any
}) => {
	if (type === 'articles') {
		return (
			<Suspense>
				{isLoading ? (
					<p>Loading...</p>
				) : (
					<div className='grid grid-cols-1 gap-5'>
						{displayedItems.map(item => (
							<ItemCard
								key={item.id}
								type={type}
								item={item}
								tags={tags}
								post_tags={post_tags}
							/>
						))}
					</div>
				)}
			</Suspense>
		)
	}
	if (type === 'news' || type === 'events') {
		return (
			<Suspense>
				{isLoading ? (
					<p>Loading...</p>
				) : (
					<div className='grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3'>
						{displayedItems.map(item => (
							<ItemCard
								key={item.id}
								type={type}
								item={item}
								tags={tags}
								post_tags={post_tags}
							/>
						))}
					</div>
				)}
			</Suspense>
		)
	}
}
