import { parse } from 'csv-parse'
import fs from 'node:fs'

const csvPath = new URL('./tasks_rocket.csv', import.meta.url)
const stream = fs.createReadStream(csvPath)

const csvParse = parse({
	delimiter: ',',
	skipEmptyLines: true,
	fromLine: 2  // skip the header line
})

async function run() {
	const linesParse = stream.pipe(csvParse)
	
	// Add error handling
	stream.on('error', (error) => {
		console.error('Error reading file:', error)
	})
	
	try {
		for await (const line of linesParse) {
			const [title, description] = line
			
			try {
				const response = await fetch('http://localhost:3333/tasks', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						title,
						description,
					})
				})
				
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`)
				}
				
				console.log(`✓ Imported task: ${title}`)
				
				// Uncomment to see the import working in slow motion
				// await wait(1000)
			} catch (error) {
				console.error(`Failed to import task "${title}":`, error)
			}
		}
		console.log('Import completed!')
	} catch (error) {
		console.error('Error processing CSV:', error)
	}
}

function wait(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms))
}

run().then(r => r)