'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

import { ArrowUpDown, Tag } from 'lucide-react'

import { news } from '@/app/data/news'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
// Temporary implementation
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

const Page = () => {
	const [selectedTags, setSelectedTags] = useState<string[]>([])
	const [selectedSort, setSelectedSort] = useState<string>()
	const [currentPage, setCurrentPage] = useState<number>(1)
	const itemsPerPage = 10

	const tags = [
		'engineering',
		'music',
		'business',
		'healthcare',
		'application',
		'research and development',
	]

	const handleSelectedTags = (tag: string) => {
		if (selectedTags.includes(tag)) {
			setSelectedTags(selectedTags.filter(selectedTag => selectedTag != tag))
		} else {
			setSelectedTags([...selectedTags, tag])
		}
	}

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
						<Select onValueChange={value => setSelectedSort(value)}>
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
						<Button
							variant={'centriaRed'}
							onClick={() => console.log('Selected Sort:', selectedSort)}
						>
							Sort
						</Button>
					</div>
				</div>
				{/* Tags */}
				<div className=''>
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
										key={tag}
										onClick={() => handleSelectedTags(tag)}
										className='cursor-pointer'
									>
										<Checkbox
											checked={selectedTags.includes(tag)}
											onCheckedChange={() => handleSelectedTags(tag)}
											className='mr-2'
										/>
										<span>
											{tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase()}
										</span>
									</div>
								))}
							</SelectContent>
						</Select>
						<Button
							variant='centriaRed'
							onClick={() => console.log('Selected Tags: ', selectedTags)}
						>
							Filter
						</Button>
					</div>
				</div>
			</div>

			{/* News Cards */}
			<div className='grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3'>
				{displayedNews.map(item => (
					<Card key={item.id}>
						<CardHeader className='md:h-1/3'>
							<CardTitle>{item.title}</CardTitle>
							<CardDescription>{item.posted_date}</CardDescription>
							<div className='flex flex-wrap gap-3'>
								{item.tags?.map(tag => (
									<Badge key={tag} variant='outline' className='w-fit'>
										{tag}
									</Badge>
								))}
							</div>
						</CardHeader>
						<CardContent className='justify-content flex flex-col items-center md:h-1/3'>
							<Image
								src={item.thumbnail}
								alt={item.title}
								width={200}
								height={200}
								className='rounded-lg object-cover shadow-md md:h-full'
							/>
						</CardContent>
						<CardFooter className='flex flex-col gap-5 md:h-1/3'>
							<p className='mt-5'>
								{item.text.length > 100
									? `${item.text.substring(0, 100)}...`
									: item.text}
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