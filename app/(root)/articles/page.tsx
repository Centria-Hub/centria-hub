'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

import { ArrowUpDown, Tag } from 'lucide-react'

import { articles } from '@/app/data/articles'
import DateFormat from '@/components/DateFormat'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
// Temporary implementation
import {
	Card,
	CardContent,
	CardDescription,
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

	const totalPages = Math.ceil(articles.length / itemsPerPage)
	const start = (currentPage - 1) * 10
	const end = start + itemsPerPage
	const displayedArticles = articles.slice(start, end)

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
								<SelectValue placeholder='Event date' />
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

			{/* Articles Cards */}
			<div className='grid grid-cols-1 gap-5'>
				{displayedArticles.map(item => (
					<Card key={item.id} className='flex flex-col md:flex-row'>
						<CardHeader className='flex-1'>
							<CardTitle>{item.title}</CardTitle>
							<CardDescription>{DateFormat(item.posted_date)}</CardDescription>
							<div className='flex flex-wrap gap-3'>
								{item.tags?.map(tag => (
									<Badge key={tag} variant='outline' className='w-fit'>
										{tag}
									</Badge>
								))}
							</div>
							<p className='mt-5'>
								{item.text.length > 100
									? `${item.text.substring(0, 200)}...`
									: item.text}
							</p>
							<Link
								href={`/articles/${item.id}`}
								className={`${buttonVariants({ variant: 'centriaRed_outline', size: 'lg' })} w-fit`}
							>
								Read More
							</Link>
						</CardHeader>
						<CardContent className='flex items-center justify-center md:my-auto md:justify-start md:!pb-0 md:!pl-0'>
							<Image
								src={item.thumbnail}
								alt={item.title}
								width={200}
								height={133}
								className='h-[133px] w-[200px] rounded-lg object-cover shadow-md'
							/>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Pagenation */}
			<Pagination className='mt-5'>
				<PaginationContent>
					<PaginationItem>
						<PaginationPrevious
							className={`${currentPage === 1 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
							onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
						/>
					</PaginationItem>
					{/* Page Number */}
					{[...Array(totalPages)].map((_, index) => (
						<PaginationItem key={index} className='cursor-pointer'>
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
							className={`${currentPage === totalPages ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
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