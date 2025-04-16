import Image from 'next/image'

import { CalendarDays } from 'lucide-react'

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
					<div className='mb-5 flex flex-col gap-3'>
						<div className='flex flex-row items-center gap-3'>
							<CalendarDays />
							<h1 className='text-sm font-bold md:text-xl'>
								{`${DateFormat(data[0].time)}`}
							</h1>
							<AddToCalender
								title={data[0].title}
								start_date={data[0].time}
								end_date={data[0].time}
							/>
						</div>
						{/* <div className='flex flex-row gap-3'>
						<Euro />
						{data[0].is_free ? (
							<h1 className='text-sm font-bold md:text-xl'>Free</h1>
						) : (
							<h1 className='text-sm font-bold md:text-xl'>{data[0].fee}</h1>
						)}
					</div>
					{data[0].location_address ? (
						<div className='flex flex-row flex-wrap items-center gap-3 overflow-visible'>
							<MapPin />
							<h1 className='text-sm font-bold md:text-xl'>
								{data[0].location_address}
							</h1>
							<OpenMapButton location_address={data[0].location_address} />
						</div>
					) : null} */}
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
