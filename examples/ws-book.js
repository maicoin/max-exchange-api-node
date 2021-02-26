const WebSocketAPI = require('../lib/transports/websocket')
const WebSocketBook = require('../lib/websocket_book')

const ws = new WebSocketAPI({ accessKey: '', secretKey: '' })
const book = new WebSocketBook(ws, 'btctwd', 10)

book.onUpdate((book) => {
  book.pretty()
})

ws.on('error', (errors) => {
  console.error(errors)
})
// ws.on('raw', (body) => console.log(body) )
ws.connect()
