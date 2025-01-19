require('dotenv').config()
require('express-async-errors')
const PORT = process.env.PORT || 3001

const express = require('express')
const app = express()
const connectDB = require('./db/connect')
const cloudinary = require('cloudinary').v2
const fileUpload = require('express-fileupload')
const cors = require('cors');
const cookieParser = require('cookie-parser')
const path = require('path');
const { authenticateUser } = require('./middleware/authentication')
const { getStudent } = require('./controllers/StudentController')
const { getTeacher } = require('./controllers/TeacherController')
const errorHandlerMiddleware = require('./middleware/error-handler')
const rateLimiter = require('express-rate-limit')
const helmet = require('helmet')

//router imports

const StudentRoute = require('./routes/StudentRoute')
const TeacherRoute = require('./routes/TeacherRoute')
const TutionRoute = require('./routes/TutionRoute')
const ReviewRoute = require('./routes/ReviewRoute')
const AuthRoute = require('./routes/AuthRoute')

//middleware
app.set('trust proxy',1)
app.use(rateLimiter({
    windowMs:15*60*1000,
    max:100,
}))
app.use(express.json())
app.use(cors({
    origin: 'https://findmytuition.netlify.app', // Allow only your frontend URL
    credentials: true, // Enable credentials (cookies)
  }));
app.use(helmet());
app.use(fileUpload({
    useTempFiles:true     //Use temp files instead of memory for managing the upload process.
}))
app.use(cookieParser(process.env.JWT_SECRET))

//V2
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET
})

//routes
app.use('/api/v1/auth',AuthRoute)
app.use('/api/v1/student',StudentRoute)
app.use('/api/v1/teacher',TeacherRoute)
app.use('/api/v1/tution',TutionRoute)
app.use('/api/v1/review',ReviewRoute)
app.get('/get-user',authenticateUser,(req,res)=>{
    if(req.user.role === 'student')
        return getStudent(req,res)
    else if(req.user.role === 'teacher')
        return getTeacher(req,res)
})

app.use(errorHandlerMiddleware)


const start= async()=>{
    try{
        await connectDB(process.env.MONGO_URI)
        app.listen(PORT,console.log(`Server is listening on port ${PORT}`))
    }
    catch(error){
        console.log(error);
    }
}

start()