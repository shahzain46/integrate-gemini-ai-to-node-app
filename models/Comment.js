const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    projectId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required : true
    },
    questionId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    },
    comment:{
        type: String
    },
    isDeleted:{
        type:Boolean,
        default: false
    }
})

module.exports = mongoose.model('Comment', commentSchema);