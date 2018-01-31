const metabroker = require('../')

const url = 'amqp://10.192.171.251:5672'
const broker = metabroker.connect(url, () => {
  console.log('connected', url)
})
broker.subscribe('test_queue', message => {
  console.log('received:', message)
})
setInterval(() => {
  broker.publish('test_queue', new Date())
}, 1000)
