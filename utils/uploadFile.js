const multer = require('multer');
const path = require('path');

// Configure Multer to save files to the 'uploads' directory
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Filter to only allow audio and image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('audio/') || file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image and audio files are allowed!'), false);
  }
};

const uploadFile = multer({ storage: storage, fileFilter: fileFilter });

module.exports = uploadFile;