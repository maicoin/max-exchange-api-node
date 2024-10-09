import { MAX, WebSocketBook } from '../dist/index.js';

if (!process.env.MAX_API_KEY || !process.env.MAX_API_SECRET) {
  console.error('env vars MAX_API_KEY and MAX_API_SECRET are required')
  process.exit(-1)
}

const { ws } = new MAX({ accessKey: process.env.MAX_API_KEY, secretKey: process.env.MAX_API_SECRET })
const book = new WebSocketBook(ws, 'btctwd', 10)

book.onUpdate((book) => {
  book.pretty()
})

ws.on('error', (errors) => {
  console.error(errors)
})
// ws.on('raw', (body) => console.log(body) )
ws.connect()