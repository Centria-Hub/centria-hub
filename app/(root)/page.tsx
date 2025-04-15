'use client'

import Image from 'next/image'

import { readItems } from '@directus/sdk'
import { useQuery } from '@tanstack/react-query'
import { CircleChevronDown } from 'lucide-react'

import CarouselLayout from '@/components/CarouselLayout'
import directus from '@/lib/directus'

// fetch News data
const fetchNews = async () => {
	return directus.request(
		readItems('news', {
			filter: { status: { _eq: 'published' } },
			limit: 6,
		})
	)
}
// fetch Events data
const fetchEvents = async () => {
	return directus.request(
		readItems('events', {
			filter: { status: { _eq: 'published' } },
			limit: 6,
		})
	)
}
// fetch Articles data
const fetchArticles = async () => {
	return directus.request(
		readItems('articles', {
			filter: { status: { _eq: 'published' } },
			limit: 6,
		})
	)
}
export default function Home() {
	// Fetch news, events, and articles data
	const { data: newsData, error: newsError } = useQuery({
		queryKey: ['news'],
		queryFn: fetchNews,
	})
	const { data: eventsData, error: eventsError } = useQuery({
		queryKey: ['events'],
		queryFn: fetchEvents,
	})
	const { data: articlesData, error: articlesError } = useQuery({
		queryKey: ['articles'],
		queryFn: fetchArticles,
	})

	return (
		<div className=''>
			<main className=''>
				{/* Hero section */}
				<div className='relative h-full'>
					<div className=''>
						<div className='relative aspect-[1/1] w-full md:aspect-[16/9] lg:aspect-[21/9]'>
							<Image
								src='/hero.jpg'
								alt='hero'
								fill
								className='object-cover brightness-50'
							/>
						</div>
					</div>
					<div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white'>
						<h1 className='mb-2 text-center text-5xl font-semibold'>
							Centria Hub
						</h1>
						<p className='mb-5 text-center text-lg'>
							A platform for all Centria news, events, and articles
						</p>
						<a
							href='#news'
							className='group m-2 flex items-center justify-center scroll-smooth'
						>
							<CircleChevronDown
								color='#E40038'
								size={48}
								className='animate-bounce transition-transform duration-1000 group-hover:scale-125'
							/>
						</a>
					</div>
				</div>
				<div className=''>
					{/* News Section */}
					<div id='news' className='flex flex-col items-center justify-center'>
						{newsError && <p>Error loading news</p>}
						{newsData && (
							<CarouselLayout
								title='News'
								post={newsData}
								link='/news'
								buttonText='See all news'
							/>
						)}
					</div>
					{/* Events Section */}
					<div
						id='events'
						className='flex flex-col items-center justify-center bg-gray-100'
					>
						{eventsError && <p>Error loading events</p>}
						{eventsData && (
							<CarouselLayout
								title='Events'
								post={eventsData}
								link='/events'
								buttonText='See all events'
							/>
						)}
					</div>
					{/* Articles Section */}
					<div
						id='articles'
						className='flex flex-col items-center justify-center'
					>
						{articlesError && <p>Error loading articles</p>}
						{articlesData && (
							<CarouselLayout
								title='Articles'
								post={articlesData}
								link='/articles'
								buttonText='See all articles'
							/>
						)}
					</div>
				</div>
			</main>
		</div>
	)
}
