import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import sharp from 'sharp'

export default buildConfig({
	serverURL: process.env.SERVER_URL,

	editor: lexicalEditor(),

	collections: [],

	secret: process.env.PAYLOAD_SECRET || '',

	db: mongooseAdapter({
		url: process.env.DATABASE_URI!,
		migrationDir: './migrations',
	}),
	sharp,
})