const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Message = mongoose.model("Message")
const requireLogin = require('../middleware/requireLogin')

//create message
router.post("/createMessage",requireLogin,(req,res)=>{
    const {conversationId,text,senderId} = req.body
    const newMessage = new Message({
        conversationId,
        text,
        sender:senderId
    })
    newMessage.save()
    .then(savedMessage => {
        console.log(savedMessage)
        res.json({savedMessage})
    })
    .catch(err=>{
        res.status(422).json({error:err})
    })
})

//show messages
router.get("/message/:convId",requireLogin,(req,res)=>{
    Message.find({conversationId:req.params.convId})
    .then(message=>res.json({message}))
    .catch(err=>{
        res.status(422).json({error:err})
    })
})

module.exports = router