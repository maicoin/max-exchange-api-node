import { MAX } from '../dist/index.js';

if (!process.env.MAX_API_KEY || !process.env.MAX_API_SECRET) {
  console.error('env vars MAX_API_KEY and MAX_API_SECRET are required')
  process.exit(-1)
}

const { ws } = new MAX({ accessKey: process.env.MAX_API_KEY, secretKey: process.env.MAX_API_SECRET })
ws.subscribe('trade', 'btctwd')

ws.on('trade.snapshot', (e) => { console.log(e) })
ws.on('trade.update', (e) => { console.log(e) })

// ws.on('raw', (body) => console.log(body))
ws.on('error', (errors) => {
  console.error(errors)
})

ws.connect()