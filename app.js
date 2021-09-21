const express = require('express')
const app = express()
const mongoose = require('mongoose')
const PORT = 5000
const {MONGOURI} = require('./config/keys')

mongoose.connect(MONGOURI,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
})
mongoose.connection.on('connected',()=>{
    console.log('connected sucesfully')
})
mongoose.connection.on('error',(err)=>{
    console.log('error connecting mbralee',err)
})

require('./models/user')
require('./models/conversation')
require('./models/message')


app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/users'))
app.use(require('./routes/conversations'))
app.use(require('./routes/messages'))

app.listen(PORT,()=>{
    console.log('server is running on port '+PORT)
})