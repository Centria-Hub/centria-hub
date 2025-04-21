import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'

import { Clock, MapPin } from 'lucide-react'

import DateFormat from '@/components/DateFormat'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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
			return `${DateFormat(item.time)} - ${DateFormat(item.end_time)}`
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

	if (item) {
		return (
			<Link href={`/${type}/${item.slug}`} className=''>
				<Card
					key={item.id}
					className='relative flex h-full w-full flex-col overflow-hidden rounded-lg shadow-md transition-transform duration-300 hover:translate-y-[-5px]'
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
						{type === 'events' && (
							<div className='flex flex-row items-center gap-2 text-sm text-gray-600'>
								<Clock className='h-4 w-4' />
								<span className='whitespace-nowrap'>
									{item.time.split('T')[1].split(':').slice(0, 2).join(':')} -{' '}
									{item.end_time.split('T')[1].split(':').slice(0, 2).join(':')}
								</span>
								<MapPin className='h-4 w-4' />
								<span className='truncate'>{item.location}</span>
							</div>
						)}
						<p className='mt-5 text-sm text-gray-600'>
							{getDescription(type === 'articles' ? 200 : 100)}
						</p>
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
