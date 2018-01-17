const events = require('events')
const { URL } = require('url')

class Broker extends events.EventEmitter {
  /**
   * @constructor
   * @param {string} url
   * @param {function} [connectListener]
   */
  constructor(url, connectListener) {
    super()
    this.url = new URL(url)
    this.on('connect', () => {
      // todo to set to false for any broker type in case of errors
      this.connected = true
    })
    if (typeof connectListener === 'function') {
      this.on('connect', connectListener)
    }
  }

  /**
   * Connect to broker
   */
  connect() {
    this._connect()
  }

  /**
   * Publish message to queue
   * @param {string} queue
   * @param {string} message
   */
  publish(queue, message) {
    if (typeof message !== 'string') message = message.toString()
    this._publish(queue, message)
  }

  /**
   * Subscribe to queue
   * @param {string} queue
   * @param {function} callback
   */
  subscribe(queue, callback) {
    if (typeof queue !== 'string' || queue.length === 0) {
      throw new Error('queue should be not empty string')
    }
    if (typeof callback !== 'function') {
      throw new Error('function should be function')
    }
    this._subscribe(queue, callback)
  }

  /**
   * Disconnect from broker
   * @param {function} callback
   */
  disconnect(callback) {
    this.closed = true
    this._disconnect(callback)
  }
}

module.exports = Broker
