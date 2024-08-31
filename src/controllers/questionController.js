const fs = require('fs');
const path = require('path');
const speech = require('@google-cloud/speech'); // Import the speech-to-text SDK
const client = new speech.SpeechClient();

const convertVoiceToText = require('../../utils/voicetotext');
const { uploadToGCS } = require('../../services/gcsService');

const uploadFile = require("../../utils/uploadFile")

const Question = require('../models/Question');
// const openaiService  = require('../../services/openai'); 
const { GoogleGenerativeAI } = require('@google/generative-ai');

// const { OpenAI } = require('openai');

// const openai = new OpenAI({
//   apiKey: process.env.API_KEY,
// });
// const genAI = new GoogleGenerativeAI({
//   apiKey: process.env.API_KEY,
// });
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

function fileToGenerativePart(filePath, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(filePath)).toString("base64"),
      mimeType,
    },
  };
}





// Get all questions for a project


// const askQuestion = async (req, res) => {
//   const { projectId } = req.params;
//   try {
//     const prompt = req.body.prompt || null;
//     let imagePart = null;

//     // Check if at least one input is provided
//     if (!prompt && !req.file) {
//       return res.status(400).json({ success: false, message: 'Prompt or image is required' });
//     }

//     if (req.file) {
//       const imagePath = req.file.path;
//       if (!fs.existsSync(imagePath)) {
//         throw new Error('Image file does not exist.');
//       }
//       imagePart = {
//         inlineData: {
//           data: Buffer.from(fs.readFileSync(imagePath)).toString('base64'),
//           mimeType: req.file.mimetype,
//         },
//       };
//     }

//     const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

//     // Prepare inputs
//     const inputs = [];
//     if (prompt) inputs.push(prompt);
//     if (imagePart) inputs.push(imagePart);

//     // If neither prompt nor imagePart is available, return an error
//     if (inputs.length === 0) {
//       return res.status(400).json({ success: false, message: 'Prompt or image is required' });
//     }

//     // Check the type of the API call needed
//     const result = await model.generateContent(inputs);

//     // Handle response
//     const answer = result.response.candidates[0].content.parts[0].text;

//     // Save to database
//     const newQuestion = new Question({
//       projectId: projectId,
//       question: prompt || "Image-based query",
//       answer: answer
//     });
//     await newQuestion.save();

//     res.status(201).send({ success: true, result: answer, newQuestion });

//   } catch (error) {
//     console.error('API error:', error);
//     res.status(500).send({ success: false, message: error.message });
//   }
// };




// Ask a question
const askQuestion = async (req, res) => {
  const { projectId } = req.params;

  try {
    const prompt = req.body.prompt || null;
    let imagePart = null;

    // Check if at least one input is provided
    if (!prompt && !req.file) {
      return res.status(400).json({ success: false, message: 'Prompt or image is required' });
    }

    if (req.file) {
      const imagePath = req.file.path;
      if (!fs.existsSync(imagePath)) {
        throw new Error('Image file does not exist.');
      }
      imagePart = {
        inlineData: {
          data: Buffer.from(fs.readFileSync(imagePath)).toString('base64'),
          mimeType: req.file.mimetype,
        },
      };
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Prepare inputs
    const inputs = [];
    if (prompt) inputs.push(prompt);
    if (imagePart) inputs.push(imagePart);

    // If neither prompt nor imagePart is available, return an error
    if (inputs.length === 0) {
      return res.status(400).json({ success: false, message: 'Prompt or image is required' });
    }

    // Use the streaming API to handle step-by-step responses
    const result = await model.generateContentStream(inputs);

    // Send response chunks as they are received
    res.writeHead(200, {
      'Content-Type': 'text/plain',
      'Transfer-Encoding': 'chunked',
    });

    let answer = '';

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      answer += chunkText;
      res.write(chunkText); // Stream the response chunk to the client
    }

    // Save the complete conversation to the database once finished
    const newQuestion = new Question({
      projectId: projectId,
      question: prompt || "Image-based query",
      answer: answer,
    });
    await newQuestion.save();

    res.end(); // End the response

  } catch (error) {
    console.error('API error:', error);
    if (!res.headersSent) {
      res.status(500).send({ success: false, message: error.message });
    }
  }
};

const getQuestions = async (req, res) => {
  try {
    const { projectId } = req.params;
    const questions = await Question.find({ projectId });

    res.status(200).json({ success: true, data: questions });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

module.exports = {
    askQuestion,
    getQuestions
}