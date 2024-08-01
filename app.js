require('dotenv').config()
const PORT = 3000

const express = require('express')
const app = express()
const connectDB = require('./db/connect')

//router imports

const StudentRoute = require('./routes/StudentRoute')
const TeacherRoute = require('./routes/TeacherRoute')
const TutionRoute = require('./routes/TutionRoute')
const ReviewRoute = require('./routes/ReviewRoute')

//middleware
app.use(express.json())

//routes
app.use('/api/v1/student',StudentRoute)
app.use('/api/v1/teacher',TeacherRoute)
app.use('/api/v1/tution',TutionRoute)
app.use('/api/v1/review',ReviewRoute)


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