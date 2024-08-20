const speech = require('@google-cloud/speech').v1p1beta1;
const client = new speech.SpeechClient();

const convertVoiceToText = async (audioBuffer, mimeType) => {
  const audioBytes = audioBuffer.toString('base64');
  const audio = {
    content: audioBytes,
  };
  
  const config = {
    encoding: 'MP3', // Adjust according to your audio format
    sampleRateHertz: 16000,
    languageCode: 'en-US',
  };

  const request = {
    audio: audio,
    config: config,
  };

  try {
    const [response] = await client.recognize(request);
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');
    return transcription;
  } catch (error) {
    throw new Error('Speech-to-Text conversion failed: ' + error.message);
  }
};

module.exports = convertVoiceToText;