'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'

import { readItems } from '@directus/sdk'
import { useQuery } from '@tanstack/react-query'
import { ArrowUpDown, Tag } from 'lucide-react'

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
import { Checkbox } from '@/components/ui/checkbox'
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import directus from '@/lib/directus'

// Fetch news data
const fetchNews = async (sort: string, tags: number[]) => {
	const filter: any = { status: { _eq: 'published' } }
	if (tags.length > 0) {
		filter.news_tags = { _in: tags }
	}
	return directus.request(
		readItems('news', {
			filter,
			sort: [`${sort == 'latest' ? '-date_updated' : 'date_updated'}`],
		})
	)
}

// Fetch tags data
const fetchTags = async () => {
	return directus.request(readItems('tags'))
}

const Page = () => {
	const router = useRouter()

	// State for selected tags, sort and pagination
	const [selectedTags, setSelectedTags] = useState<number[]>([])
	const [selectedSort, setSelectedSort] = useState<string>('latest')
	const [currentPage, setCurrentPage] = useState<number>(1)
	const itemsPerPage = 10

	// Handle URL query params (load from URL)
	useEffect(() => {
		const params = new URLSearchParams(window.location.search)

		// Update state based on query params
		const tagsParam = params.get('tags')
		const sortParam = params.get('sort')
		if (tagsParam) {
			setSelectedTags(tagsParam.split(',').map(Number))
		}
		if (sortParam) {
			setSelectedSort(sortParam)
		}
	}, [])

	// Retreive news data using Tanstack query
	const { data: news = [], isLoading: isLoadingNews } = useQuery({
		queryKey: ['news', selectedSort, selectedTags],
		queryFn: () => fetchNews(selectedSort, selectedTags),
		staleTime: 1000 * 60 * 5, // 5 mins cache
	})

	// Retreive tags data using Tanstack query
	const { data: tags = [], isLoading: isLoadingTags } = useQuery({
		queryKey: ['tags'],
		queryFn: fetchTags,
		staleTime: 1000 * 60 * 10, //10 mins cache
	})

	// Update URL query params
	const updateURLParams = (params: Record<string, string | number>) => {
		const newParams = new URLSearchParams(window.location.search)
		Object.entries(params).forEach(([key, value]) => {
			if (value) newParams.set(key, String(value))
			else newParams.delete(key)
		})
		router.push(`/news?${newParams.toString()}`, { scroll: false })
	}

	// Handle tag selection
	const handleSelectedTags = (tag: number) => {
		const newTags = selectedTags.includes(tag)
			? selectedTags.filter(t => t !== tag)
			: [...selectedTags, tag]
		setSelectedTags(newTags)
		updateURLParams({ tags: newTags.join(',') })
	}

	// Handle sort change
	const handleSortChange = (value: string) => {
		setSelectedSort(value)
		updateURLParams({ sort: value })
	}

	// Pagination
	const totalPages = Math.ceil(news.length / itemsPerPage)
	const start = (currentPage - 1) * 10
	const end = start + itemsPerPage
	const displayedNews = news.slice(start, end)

	return (
		<div className='mx-10 my-5'>
			{/* Filter */}
			<div className='flex flex-col gap-5 md:flex-row'>
				{/* Sort */}
				<div>
					<div className='mb-3 flex flex-row gap-1'>
						<ArrowUpDown />
						<h1 className='font-bold'>Sort</h1>
					</div>
					<div className='flex flex-row gap-3'>
						<Select onValueChange={handleSortChange} value={selectedSort}>
							<SelectTrigger className='w-[180px]'>
								<SelectValue placeholder='Publication date' />
							</SelectTrigger>
							<SelectContent className='bg-white'>
								<SelectItem value='latest' className='cursor-pointer'>
									Latest
								</SelectItem>
								<SelectItem value='oldest' className='cursor-pointer'>
									Oldest
								</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
				{/* Tags */}
				<div>
					<div className='mb-3 flex flex-row gap-1'>
						<Tag />
						<h1 className='font-bold'>Tags</h1>
					</div>
					<div className='flex flex-wrap gap-3 pb-5'>
						{isLoadingTags ? (
							<p>Loading...</p>
						) : (
							<Select>
								<SelectTrigger className='w-[180px]'>
									<SelectValue placeholder='Select Tags' />
								</SelectTrigger>
								<SelectContent className='bg-white'>
									{tags.map(tag => (
										<div
											key={tag.id}
											onClick={() => handleSelectedTags(tag.id)}
											className='cursor-pointer'
										>
											<Checkbox
												checked={selectedTags.includes(tag.id)}
												onCheckedChange={() => handleSelectedTags(tag.id)}
												className='mr-2'
											/>
											<span>{tag.tag}</span>
										</div>
									))}
								</SelectContent>
							</Select>
						)}
					</div>
				</div>
			</div>

			{/* News Cards */}
			<Suspense>
				{isLoadingNews ? (
					<p>Loading...</p>
				) : (
					<div className='grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3'>
						{displayedNews.map(item => (
							<Card key={item.id}>
								<CardHeader className=''>
									<CardTitle>{item.news_name}</CardTitle>
									<CardDescription>
										{item.date_updated
											? DateFormat(item.date_updated)
											: DateFormat(item.date_created)}
									</CardDescription>
									<div className='flex flex-wrap gap-3'>
										{item.news_tags?.map((tagId: number) => {
											const tag = tags.find((t: any) => t.id === tagId)
											return tag ? (
												<Badge key={tag.id} variant='outline' className='w-fit'>
													{tag.tag}
												</Badge>
											) : null
										})}
									</div>
								</CardHeader>
								<CardContent className='justify-content flex flex-col items-center'>
									<Image
										src={`${process.env.NEXT_PUBLIC_PUBLIC_URL}/assets/${item.news_image}`}
										quality={100}
										width={1280}
										height={768}
										alt={item.news_name}
										className='mb-5 h-auto w-full rounded-lg object-cover shadow-md'
									/>
								</CardContent>
								<CardFooter className='flex flex-col gap-5'>
									<p className='mt-5'>
										{item.short_description.length > 100
											? `${item.short_description.substring(0, 100)}...`
											: item.short_description}
									</p>
									<Link
										href={`/news/${item.id}`}
										className={`${buttonVariants({ variant: 'centriaRed_outline', size: 'lg' })}`}
									>
										Read More
									</Link>
								</CardFooter>
							</Card>
						))}
					</div>
				)}
			</Suspense>

			{/* Pagenation */}
			<Pagination className='mt-5'>
				<PaginationContent>
					<PaginationItem>
						<PaginationPrevious
							className={`${currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''}`}
							onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
						/>
					</PaginationItem>
					{/* Page Number */}
					{[...Array(totalPages)].map((_, index) => (
						<PaginationItem key={index}>
							<PaginationLink
								isActive={currentPage === index + 1}
								onClick={() => setCurrentPage(index + 1)}
							>
								{index + 1}
							</PaginationLink>
						</PaginationItem>
					))}
					<PaginationItem>
						<PaginationNext
							className={`${currentPage === totalPages ? 'cursor-not-allowed opacity-50' : ''}`}
							onClick={() =>
								setCurrentPage(prev => Math.min(prev + 1, totalPages))
							}
						/>
					</PaginationItem>
				</PaginationContent>
			</Pagination>
		</div>
	)
}
export default Page