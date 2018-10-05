const rp = require('request-promise-native')
const qs = require('querystring')
const { decamelizeKeys } = require('xcase')
const crypto = require('crypto')
const validate = require('../utils/validate')
const saferBuffer = require('safer-buffer')
const version = require('project-version')

const Buffer = saferBuffer.Buffer

const API_HOST = 'https://max-api.maicoin.com'

const KEY_OR_SECRET_MISSING_ERROR = 'Missing API Access Key or Access Secret'

class Request {
  constructor (options) {
    this._accessKey = options.accessKey
    this._secretKey = options.secretKey

    this._currentNonce = null
    this._timeDiff = 0
  }

  /* Public Methods */
  getPublic (path, query = {}, querySchema = {}) {
    const errors = validate(query, querySchema)

    if (errors.length > 0) {
      return Promise.reject(new Error(errors))
    }

    const uri = this._fullUri(path, query)
    const headers = this._defaultHeader()
    const options = { method: 'GET', headers, uri, json: true }

    return this._send(options)
  }

  getPrivate (path, query = {}, querySchema = {}) {
    if (!this._accessKey || !this._secretKey) return Promise.reject(new Error(KEY_OR_SECRET_MISSING_ERROR))

    const errors = validate(query, querySchema)

    if (errors.length > 0) {
      return Promise.reject(new Error(errors))
    }

    const uri = this._fullUri(path, query)
    const body = this._decorate({}, path)
    const headers = Object.assign({}, this._defaultHeader(), this._authHeaders(body))
    const options = { method: 'GET', headers, uri, json: true }

    return this._send(options)
  }

  postPrivate (path, data = {}, dataSchema = {}) {
    if (!this._accessKey || !this._secretKey) return Promise.reject(new Error(KEY_OR_SECRET_MISSING_ERROR))

    const errors = validate(data, dataSchema)

    if (errors.length > 0) {
      return Promise.reject(new Error(errors))
    }

    const uri = this._fullUri(path)
    const body = this._decorate(data, path)
    const headers = Object.assign({}, this._defaultHeader(), this._authHeaders(body))
    const options = { method: 'POST', headers, uri, body, json: true }

    return this._send(options)
  }

  setTimeDiff (diff) {
    this._timeDiff = diff
  }

  /* Private Methods */
  _send (options = {}) {
    return rp(options)
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw new Error(error)
      })
  }

  _fullUri (path, query = {}) {
    let uri = `${API_HOST}${path}`

    if (Object.keys(query).length > 0) {
      uri += `?${qs.stringify(decamelizeKeys(query))}`
    }

    return uri
  }

  _defaultHeader () {
    return {
      'User-Agent': `MAX Node/${version}`
    }
  }

  _authHeaders (body) {
    const payload = Buffer.from(JSON.stringify(body)).toString('base64')
    const signature = crypto.createHmac('sha256', this._secretKey).update(payload).digest('hex')
    const headers = {
      'X-MAX-ACCESSKEY': this._accessKey,
      'X-MAX-PAYLOAD': payload,
      'X-MAX-SIGNATURE': signature
    }

    return headers
  }

  _decorate (body = {}, path = '') {
    let nonce = Date.now()

    nonce -= this._timeDiff

    if (nonce === this._currentNonce) nonce += 1

    this._currentNonce = nonce

    return Object.assign({}, { path, nonce }, decamelizeKeys(body))
  }
}

module.exports = Request
