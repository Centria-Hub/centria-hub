import Image from 'next/image'

import { CalendarDays, Euro, MapPin } from 'lucide-react'

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
import OpenMapButton from './OpenMapButton'

interface PostLayoutProps {
	breadcrumbPath: string
	type: 'news' | 'event' | 'article'
	data: Record<string, any>
	titleField: string
	tagIdsField: string
	tags: Record<string, any>[] | undefined
	imageField: string
	contentField: string
}

const PostLayout: React.FC<PostLayoutProps> = ({
	breadcrumbPath,
	type,
	data,
	titleField,
	tagIdsField,
	tags,
	imageField,
	contentField,
}) => {
	return (
		<div className='mx-10 my-5 min-h-[100vh]'>
			<Breadcrumb className='mb-5'>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href='/public'>Home</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink href={breadcrumbPath}>{type}</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>{data[titleField]}</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			{/* Posted Date & Tags & AddToCalenderButton */}
			<div className='mb-5 flex flex-col gap-3 md:flex-row md:items-center'>
				<p className='text-sm text-gray-500'>
					{data.date_updated
						? DateFormat(data.date_updated)
						: DateFormat(data.date_created)}
				</p>
				<div className='flex flex-wrap gap-3'>
					{data[tagIdsField]?.map((tagId: number) => {
						const tag = tags?.find((t: any) => t.id == tagId)
						return tag ? (
							<Badge key={tag.id} variant='outline' className='w-fit'>
								{type === 'article' ? tag.name : tag.tag}
							</Badge>
						) : null
					})}
				</div>
				{type === 'event' ? (
					<AddToCalender
						title={data.title}
						start_date={data.start_date}
						end_date={data.end_date}
						location_address={data.location_address}
					/>
				) : null}
			</div>

			{/* Title & Event Date & Image & Text */}
			<h1 className='mb-5 text-3xl font-bold md:text-5xl'>
				{data[titleField]}
			</h1>
			{type === 'event' ? (
				<div className='mb-5 flex flex-col gap-3'>
					<div className='flex flex-row gap-3'>
						<CalendarDays />
						<h1 className='text-sm font-bold md:text-xl'>
							{!data.end_date
								? `${DateFormat(data.start_date)}`
								: `${DateFormat(data.start_date)} - ${DateFormat(data.end_date)}`}
						</h1>
					</div>
					<div className='flex flex-row gap-3'>
						<Euro />
						{data.is_free ? (
							<h1 className='text-sm font-bold md:text-xl'>Free</h1>
						) : (
							<h1 className='text-sm font-bold md:text-xl'>{data.fee}</h1>
						)}
					</div>
					{data.location_address ? (
						<div className='flex flex-row flex-wrap items-center gap-3 overflow-visible'>
							<MapPin />
							<h1 className='text-sm font-bold md:text-xl'>
								{data.location_address}
							</h1>
							<OpenMapButton location_address={data.location_address} />
						</div>
					) : null}
				</div>
			) : null}
			<p className='mb-5 text-xl font-semibold md:text-2xl lg:mx-40'>
				{data.short_description}
			</p>
			<div className='mx-auto flex max-w-[50vw] justify-center'>
				<Image
					src={`${process.env.NEXT_PUBLIC_PUBLIC_URL}/assets/${data[imageField]}`}
					quality={100}
					width={1280}
					height={768}
					alt={data[titleField]}
					className='mb-5 h-auto w-full rounded-lg object-cover shadow-md'
				/>
			</div>
			<div
				dangerouslySetInnerHTML={{ __html: data[contentField] }}
				className='mb-5 lg:mx-40 lg:text-lg'
			/>
			{/* Back Button */}
			<div className='flex justify-center'>
				<BackButton />
			</div>
		</div>
	)
}

export default PostLayout
