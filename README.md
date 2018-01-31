Simple publish-subscribe API for several message brokers: Redis, RabbitMQ (AMQP), ActiveMQ (STOMP).

Application can utilize unified pub-sub interface and easily switch from one broker to another.

Actual modules implementing protocols are:

* [redis]
* [amqp-connection-manager] which itself is a wrapper for [amqplib]
* [stomp-client]

Module automatically reconnects and resubscribes in case of broker failure.

## Installation
`npm install metabroker`

## Example
```
const metabroker = require('metabroker')
let url = 'redis://10.192.171.251:6379'
const broker = metabroker.connect(url, () => {
  console.log('connected', url)
})
broker.subscribe('test_queue', message => {
  console.log('received:', message)
})
setInterval(() => {
  broker.publish('test_queue', new Date())
}, 1000)
```

## API

### connect([url, ][connectListener])

returns Broker instance

### Broker

### broker.subscribe(queue, callback)

callback(message)

### broker.publish(queue, message[, headers])

### broker.disconnect()

## Author
Copyright (c) 2018 Vladimir Latyshev

License: MIT

[redis]: https://www.npmjs.com/package/redis
[amqp-connection-manager]: https://www.npmjs.com/package/amqp-connection-manager
[amqplib]: https://www.npmjs.com/package/amqplib
[stomp-client]: https://www.npmjs.com/package/stomp-client
