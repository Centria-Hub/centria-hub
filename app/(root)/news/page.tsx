'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import { readItems } from '@directus/sdk'
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

const Page = () => {
	const router = useRouter()
	const searchParams = useSearchParams()
	const [selectedTags, setSelectedTags] = useState<number[]>(
		searchParams.get('tags')
			? searchParams.get('tags')!.split(',').map(Number)
			: []
	)
	const [selectedSort, setSelectedSort] = useState<string>(
		searchParams.get('sort') || 'latest'
	)
	const [currentPage, setCurrentPage] = useState<number>(1)
	const itemsPerPage = 10
	const [news, setNews] = useState<any[]>([])
	const [tags, setTags] = useState<any[]>([])

	// Update URL's query
	const updatedURLParams = (sort: string, tags: number[]) => {
		const params = new URLSearchParams()
		params.set('sort', sort)
		if (tags.length > 0) params.set('tags', tags.join(','))
		router.push(`/news?${params.toString()}`, { scroll: false })
	}

	// Fetch News data
	useEffect(() => {
		const getAllNews = async (selectedSort: string, selectedTags: number[]) => {
			const filter: any = { status: { _eq: 'published' } }
			if (selectedTags.length > 0) {
				filter.news_tags = { _in: selectedTags }
			}
			try {
				const data = await directus.request(
					readItems('news', {
						filter,
						sort: [
							`${selectedSort == 'latest' ? '-date_updated' : 'date_updated'}`,
						],
					})
				)
				setNews(data)
				setCurrentPage(1)
			} catch (error) {
				console.error('Failed to fetch news:', error)
				setNews([])
			}
		}
		getAllNews(selectedSort, selectedTags)
	}, [selectedSort, selectedTags])

	// Fetch Tags data
	useEffect(() => {
		const getTags = async () => {
			try {
				const data = await directus.request(readItems('tags'))
				setTags(data)
			} catch (error) {
				console.error('Failed to fetch tags:', error)
				setTags([])
			}
		}
		getTags()
	}, [])

	// Handle filter
	const handleSelectedTags = (tag: number) => {
		const newTags = selectedTags.includes(tag)
			? selectedTags.filter(t => t !== tag)
			: [...selectedTags, tag]
		setSelectedTags(newTags)
		updatedURLParams(selectedSort, newTags)
	}

	// Handle sort
	const handleSortChange = (value: string) => {
		setSelectedSort(value)
		updatedURLParams(value, selectedTags)
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
					</div>
				</div>
			</div>

			{/* News Cards */}
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
							<img
								src={`${process.env.PUBLIC_URL}/assets/${item.news_image}`}
								width={100}
								height={50}
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
								href={`/news/${item.id}?${searchParams.toString()}`}
								className={`${buttonVariants({ variant: 'centriaRed_outline', size: 'lg' })}`}
							>
								Read More
							</Link>
						</CardFooter>
					</Card>
				))}
			</div>

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
