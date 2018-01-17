let amqp = require('amqp-connection-manager')
let Broker = require('./Broker')

class AmqpBroker extends Broker {
  /**
   * @constructor
   * @param {string} url
   * @param {function} [connectListener]
   */
  constructor(url, connectListener) {
    super(url, connectListener)
    this.subscriptions = {}
  }

  _connect() {
    this.connection = amqp.connect([this.url.href])
    this.wrapper = this.connection.createChannel({
      setup: channel => {
        this.channel = channel
        for (let queue in this.subscriptions) {
          let callback = this.subscriptions[queue]
          this._subscribe(queue, callback)
        }
      },
    })
    this.wrapper.on('connect', () => {
      this.emit('connect')
    })
  }

  _publish(queue, message) {
    this.wrapper.sendToQueue(queue, Buffer.from(message))
  }

  _subscribe(queue, callback) {
    this.subscriptions[queue] = callback
    if (this.channel) {
      this.channel.assertQueue(queue)
      this.channel.consume(queue, msg => {
        if (msg !== null) {
          callback(msg.content.toString())
          this.channel.ack(msg)
        }
      })
    }
  }

  _disconnect(callback) {
    this.broker.close(callback)
  }
}

module.exports = AmqpBroker
