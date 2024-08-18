const mongoose = require('mongoose');

const connectDB = (uri) => {
    mongoose.connect(uri)
    .then(()=>console.log('db connected...'))
    .catch(err=> console.log( err))
}

module.exports = connectDB;