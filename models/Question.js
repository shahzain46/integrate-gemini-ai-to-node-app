const mongoose = require('mongoose'); 
const Project = require('./Project'); 

const QuestionSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: [true, 'Please provide project ID']
  },
  question: {
    type: String,
    required: [true, 'Please provide a question'],
  },
  answer: {
    type: String, // This will store the answer
  }
});

module.exports = mongoose.model('Question', QuestionSchema);
