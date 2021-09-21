const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/keys')

router.post('/signup',(req,res)=>{
    const {name,email,password} = req.body
    if(!(name || email || password)){
        return res.status(422).json({error:"you need to fill all the fields"})
    }
    else{
        User.findOne({email:email})
        .then(user=>{
            if(user){
                return res.status(422).json({error:"user already exists"})
            }
            else{
                bcrypt.hash(password,10)
                .then(hashedPassword=>{
                    const user = new User({
                        name,
                        email,
                        password:hashedPassword,
                    })
                    user.save()
                    .then(savedUser=>{
                        console.log(savedUser)
                        res.json({message:"user saved succesfully"})
                    })
                })
            }
        })
        .catch(err=>{
            console.log(err)
        })
    }
})

router.post('/signin',(req,res)=>{
    const {email,password} = req.body
    if(!(email || password)){
        return res.status(422).json({error:"no email or password"})
    }
    else{
        User.findOne({email:email})
        .then(savedUser=>{
            if(!savedUser){
                return res.status(422).json({error:"invalid eamil or password"})
            }
            else{
                bcrypt.compare(password,savedUser.password)
                .then(isCorrect=>{
                    if(isCorrect){
                        const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
                        res.json({token,user:savedUser})
                    }
                    else{
                        return res.status(422).json({error:"invalid email or pssword"})
                    }
                })
            }
        })
        .catch(err=>{
            console.log(err)
        })
    }
})

module.exports = router