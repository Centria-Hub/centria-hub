import Link from 'next/link'

import { buttonVariants } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '@/components/ui/carousel'

import DateFormat from './DateFormat'

export interface CarouselLayoutProps {
	title: string
	post: Record<string, any>[]
	link: string
	buttonText: string
}

const CarouselLayout = ({
	title,
	post,
	link,
	buttonText,
}: CarouselLayoutProps) => {
	return (
		<>
			<h1 className='my-10 text-center text-4xl font-semibold'>{title}</h1>
			<Carousel className='w-[70%] md:w-[80%]'>
				<CarouselContent>
					{post.map(item => (
						<CarouselItem
							key={item.id}
							className='gap-5 transition-transform duration-300 hover:scale-105 md:basis-1/2 lg:basis-1/3'
						>
							<Link href={`${link}/${item.slug}`}>
								<Card className='relative min-h-72 w-full overflow-hidden'>
									{/* Image */}
									<div
										className='absolute inset-0 z-0 bg-cover bg-center'
										style={{
											backgroundImage: `url(${process.env.NEXT_PUBLIC_PUBLIC_URL}/assets/${item.image})`,
										}}
									></div>
									{/* Overlay (optional: to improve text readability) */}
									<div className='absolute inset-0 z-10 bg-gradient-to-b from-black/70 via-black/30 to-transparent'></div>
									{/* Content */}
									<div className='relative z-20 flex h-full flex-col p-5'>
										<div className='text-tiny font-bold uppercase text-white/60'>
											{item.date_updated
												? DateFormat(item.date_updated)
												: DateFormat(item.date_created)}
										</div>
										<div className='text-xl font-semibold text-white'>
											{item.title}
										</div>
									</div>
								</Card>
							</Link>
						</CarouselItem>
					))}
				</CarouselContent>
				<CarouselPrevious />
				<CarouselNext />
			</Carousel>
			<Link
				href={link}
				className={`${buttonVariants({ variant: 'centriaRed', size: 'lg' })} my-10`}
			>
				{buttonText}
			</Link>
		</>
	)
}

CarouselLayout.displayName = 'CarouselLayout'

export default CarouselLayout
