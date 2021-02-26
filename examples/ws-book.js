const WebSocketAPI = require('../lib/transports/websocket')

const ws = new WebSocketAPI({ accessKey: '', secretKey: '' })
ws.subscribe('book', 'btctwd', { depth: 10 })
ws.on('book.snapshot', (e) => {
  console.log(e)
})
ws.on('book.update', (e) => {
  console.log(e)
})

// ws.on('raw', (body) => console.log(body) )
ws.connect()
