const express = require("express")
const mongoose = require("mongoose")
require("dotenv").config()
const bodyParser = require("body-parser")
const app = express()
const http = require("http").Server(app)
const port = process.env.PORT || 3010
const io = require("socket.io")(http)

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(express.json())
app.use(bodyParser.urlencoded({extended: false}))

mongoose.connect(process.env.DATABASE,{
    useUnifiedTopology: true,
    useNewUrlParser: true
})

mongoose.connection.on("error", (err) => {
    console.log("MongoDB Connection Failed: " + err.message)
})

mongoose.connection.once("open", () => {
    console.log("Successfully connected to MongoDB!")
})

io.on("connection", (socket) => {
    console.log("User Connection Established!")
})




const Message1 = mongoose.model("Message1", {
    name: {type: String, required: true},
    message: {type: String, required: true}
})

app.get('/messages1', (req, res) => {
    Message1.find({}, (err,messages1) => {
        res.send(messages1)
    })
})

app.post('/messages1', (req, res) => {
    const message = new Message1 (req.body)

    message.save((err) => {
        if (err) {
            (res.sendStatus(500))
        } else {
            res.sendStatus(200)
            io.emit("message", req.body)
        }
    })
})


const server = http.listen(port, () => {
    console.log("Server works at port %d", port, "!!!")
})