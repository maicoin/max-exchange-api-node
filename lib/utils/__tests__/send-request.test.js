const Request = require('../send_request')

describe('Request', () => {
  const request = new Request({})

  describe('_decorate', () => {
    test('includes given path and nonce', () => {
      const body = request._decorate({ a: 1 })
      expect(body).toMatchObject({ path: '', a: 1 })
      expect(typeof body.nonce).toBe('number')

      const body2 = request._decorate({ foo: 'bar', answer: { universe: 42 } }, '/path')
      expect(body2).toMatchObject({ path: '/path', foo: 'bar', answer: { universe: 42 } })
      expect(typeof body2.nonce).toBe('number')
    })
  })

  describe('_fullUri', () => {
    test('use array format without indices', () => {
      const uri = request._fullUri('/path', { value: ['a', 'b', 'c'] })
      expect(decodeURIComponent(uri).endsWith('value[]=a&value[]=b&value[]=c')).toBe(true)
    })
  })
})
