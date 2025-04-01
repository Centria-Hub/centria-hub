'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { readItems } from '@directus/sdk'
import { useQuery } from '@tanstack/react-query'

import { DisplayItems } from '@/components/DisplayItems'
import Filter from '@/components/Filter'
import PaginationLayout from '@/components/PaginationLayout'
import directus from '@/lib/directus'

// Fetch events data
const fetchEvents = async (sort: string, tags: number[]) => {
	const filter: any = { status: { _eq: 'published' } }
	if (tags.length > 0) {
		filter.event_tags = { _in: tags }
	}
	return directus.request(
		readItems('events', {
			filter,
			sort: [`${sort == 'latest' ? '-start_date' : 'start_date'}`],
		})
	)
}

// Fetch events_tags_for_events data
const fetchEventsTagsForEvents = async () => {
	return directus.request(readItems('events_tags_for_events'))
}

// Fetch tags_for_events data
const fetchTagsForEvents = async () => {
	return directus.request(readItems('tags_for_events'))
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

	// Retreive news data using Tanstack query
	const { data: events = [], isLoading: isLoadingEvents } = useQuery({
		queryKey: ['events', selectedSort, selectedTags],
		queryFn: () => fetchEvents(selectedSort, selectedTags),
		staleTime: 1000 * 60 * 5, // 5 mins cache
	})

	// Retreive events_tags_for_events data using Tanstack query
	const { data: events_tags_for_events = [] } = useQuery({
		queryKey: ['events_tags_for_events'],
		queryFn: fetchEventsTagsForEvents,
		staleTime: 1000 * 60 * 10, //10 mins cache
	})

	// Retreive tags_for_events data using Tanstack query
	const { data: tags_for_events = [], isLoading: isLoadingTags } = useQuery({
		queryKey: ['tags_for_events'],
		queryFn: fetchTagsForEvents,
		staleTime: 1000 * 60 * 10, //10 mins cache
	})

	// Update URL query params
	const updateURLParams = (params: Record<string, string | number>) => {
		const newParams = new URLSearchParams(window.location.search)
		Object.entries(params).forEach(([key, value]) => {
			if (value) newParams.set(key, String(value))
			else newParams.delete(key)
		})
		router.push(`/events?${newParams.toString()}`, { scroll: false })
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

	const totalPages = Math.ceil(events.length / itemsPerPage)
	const start = (currentPage - 1) * 10
	const end = start + itemsPerPage
	const displayedEvents = events.slice(start, end)

	return (
		<div className='mx-10 my-5 flex min-h-[80vh] flex-col'>
			{/* Filter */}
			<Filter
				handleSortChange={handleSortChange}
				selectedSort={selectedSort}
				isLoadingTags={isLoadingTags}
				tags={tags_for_events}
				handleSelectedTags={handleSelectedTags}
				selectedTags={selectedTags}
			/>

			{/* Event Cards */}
			<DisplayItems
				type='event'
				isLoading={isLoadingEvents}
				displayedItems={displayedEvents}
				tags_for_post={tags_for_events}
				post_tags_for_post={events_tags_for_events}
				tagsForPostIdField='tags_for_events_id'
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
