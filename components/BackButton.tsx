'use client'

import { useRouter } from 'next/navigation'

import { buttonVariants } from '@/components/ui/button'

const BackButton = () => {
	const router = useRouter()

	return (
		<button
			onClick={() => router.back()}
			className={`${buttonVariants({ variant: 'centriaRed' })}`}
		>
			Back
		</button>
	)
}
export default BackButton
