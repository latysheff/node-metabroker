let stomp = require('stomp-client')
let Broker = require('./Broker')

class StompBroker extends Broker {
  /**
   * @constructor
   * @param {string} url
   * @param {function} [connectListener]
   */
  constructor(url, connectListener) {
    super(url, connectListener)
    this.config = {
      host: this.url.hostname,
      port: this.url.port,
      reconnectOpts: { retries: Infinity, delay: 500 },
    }
  }

  _connect() {
    this.broker = new stomp.StompClient(this.config)
    this.broker.on('connect', () => {
      this.emit('connect')
    })
    this.broker.on('reconnect', () => {
      this.emit('connect')
    })
    this.broker.on('error', () => {
      // ignore error
    })
    this.broker.connect()
  }

  _publish(queue, message) {
    // todo cache messages, as in other brokers
    this.broker.publish('/queue/' + queue, message, { persistent: true })
  }

  _subscribe(queue, callback) {
    if (this.connected) {
      this.broker.subscribe('/queue/' + queue, callback)
    } else {
      this.once('connect', () => {
        this.broker.subscribe('/queue/' + queue, callback)
      })
    }
  }

  _disconnect(callback) {
    this.broker.disconnect(callback)
  }
}

module.exports = StompBroker
