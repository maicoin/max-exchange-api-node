const WebSocketAPI = require('../lib/transports/websocket')

if (!process.env.MAX_API_KEY || !process.env.MAX_API_SECRET) {
  console.error('env vars MAX_API_KEY and MAX_API_SECRET are required')
  process.exit(-1)
}

const ws = new WebSocketAPI({ accessKey: process.env.MAX_API_KEY, secretKey: process.env.MAX_API_SECRET })
ws.on('error', (errors) => {
  console.error(errors)
})
ws.on('raw', (body) => console.log(body))
ws.on('user.account.snapshot', (accounts) => {
  console.log(accounts)
})
ws.on('user.trade.snapshot', (accounts) => {
  console.log(accounts)
})
ws.connect()
