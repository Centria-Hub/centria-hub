import Image from 'next/image'

import { CalendarDays, Clock, Euro, MapPin } from 'lucide-react'

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

import AddToCalender from './AddToCalender'

interface PostLayoutProps {
	type: 'news' | 'events' | 'articles'
	data: Record<string, any>
	tags: Record<string, any>[] | undefined
	post_tags: Record<string, any>[] | undefined
}

const PostLayout: React.FC<PostLayoutProps> = ({
	type,
	data,
	post_tags,
	tags,
}) => {
	return (
		<div className='m-5 min-h-[100vh]'>
			<Breadcrumb className='mb-5'>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href='/'>Home</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink href={`/${type}`}>
							{type.charAt(0).toUpperCase() + type.slice(1)}
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>{data[0].title}</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			{/* Posted Date & Tags */}
			<div className='mx-auto flex flex-col justify-center md:mx-10 lg:mx-24 xl:mx-40'>
				<div className='mb-5 flex flex-col gap-3 md:flex-row md:items-center'>
					<p className='text-sm text-gray-500'>
						{data[0].date_updated
							? DateFormat(data[0].date_updated)
							: DateFormat(data[0].date_created)}
					</p>
					<div className='flex flex-wrap gap-3'>
						{data[0].tags?.map((tagId: number) => {
							const data = post_tags?.find((t: any) => t.id === tagId)
							const tag = tags?.find((t: any) => t.id === data!.tags_id)
							return tag ? (
								<Badge key={tag.id} variant='outline' className='w-fit'>
									{tag.tag}
								</Badge>
							) : null
						})}
					</div>
				</div>

				{/* Title & Event Date & Location */}
				<h1 className='mb-5 text-3xl font-bold md:text-5xl'>{data[0].title}</h1>
				{type === 'events' ? (
					<div className='mb-5 flex flex-col items-start justify-between gap-4 rounded-lg bg-gray-500/10 p-5 sm:flex-row sm:items-center'>
						<div className='flex flex-col gap-3'>
							<div className='flex flex-col gap-2'>
								<div className='flex items-center text-sm'>
									<CalendarDays className='mr-2 h-4 w-4' />
									<span>
										{DateFormat(data[0].time)} - {DateFormat(data[0].end_time)}
									</span>
									<Clock className='ml-4 mr-2 h-4 w-4' />
									<span>
										{data[0].time
											.split('T')[1]
											.split(':')
											.slice(0, 2)
											.join(':')}{' '}
										-{' '}
										{data[0].end_time
											.split('T')[1]
											.split(':')
											.slice(0, 2)
											.join(':')}
									</span>
								</div>
								<div className='flex items-center text-sm'>
									<MapPin className='mr-2 h-4 w-4' />
									<span>{data[0].location}</span>
								</div>
								<div className='flex items-center text-sm'>
									<Euro className='mr-2 h-4 w-4' />
									<span>{data[0].fee}</span>
								</div>
							</div>
						</div>
						<AddToCalender
							title={data[0].title}
							start_date={data[0].time}
							end_date={data[0].end_time}
							location_address={data[0].location}
						/>
					</div>
				) : null}

				{/* Description & Image & Contents */}
				<p className='mb-5 text-xl font-semibold md:text-2xl'>
					{data[0].short_description}
				</p>
				<div className='flex justify-center'>
					<Image
						src={`${process.env.NEXT_PUBLIC_PUBLIC_URL}/assets/${data[0].image}`}
						quality={100}
						width={1280}
						height={768}
						alt={data[0].title}
						className='mb-5 h-auto w-full rounded-lg object-cover shadow-md'
					/>
				</div>
				<div
					dangerouslySetInnerHTML={{ __html: data[0].content }}
					className='mb-5 lg:text-lg'
				/>
				{/* Back Button */}
				<div className='flex justify-center'>
					<BackButton />
				</div>
			</div>
		</div>
	)
}

export default PostLayout
