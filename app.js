require("dotenv").config();
const express = require("express");
const app = express();

const PORT = process.env.PORT 


const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require("morgan");
const connectDB = require("./DB/connectDB");

const authRoutes = require('./src/routes/authRoutes');
const forgetPasswordRoutes = require('./src/routes/forgetPasswordRoutes');
const projectRoutes = require('./src/routes/projectRoutes');
const questionRoutes = require('./src/routes/questionsRoutes');
const userRoutes = require('./src/routes/userRoutes.js');
const commentRoutes = require('./src/routes/commentRoutes.js');


app.use(morgan("dev"))
app.use(bodyParser.json());
app.use(cors( {origin: 'http://localhost:5173' }));


app.use('/auth',authRoutes);
app.use('/forgetpassword',forgetPasswordRoutes);
app.use('/project',projectRoutes);
app.use('/question',questionRoutes);
app.use('/user',userRoutes);
app.use('/comment',commentRoutes);

const start = async () => {
    await connectDB(process.env.MONGO_URI)
    app.listen(PORT,()=>{
        console.log(`running on port ${PORT}...`)
    })
}

start()

