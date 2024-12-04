const mongoose = require('mongoose'); 

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a project name'],
    maxlength: 100,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide the user ID of the creator'],
  },
  createdAt:{
    type: Date,
    default: Date.now()
  },
  isDeleted:{
    type:Boolean,
    default:false
  }
});

module.exports = mongoose.model('Project', ProjectSchema);
