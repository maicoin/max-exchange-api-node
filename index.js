const RestV2 = require('./lib/transports/rest_v2')
const SUPPORTED_REST_VERSIONS = [2]
const WSV1 = require('./lib/transports/ws')

/**
 * Client interface to commnuicate with MAX exchange Rest API v2.
 */
class MAX {
  /**
   * @param {Object} options
   * @param {string} options.accessKey
   * @param {string} options.secretKey
   */
  constructor (options = {
    accessKey: '',
    secretKey: ''
  }) {
    this._accessKey = options.accessKey || ''
    this._secretKey = options.secretKey || ''

    // init cache
    this._cache = {}
  }

  /* Public Methods */

  /**
   * Returns a new Rest API class instance (cached by version)
   *
   * @param {number} version - 2 (default)
   * @return {RestV2} transport
   */
  rest (version = 2) {
    if (!SUPPORTED_REST_VERSIONS.includes(version)) {
      throw Error(`Version ${version} is not supported, default version is 2.`)
    }

    let rest = this._readCache(this._restCacheKey(version))

    if (!rest) {
      rest = this._writeCache(this._restCacheKey(version), new RestV2({
        accessKey: this._accessKey, secretKey: this._secretKey
      }))
    }

    return rest
  }

  /**
   * Returns a new WebSocket API class instance
   *
   * @return {WSV1} transport
   */
  ws () {
    let ws = this._readCache(this._wsCacheKey())

    if (!ws) {
      ws = this._writeCache(this._wsCacheKey(), new WSV1({
        accessKey: this._accessKey, secretKey: this._secretKey
      }))
    }

    return ws
  }

  /* Private Methods */

  _writeCache (key, value) {
    this._cache[key] = value

    return this._cache[key]
  }

  _readCache (key) {
    return this._cache[key]
  }

  _restCacheKey (version) {
    return `restV${version}`
  }

  _wsCacheKey (version = 1) {
    return `wsV${version}`
  }
}

module.exports = MAX
