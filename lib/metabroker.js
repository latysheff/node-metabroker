const { URL } = require('url')

let RedisBroker = require('./RedisBroker')
let AmqpBroker = require('./AmqpBroker')
let StompBroker = require('./StompBroker')

/**
 * Connect to message broker
 * @param {string} url
 * @param {function} [connectListener]
 */
function connect(url, connectListener) {
  this.url = new URL(url)
  let type = this.url.protocol.slice(0, -1)
  let broker
  switch (type) {
    case 'redis':
      broker = new RedisBroker(url, connectListener)
      break
    case 'amqp':
      broker = new AmqpBroker(url, connectListener)
      break
    case 'stomp':
      broker = new StompBroker(url, connectListener)
      break
    default:
  }
  broker.connect()
  return broker
}

module.exports = {
  connect,
}
