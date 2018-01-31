const {URL} = require('url')

const RedisBroker = require('./lib/redis-broker')
const AmqpBroker = require('./lib/amqp-broker')
const StompBroker = require('./lib/stomp-broker')

/**
 * Connect to message broker
 * @param {string} url
 * @param {function} [connectListener]
 */
function connect(url, connectListener) {
  this.url = new URL(url)
  const type = this.url.protocol.slice(0, -1)
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
  connect
}
