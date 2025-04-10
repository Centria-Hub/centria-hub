import { ArrowUpDown, Tag } from 'lucide-react'

import { Checkbox } from '@/components/ui/checkbox'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'

type FilterProps = {
	handleSortChange: (value: string) => void
	selectedSort: string
	isLoadingTags: boolean
	tags: Record<string, any>[]
	handleSelectedTags: (value: number) => void
	selectedTags: number[]
}

const Filter = ({
	handleSortChange,
	selectedSort,
	isLoadingTags,
	tags,
	handleSelectedTags,
	selectedTags,
}: FilterProps) => {
	return (
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
								{tags.map((tag: any) => (
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
	)
}

export default Filter
