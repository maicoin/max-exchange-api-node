const WebSocketAPI = require('../lib/transports/websocket')

const ws = new WebSocketAPI({ accessKey: '', secretKey: '' })

ws.subscribe('trade', 'btctwd')

ws.on('trade.snapshot', (e) => { console.log(e) })
ws.on('trade.update', (e) => { console.log(e) })

ws.on('raw', (body) => console.log(body))
ws.on('error', (errors) => {
  console.error(errors)
})

ws.connect()
