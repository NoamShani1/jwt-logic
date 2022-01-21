const router = require('express').Router()
const Post = require('../models/Post')

// route to get all posts in feed 

router.get('/', (req, res, next) => {

    Post.find()
        .populate('user')

        .then(posts => {

            console.log("POSTS", posts)
            res.status(200).json(posts)
        })
        .catch(err => next(err))
})

// router to create a post 

router.post('/new', (req, res, next) => {

    const { user, text } = req.body
    Post.create({ user, text })
        .then(post => {
            res.status(201).json(post)
        })
        .catch(err => next(err))
})


// route to give post by user id  - get with id

router.get('/post/:id', (req, res, next) => {

    Post.findById(req.params.id)
        .then(post => {
            // check for a valid mongo object id 
            if (!post) {
                res.status(404).json(post)
            } else {
                res.status(200).json(post)
            }

        })

        .catch(err => next(err))

})

router.put('/post/:id', (req, res, next) => {
	const { user, text, likes, comments, createdAt } = req.body
	Post.findByIdAndUpdate(req.params.id, {
		user,
		text,
		likes,
		comments,
		createdAt
	}, { new: true })
		.then(updatedPost => {
			res.status(200).json(updatedPost)
		})
		.catch(err => next(err))
})


// delete post route 

router.delete('/:id', (req, res, next) => {
	Post.findByIdAndDelete(req.params.id)
		.then(() => {
			res.status(200).json({ message: 'Post has been deleted' })
		})
});


