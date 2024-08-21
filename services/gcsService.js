const { Storage } = require('@google-cloud/storage');
const path = require('path');
const storage = new Storage();

const uploadToGCS = async (filePath, bucketName, destination) => {
  try {
    await storage.bucket(bucketName).upload(filePath, {
      destination: destination,
      public: true,
      metadata: {
        cacheControl: 'public, max-age=31536000',
      },
    });
    return `https://storage.googleapis.com/${bucketName}/${destination}`;
  } catch (error) {
    console.error('GCS upload error:', error);
    throw new Error('Failed to upload file to GCS');
  }
};

module.exports = { uploadToGCS };