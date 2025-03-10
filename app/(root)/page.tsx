// import { elysia } from '@/elysia/client'
import Image from 'next/image'
import Link from 'next/link'

import { CircleChevronDown } from 'lucide-react'

import { buttonVariants } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '@/components/ui/carousel'

import { news } from '../data/news'

export default async function Home() {
	// const { data } = await elysia.api.index.get()
	return (
		<div className=''>
			<main className=''>
				{/* Hero section */}
				<div className='relative h-full'>
					<div className=''>
						<Image
							width={100}
							height={80}
							src='/hero.jpg'
							alt='hero'
							className='h-[70vh] w-full object-cover brightness-50'
						/>
					</div>
					<div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white'>
						<h1 className='mb-2 text-center text-5xl font-semibold'>
							Centria Hub
						</h1>
						<p className='mb-2 text-center text-lg'>
							A platform for all Centria news, events, and articles
						</p>
						<a
							href='#news'
							className='group m-2 flex items-center justify-center scroll-smooth'
						>
							<CircleChevronDown
								color='#E40038'
								size={48}
								className='transition-transform duration-300 group-hover:scale-125'
							/>
						</a>
					</div>
				</div>
				{/* News Section */}
				<div id='news' className='flex flex-col items-center justify-center'>
					<h1 className='my-20 text-center text-4xl font-semibold'>News</h1>
					<Carousel className='mx-auto flex w-[80vw] items-center justify-center'>
						<CarouselContent>
							{news.map(item => (
								<CarouselItem
									key={item.id}
									className='md:basis-1/2 lg:basis-1/3'
								>
									<Card className='h-full'>
										<CardHeader className='h-1/3'>
											<CardTitle>{item.title}</CardTitle>
											<CardDescription>{item.posted_date}</CardDescription>
										</CardHeader>
										<CardContent className='justify-content flex h-1/3 flex-col items-center'>
											<Image
												src={item.thumbnail}
												alt={item.title}
												width={200}
												height={200}
												className='h-full rounded-lg object-cover shadow-md'
											/>
										</CardContent>
										<CardFooter className='h-1/3'>
											<p className='mt-5'>
												{item.text.length > 100
													? `${item.text.substring(0, 100)}...`
													: item.text}
											</p>
										</CardFooter>
									</Card>
								</CarouselItem>
							))}
						</CarouselContent>
						<CarouselPrevious />
						<CarouselNext />
					</Carousel>
					<Link
						href='/news'
						className={`${buttonVariants({ variant: 'centriaRed', size: 'lg' })} my-20`}
					>
						More News
					</Link>
				</div>
				{/* Events Section */}
				<div
					id='news'
					className='flex flex-col items-center justify-center bg-gray-100'
				>
					<h1 className='my-20 text-center text-4xl font-semibold'>Events</h1>
					<Carousel className='mx-auto flex w-[80vw] items-center justify-center'>
						<CarouselContent>
							{news.map(item => (
								<CarouselItem
									key={item.id}
									className='md:basis-1/2 lg:basis-1/3'
								>
									<Card className='h-full bg-white'>
										<CardHeader className='h-1/3'>
											<CardTitle>{item.title}</CardTitle>
											<CardDescription>{item.posted_date}</CardDescription>
										</CardHeader>
										<CardContent className='justify-content flex h-1/3 flex-col items-center'>
											<Image
												src={item.thumbnail}
												alt={item.title}
												width={200}
												height={200}
												className='h-full rounded-lg object-cover shadow-md'
											/>
										</CardContent>
										<CardFooter className='h-1/3'>
											<p className='mt-5'>
												{item.text.length > 100
													? `${item.text.substring(0, 100)}...`
													: item.text}
											</p>
										</CardFooter>
									</Card>
								</CarouselItem>
							))}
						</CarouselContent>
						<CarouselPrevious />
						<CarouselNext />
					</Carousel>
					<Link
						href='/events'
						className={`${buttonVariants({ variant: 'centriaRed', size: 'lg' })} my-20`}
					>
						More Events
					</Link>
				</div>

				{/* Articles Section */}
				<div id='news' className='flex flex-col items-center justify-center'>
					<h1 className='my-20 text-center text-4xl font-semibold'>Articles</h1>
					<Carousel className='mx-auto flex w-[80vw] items-center justify-center'>
						<CarouselContent>
							{news.map(item => (
								<CarouselItem
									key={item.id}
									className='md:basis-1/2 lg:basis-1/3'
								>
									<Card className='h-full'>
										<CardHeader className='h-1/3'>
											<CardTitle>{item.title}</CardTitle>
											<CardDescription>{item.posted_date}</CardDescription>
										</CardHeader>
										<CardContent className='justify-content flex h-1/3 flex-col items-center'>
											<Image
												src={item.thumbnail}
												alt={item.title}
												width={200}
												height={200}
												className='h-full rounded-lg object-cover shadow-md'
											/>
										</CardContent>
										<CardFooter className='h-1/3'>
											<p className='mt-5'>
												{item.text.length > 100
													? `${item.text.substring(0, 100)}...`
													: item.text}
											</p>
										</CardFooter>
									</Card>
								</CarouselItem>
							))}
						</CarouselContent>
						<CarouselPrevious />
						<CarouselNext />
					</Carousel>
					<Link
						href='/articles'
						className={`${buttonVariants({ variant: 'centriaRed', size: 'lg' })} my-20`}
					>
						More Articles
					</Link>
				</div>
			</main>
		</div>
	)
}
