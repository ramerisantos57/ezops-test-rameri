var exec = require('child_process').exec
var http = require('http')
var createHandler = require('github-webhook-handler')
var handler = createHandler({ path: '/webhook', secret: 'lksdjfkljdsf98743587dfj43098234ekmdf784y5nf348ht' })

http.createServer((req, res) => {
    handler(req, res, (err) => {
        res.statusCode = 404
        res.end('no such location')
    })
}).listen(7777)

handler.on('push', (event) => {
    exec('cd /home/ec2-user/ezops-test-rameri && git pull && npm install', (error, stdout) => console.log(stdout))
})