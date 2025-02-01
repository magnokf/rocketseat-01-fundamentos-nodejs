import http from 'node:http'
import { Transform } from 'node:stream'

class InverseNumberStream extends Transform {
	_transform(chunk, encoding, callback) {
		const transformed = Number(chunk.toString()) * -1
		
		callback(null, Buffer.from(String(transformed) + '\n'))
	}
}

// req => ReadableStream
// res => WritableStream

const server = http.createServer(async (req, res) => {
	
	const fullStreamContent = req.pipe(new InverseNumberStream()).pipe(res)
	
	
	return res.end(fullStreamContent)
})

server.listen(3334)