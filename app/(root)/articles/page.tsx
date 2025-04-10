'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { readItems } from '@directus/sdk'
import { useQuery } from '@tanstack/react-query'

import { DisplayItems } from '@/components/DisplayItems'
import Filter from '@/components/Filter'
import PaginationLayout from '@/components/PaginationLayout'
import directus from '@/lib/directus'

// Fetch article data
const fetchArticles = async (sort: string, tags: number[]) => {
	const filter: any = { status: { _eq: 'published' } }
	if (tags.length > 0) {
		filter.tags = { _in: tags }
	}
	return directus.request(
		readItems('articles', {
			filter,
			sort: [`${sort == 'latest' ? '-date_updated' : 'date_updated'}`],
		})
	)
}

// Fetch articles_tags
const fetchArticleTags = async () => {
	return directus.request(readItems('articles_tags'))
}

// Fetch tags
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
		if (tagsParam) setSelectedTags(tagsParam.split(',').map(Number))
		if (sortParam) setSelectedSort(sortParam)
	}, [])

	// Retrieve articles_tags using Tanstack query
	const { data: articles_tags = [] } = useQuery({
		queryKey: ['articles_tags'],
		queryFn: fetchArticleTags,
		staleTime: 1000 * 60 * 10, //10 mins cache
	})

	// Retrieve tags data using Tanstack query
	const { data: tags = [], isLoading: isLoadingTags } = useQuery({
		queryKey: ['tags'],
		queryFn: fetchTags,
		staleTime: 1000 * 60 * 10, //10 mins cache
	})

	// Map the articles_tags to get the relevant tag IDs
	const tagIdsFromArticleTags = articles_tags
		.filter((item: any) => selectedTags.includes(item.tags_id))
		.map((item: any) => item.id)

	// Retrieve articles data using Tanstack query
	const { data: articles = [], isLoading: isLoadingArticles } = useQuery({
		queryKey: ['articles', selectedSort, tagIdsFromArticleTags],
		queryFn: () => fetchArticles(selectedSort, tagIdsFromArticleTags),
		staleTime: 1000 * 60 * 5, // 5 mins cache
	})

	// Update URL query params
	const updateURLParams = (params: Record<string, string | number>) => {
		const newParams = new URLSearchParams(window.location.search)
		Object.entries(params).forEach(([key, value]) => {
			if (value) newParams.set(key, String(value))
			else newParams.delete(key)
		})
		router.push(`/articles?${newParams.toString()}`, { scroll: false })
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

	const totalPages = Math.ceil(articles.length / itemsPerPage)
	const start = (currentPage - 1) * 10
	const end = start + itemsPerPage
	const displayedArticles = articles.slice(start, end)

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

			{/* Articles Cards */}
			<DisplayItems
				type='articles'
				isLoading={isLoadingArticles}
				displayedItems={displayedArticles}
				tags={tags}
				post_tags={articles_tags}
			/>

			{/* Pagination */}
			<PaginationLayout
				currentPage={currentPage}
				setCurrentPage={setCurrentPage}
				totalPages={totalPages}
			/>
		</div>
	)
}

export default Page
