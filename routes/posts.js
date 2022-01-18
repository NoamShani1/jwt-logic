const router = require('express').Router()
const Post = require('../models/Post')

// route to get all posts in feed 

router.get('/', (req,res,next) => {

    Post.find()
        .populate('user')
        
        .then(posts => {
          
            console.log("POSTS", posts)
            res.status(200).json(posts)
        })
    		.catch(err => next(err))
})

// router to create a post 

router.post('/new' , (req, res, next) => {

    const {user, text} = req.body 
    Post.create({ user, text })
    .then(post => {
        res.status(201).json(post)
    })
.catch(err => next(err))
})