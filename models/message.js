const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    conversationId:{
        type:String,
        required:true
    },
    sender:{
        type:String,
        required:true
    },
    text:{
        type:String,
        required:true
    }
},{timestamps:true})

mongoose.model('Message',messageSchema)