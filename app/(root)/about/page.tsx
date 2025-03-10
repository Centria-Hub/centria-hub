import Image from 'next/image'

import { History, Tag, UserRoundPen } from 'lucide-react'

import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'

export default function AboutPage() {
	return (
		<div>
			{/* What is Centria Hub? */}
			<div className='my-20 grid grid-cols-1 md:grid-cols-2'>
				<div className='mx-auto flex w-5/6 flex-col justify-center gap-5 md:mx-0 md:ml-auto'>
					<h1 className='text-5xl'>What is Centria Hub?</h1>
					<p className='text-lg'>
						Centria Hub is a centralized digital platform that integrates all
						university resources—news, events, articles, and emails—into one
						intuitive space. It enhances accessibility, collaboration, and
						engagement for students, staff, and faculty.
					</p>
				</div>
				<div className='flex items-center justify-center py-5'>
					<Image
						width={100}
						height={100}
						src='/centria1.jpg'
						alt='Centria hub'
						className='w-2/3 rounded-full'
					/>
				</div>
			</div>
			{/* Mission */}
			<div className='grid grid-cols-1 bg-centriaRed/90 py-20 md:grid-cols-2'>
				<div className='flex items-center justify-center py-5'>
					<Image
						width={100}
						height={100}
						src='/logo.svg'
						alt='Centria hub'
						className='w-1/2'
					/>
				</div>
				<div className='mx-auto flex w-5/6 flex-col justify-center gap-5 text-white md:mx-0 md:mr-auto'>
					<h1 className='text-5xl'>Mission</h1>
					<p className='text-lg'>
						To simplify access to university resources, improve communication,
						and create a more connected campus experience.
					</p>
				</div>
			</div>
			{/* Features & Value */}
			<div className='my-20 flex flex-col justify-center gap-5'>
				<h1 className='mb-10 px-5 text-center text-5xl'>Features & Value</h1>
				<div className='mx-auto flex w-[80vw] flex-col justify-center gap-5 md:flex-row'>
					<Card className='md:w-1/3'>
						<CardHeader className='flex items-center justify-center'>
							<History size={150} color='gray' />
						</CardHeader>
						<CardContent>
							<CardTitle>
								Real-time Updates with the Latest Information
							</CardTitle>
						</CardContent>
						<CardFooter>
							<p>
								We provide the latest official announcements and important news
								from the university, always keeping the content up to date.
							</p>
						</CardFooter>
					</Card>
					<Card className='md:w-1/3'>
						<CardHeader className='flex items-center justify-center'>
							<Tag size={150} color='gray' />
						</CardHeader>
						<CardContent>
							<CardTitle>Filtering Information with Tags</CardTitle>
						</CardContent>
						<CardFooter>
							<p>
								You can easily filter and display articles related to your
								interests by using the tags available on the site.
							</p>
						</CardFooter>
					</Card>
					<Card className='md:w-1/3'>
						<CardHeader className='flex items-center justify-center'>
							<UserRoundPen size={150} color='gray' />
						</CardHeader>
						<CardContent>
							<CardTitle>Article Submission with an Editor Account</CardTitle>
						</CardContent>
						<CardFooter>
							<p>
								By creating an account and receiving approval from an
								administrator, you can submit articles. This feature also allows
								student organizations and club activities to share their
								information.
							</p>
						</CardFooter>
					</Card>
				</div>
			</div>
		</div>
	)
}
