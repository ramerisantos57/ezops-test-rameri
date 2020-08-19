var express = require('express');
var bodyParser = require('body-parser')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var mongoose = require('mongoose')

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

var Message = mongoose.model('Message', {
    name: String,
    message: String
})

var dbUrl = 'mongodb+srv://simple-chat-server:i8Ev93ApVr59Q@cluster0.a0ez5.mongodb.net/simple-chat?retryWrites=true&w=majority'

app.get('/teste', (req, res) => {
    res.send('teste')
})

app.get('/messages', (req, res) => {
    Message.find({}, (err, messages) => res.send(messages))
})

app.get('/messages/:user', (req, res) => {
    var user = req.params.user
    Message.find({ name: user }, (err, messages) => res.send(messages))
})

app.post('/messages', async (req, res) => {
    try {
        var message = new Message(req.body)
        await message.save()
        console.log('saved')

        var censored = await Message.findOne({ message: 'badword' })
        if (censored)
            await Message.remove({ _id: censored.id })
        else
            io.emit('message', req.body)

        res.sendStatus(200)
    }
    catch (error) {
        res.sendStatus(500)
        return console.log('error', error)
    }
    finally {
        console.log('Message Posted')
    }
})

io.on('connection', () => console.log('a user is connected'))

mongoose.connect(dbUrl, { useMongoClient: true }, (err) => console.log('mongodb connected', err))

var server = http.listen(80, () => {
    console.log('server is running on port', server.address().port)
})