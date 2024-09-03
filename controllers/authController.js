// Import required modules and classes
const StudentController = require('./StudentController') // Controller for student operations
const TeacherController = require('./TeacherController') // Controller for teacher operations
const { StatusCodes } = require('http-status-codes') // HTTP status codes for response
const Student = require('../models/StudentModel') // Mongoose model for Student
const Teacher = require('../models/TeacherModel') // Mongoose model for Teacher
const Token = require('../models/TokenModel')
const crypto = require('crypto')
const { attachRefreshToken,detachRefreshToken } = require('../utils')

const registerStudent = async (req, res) => {
    try {
        await StudentController.createStudent(req, res); 
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};

// Function to handle teacher registration
const registerTeacher = async (req, res) => {
    try {
        await TeacherController.createTeacher(req, res); 
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};

const loginStudent = async (req, res) => {
    const { email, password } = req.body 
    console.log(email , password);

    try {
        if (!password || !email) {
            console.log('Not exists')
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Email and password are required' });
        }
        let student = await Student.findOne({ email: email });
        if (!student) {
            console.log('Student chk')
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Account not yet registered' });
        }
        const isPasswordCorrect = await student.comparePassword(password);
        if (!isPasswordCorrect) {
            console.log('Password chk')
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Incorrect password' });
        }

        await attachRefreshToken(res,{role:'student',id:student._id})

        student = await Student.findById(student._id).select('-password -__v')
        return res.status(StatusCodes.OK).json({ student });
        
    } catch (error) {
        return res.status(StatusCodes.UNAUTHORIZED).json({message:'User is unauthorized'})
    }
};

// Function to handle teacher login
const loginTeacher = async (req, res) => {
    const { email, password } = req.body

    console.log(email , password);

    if (!password || !email) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Email and password are required' });
    }

    let teacher = await Teacher.findOne({ email: email });

    if (!teacher) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Account not yet registered' });
    }

    const isPasswordCorrect = await teacher.comparePassword(password);

    if (!isPasswordCorrect) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Incorrect password' });
    }

    await attachRefreshToken(res,{role:'teacher',id:teacher._id})

    teacher = await Teacher.findById(teacher._id).select('-password -__v')
    return res.status(StatusCodes.OK).json({ teacher });
};

const logOut = async(req,res) =>{
    const id = req.user.userId
    await detachRefreshToken(res,{id})

    res.status(StatusCodes.OK).json({message:'User logged out successfully'})

}

module.exports = {
    registerStudent,
    registerTeacher,
    loginStudent,
    loginTeacher,
    logOut
};
