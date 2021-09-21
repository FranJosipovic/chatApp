const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Conversation = mongoose.model("Conversation")
const requireLogin = require('../middleware/requireLogin')

router.post("/create-conv",requireLogin,(req,res)=>{

    const {memberId} = req.body

    const newConversation = new Conversation({
        members:[req.user._id,memberId]
    })
    newConversation.save()
    .then(savedConversation => {
        res.json(savedConversation)
    })
    .catch(err=>{
        res.status(422).json({error:err})
    })
})

router.get("/myconversations",requireLogin,(req,res)=>{
    Conversation.find({
        members: {$in : [req.user._id]}
    })
    .populate("members","_id name email pic")
    .then(conversation=>res.json({conversation}))
    .catch(err=>{
        res.status(422).json({error:err})
    })
})

module.exports = router