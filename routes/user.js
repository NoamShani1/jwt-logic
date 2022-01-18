const router = require('express').Router()
const { fileUploader, cloudinary } = require('../config/cloudinary.config');
const { isAuthenticated } = require('../middleware/jwt.js')
const User = require('../models/User.model')
