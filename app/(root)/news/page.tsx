'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { readItems } from '@directus/sdk'
import { useQuery } from '@tanstack/react-query'

import { DisplayItems } from '@/components/DisplayItems'
import Filter from '@/components/Filter'
import PaginationLayout from '@/components/PaginationLayout'
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

// Fetch news_tags data
const fetchNewsTags = async () => {
	return directus.request(readItems('news_tags'))
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
	const { data: news_tags = [] } = useQuery({
		queryKey: ['news_tags'],
		queryFn: fetchNewsTags,
		staleTime: 1000 * 60 * 10, //10 mins cache
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
		<div className='mx-10 my-5 flex min-h-[80vh] flex-col'>
			{/* Filter */}
			<Filter
				handleSortChange={handleSortChange}
				selectedSort={selectedSort}
				isLoadingTags={isLoadingTags}
				tags={tags}
				handleSelectedTags={handleSelectedTags}
				selectedTags={selectedTags}
			/>

			{/* News Cards */}
			<DisplayItems
				type='news'
				isLoading={isLoadingNews}
				displayedItems={displayedNews}
				tags_for_post={tags}
				post_tags_for_post={news_tags}
				tagsForPostIdField='tags_id'
			/>

			{/* Pagenation */}
			<PaginationLayout
				currentPage={currentPage}
				setCurrentPage={setCurrentPage}
				totalPages={totalPages}
			/>
		</div>
	)
}
export default Page
