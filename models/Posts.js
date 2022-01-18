const mongoose = require("mongoose")

const PostSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.ObjectId, 
        ref: "User", 
        required: true, 
    },

    text: {
        type: String, 
        required:false, 
        trim: true,
    },
    likes: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    likesCount: {
        type: Number,
        default: 0,
      },

comments:[{type: mongoose.Schema.ObjectId, ref="Comment"}],

commentsCount:{
    type: Number,
    default: 0,
},

createdAt: {
    type: Date,
    default: Math.floor(Date.now() /1000),
  },


});


module.exports = mongoose.model("Post", PostSchema);