const router = require('express').Router()
const bcrypt = require('bcryptjs')
const User = require('../models/User.model')
const jwt = require('jsonwebtoken')
const { isAuthenticated } = require('../middleware/jwt.js')

const saltRounds = 12

router.post('/signup', (req, res, next) => {

    const { email, password, name } = req.body;

    // to check if email or password are provided or if the string is empty

    if (email === '' || password === '' || name === '') {
        res.status(400).json({ message: "Provide email, password and name" });
        return;
    }


    // using regular expressions to validate the mail format 

    const emailValid = email.includes('@')
    if (!emailValid) {
        res.status(400).json({ message: 'Provide a valid email address.' });
        return;
    }

    // same thing for the passowrd validation - regex

    if (password.length < 6) {
        res.status(400).json({ message: 'Password must have at least 4 characters and contain at least one number, one lowercase and one uppercase letter.' });
        return;
    }

    // check if user already exists 

    User.findOne({ email })
        .then((foundUser) => {
            // If the user with the same email already exists, send an error response
            if (foundUser) {
                res.status(400).json({ message: "User already exists." });
                return;
            }
            // If email is unique, proceed to hash the password
            const salt = bcrypt.genSaltSync(saltRounds);
            const hashedPassword = bcrypt.hashSync(password, salt);

            // Create the new user in the database
            // We return a pending promise, which allows us to chain another `then` 
            return User.create({ email, password: hashedPassword, name });
        })
        .then((createdUser) => {
            // Deconstruct the newly created user object to omit the password
            //  never expose passwords publicly !!!!

            const { email, name, _id } = createdUser;

            // create new obj that hides password 

            const user = { email, name, _id };

            // send json response containing user obj
            res.status(201).json({ user: user });

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "Internal Server Error" })
        });
})

router.post('/login', (req, res, next) => {
    const { email, password } = req.body

    // Check if email or password or name are provided as empty string 
    if (email === '' || password === '') {
        res.status(400).json({ message: "Provide email and password" });
        return;
    }

    User.findOne({ email })
        .then(foundUser => {
            if (!foundUser) {
                res.status(400).json({ message: "User not found" });
                return;
            }
            const passwordCorrect = bcrypt.compareSync(password, foundUser.password)
			if (passwordCorrect) {
				const { _id, email, name } = foundUser
				const payload = { _id, email, name }

				// create the json web token
				const authToken = jwt.sign(
					payload,
					process.env.TOKEN_SECRET,
					{ algorithm: 'HS256', expiresIn: '12h' }
				)
				res.status(200).json({ authToken: authToken })
			}
			else {
				res.status(401).json({ message: "Unable to authenticate user" });

			}
		})
        .catch(err => {
			console.log(err);
			res.status(500).json({ message: "Internal Server Error" })
		})
});

router.get('/verify', isAuthenticated, (req, res, next) => {
	// if the token is valid we can access it on : req.payload
	console.log('request payload: ', req.payload)
	res.status(200).json(req.payload)
});


module.exports = router;