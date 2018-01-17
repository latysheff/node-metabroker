let redis = require('redis')
let Broker = require('./Broker')

class RedisBroker extends Broker {
  /**
   * @constructor
   * @param {string} url
   * @param {function} [connectListener]
   */
  constructor(url, connectListener) {
    super(url, connectListener)
    this.callbacks = {}
  }

  _connect() {
    this.subscriber = redis.createClient(this.url.href)
    this.subscriber.on('ready', () => {
      this.emit('connect')
    })
    this.subscriber.on('error', () => {
      // ignore error
    })
    this.subscriber.on('message', (channel, message) => {
      this.callbacks[channel](message)
    })
    this.publisher = redis.createClient(this.url.href)
    this.publisher.on('error', () => {
      // ignore error
    })
  }

  _publish(queue, message) {
    this.publisher.publish(queue, message)
  }

  _subscribe(queue, callback) {
    this.subscriber.subscribe(queue)
    this.callbacks[queue] = callback
  }

  _disconnect() {
    this.subscriber.unsubscribe()
    this.subscriber.quit()
    this.publisher.quit()
  }
}

module.exports = RedisBroker
