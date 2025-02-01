import http from 'node:http'
import { Transform } from 'node:stream'


class InverseNumberStream extends Transform {
	
	_transform(chunk, encoding, callback) {
		const transformed = Number(chunk.toString()) * -1;
		callback(null, transformed.toString());
	}
}

const server = http.createServer( async (req, res) => {
	const buffers = []
	
	for await (const chunk of req) {
		buffers.push(chunk)
	}
	
	const fullStreamContent = Buffer.concat(buffers).toString()
	
	return res.end(fullStreamContent)
	
	
	// res.setHeader('Content-Type', 'text/plain')
	// new InverseNumberStream()
	// 	.pipe(res)
})

server.listen(3333)
