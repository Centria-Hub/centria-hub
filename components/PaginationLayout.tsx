import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination'

type PaginationProps = {
	currentPage: number
	setCurrentPage: (value: number | ((prev: number) => number)) => void
	totalPages: number
}
const PaginationLayout = ({
	currentPage,
	setCurrentPage,
	totalPages,
}: PaginationProps) => {
	return (
		<Pagination className='mt-5 grow items-end'>
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
	)
}
export default PaginationLayout
