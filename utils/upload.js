const multer = require('multer');


const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images");
    },
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + file.originalname);
    }
});


const upload = multer({ storage: diskStorage });

 module.exports = upload