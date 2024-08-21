const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.API_KEY,
});


const generateAnswer = async (input, inputType) => {
  try {
    let prompt;

    // Handle different input types
    if (inputType === 'text') {
      prompt = input;
    } else if (inputType === 'voice') {
      const transcript = await transcribeVoice(input);
      prompt = transcript;
    } else if (inputType === 'image') {
      const description = await describeImage(input);
      prompt = description;
    } else {
      throw new Error('Unsupported input type');
    }
    

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", 
      messages: prompt,
      max_tokens: 150
    });

    let response = completion.choices[0];
    console.log(completion);
    
    console.log(response)

    return response
  } catch (error) {
    console.log(error)
    throw new Error('Error generating AI answer: ' + error.message);
  }
};

// Helper function to transcribe voice to text
const transcribeVoice = async (voiceUrl) => {
  try {
    const response = await axios.post('YOUR_VOICE_TRANSCRIBE_API_ENDPOINT', {
      voiceUrl,
    });
    return response.data.transcription;
  } catch (error) {
    throw new Error('Error transcribing voice: ' + error.message);
  }
};

// Helper function to describe image to text
const describeImage = async (imageUrl) => {
  try {
    const response = await axios.post('YOUR_IMAGE_DESCRIPTION_API_ENDPOINT', {
      imageUrl,
    });
    return response.data.description;
  } catch (error) {
    throw new Error('Error describing image: ' + error.message);
  }
};

module.exports = {generateAnswer}