const WebSocketAPI = require('../lib/transports/websocket')

const ws = new WebSocketAPI({ accessKey: '', secretKey: '' })

ws.subscribe('kline', 'btctwd', { interval: '1m' })
ws.subscribe('kline', 'btctwd', { interval: '5m' })
ws.subscribe('kline', 'btctwd', { interval: '1h' })

ws.on('kline.snapshot', (kline) => { console.log(kline) })
ws.on('kline.update', (kline) => { console.log(kline) })

ws.on('raw', (body) => console.log(body))
ws.connect()
