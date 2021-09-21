const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const conversationSchema = new mongoose.Schema({
    members:[{
        type: ObjectId,
        ref:"User"
    }]
},{timestamps:true})

mongoose.model('Conversation',conversationSchema)