const Request = require('../send_request')
const { decamelizeKeys } = require('xcase')

jest.mock('xcase')

describe('Request', () => {
  const request = new Request({})

  describe('_decorate', () => {
    test('decamelize body keys', () => {
      const body = { a: 1 }
      request._decorate(body)
      expect(decamelizeKeys.mock.calls.length).toBe(1)
    })
  })
})
