// Import required modules and classes
const StudentController = require('./StudentController') // Controller for student operations
const TeacherController = require('./TeacherController') // Controller for teacher operations
const { StatusCodes } = require('http-status-codes') // HTTP status codes for response
const Student = require('../models/StudentModel') // Mongoose model for Student
const Teacher = require('../models/TeacherModel') // Mongoose model for Teacher
const Tuition = require('../models/TutionModel')
const VerifyMail = require('../models/VerifyMailModel')
const crypto = require('crypto')
const CustomError = require('../errors')
const { attachRefreshToken,detachRefreshToken,sendResetPasswordEmail,sendVerificationEmail,createOTP,createHash } = require('../utils')

const registerStudent = async (req, res) => {
        await StudentController.createStudent(req, res); 
};

const registerTeacher = async (req, res) => {
        await TeacherController.createTeacher(req, res); 
};

const generateEmailVerifyLink = async(req,res) =>{
    const { email,role } = req.body

    if(!email || !role)
        throw new CustomError.BadRequestError('Enter all fields')

    let existingUser;
    if(role === 'student')
        existingUser = await Student.findOne({email})
    else if(role === 'teacher')
        existingUser = await Teacher.findOne({email})
    else
       throw new CustomError.BadRequestError('Invalid Role Entered')

    if(existingUser)
        throw new CustomError.BadRequestError('Mail already exists')

    await VerifyMail.findOneAndDelete({email})
    const otp = createOTP(6)
    await VerifyMail.create({email,otp})
    await sendVerificationEmail({email,otp})
    return res.status(StatusCodes.CREATED).json({message:'Verification email generated'})
}

const verifyEmail = async(req,res) =>{
    const {otp,email} = req.body
    if(!otp || !email)
        throw new CustomError.BadRequestError('Enter necessary fields')

    const Email = await VerifyMail.findOne({email})
    if(!Email)
        throw new CustomError.BadRequestError('The OTP has expired. Please request a new one for verification.')

    const isMatch = await Email.compareOTP(otp)
    if(!isMatch)
        throw new CustomError.BadRequestError('Invalid OTP Entered')
    
    await VerifyMail.findOneAndDelete({email})

    return res.status(StatusCodes.OK).json({message:'Email Verified successfully'})
}

const loginStudent = async (req, res) => {
    const { email, password } = req.body 

        if (!password || !email) 
            throw new CustomError.BadRequestError('Email and password are required')

        let student = await Student.findOne({ email: email });

        if (!student)
            throw new CustomError.BadRequestError('Account not yet registered')

        const isPasswordCorrect = await student.comparePassword(password);

        if (!isPasswordCorrect) 
            throw new CustomError.BadRequestError('Incorrect password')

        await attachRefreshToken(res,{role:'student',id:student._id})
        student = await Student.findById(student._id).select('-password -__v')
        return res.status(StatusCodes.OK).json({ student });
};

const loginTeacher = async (req, res) => {
    const { email, password } = req.body
        if (!password || !email) 
            throw new CustomError.BadRequestError('Email and password are required')
           
        let teacher = await Teacher.findOne({ email: email });
        if (!teacher) 
            throw new CustomError.BadRequestError('Account not yet registered')
          
        const isPasswordCorrect = await teacher.comparePassword(password);
        if (!isPasswordCorrect) 
            throw new CustomError.BadRequestError('Incorrect password')
            
        await attachRefreshToken(res,{role:'teacher',id:teacher._id})
        teacher = await Teacher.findById(teacher._id).select('-password -__v')
        return res.status(StatusCodes.OK).json({ teacher });   
};


const forgotOrChangePassword = async(req,res) =>{
    const { email,role } = req.body

        let existingUser;
        if(role === 'student')
            existingUser = await Student.findOne({email})
        else if(role === 'teacher')
            existingUser = await Teacher.findOne({email})
        else
            throw new CustomError.BadRequestError('Invalid Role Entered')
        
        if(!existingUser)
            throw new CustomError.BadRequestError('Email not yet Registered')
        
        const passwordToken = crypto.randomBytes(70).toString('hex')
        const origin = process.env.ORIGIN || 'http://localhost:3000';
        await sendResetPasswordEmail({
            name:existingUser.name,
            email:existingUser.email,
            token:passwordToken,
            role,
            origin,
        })
        const tenMinutes = 1000 * 10 * 60 // 10 minutes
        const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes)
        existingUser.passwordToken = createHash(passwordToken)
        existingUser.passwordTokenExpirationDate = passwordTokenExpirationDate
    
        await existingUser.save()
    
        res.status(StatusCodes.OK).json({msg:'Mail generated successfully'})
        
}

const resetPassword = async(req,res) => {
    const { email,token,password,role } = req.body
        if(!email || !token || !password)
            throw new CustomError.BadRequestError('Please provide all values')
          
        let existingUser;
        if(role === 'student')
            existingUser = await Student.findOne({email})
        else if(role === 'teacher')
            existingUser = await Teacher.findOne({email})
    
        if(!existingUser)
            throw new CustomError.BadRequestError('Account does not exist')
           
        
        const currentDate = Date.now()
        if(existingUser.passwordToken == createHash(token) && existingUser.passwordTokenExpirationDate > currentDate){
             existingUser.password = password
             existingUser.passwordToken = null
             existingUser.passwordTokenExpirationDate = null
             await existingUser.save()
        }
        else
            throw new CustomError.BadRequestError("Token expired")
            
        return res.status(StatusCodes.CREATED).json({message:'Password resetted successfully'})
}


const logOut = async(req,res) =>{
    const id = req.user.userId
    await detachRefreshToken(res,{id})
    
    res.status(StatusCodes.OK).json({message:'User logged out successfully'})
}

const deleteAccount = async(req,res) =>{
    const { role } = req.user
        if(role === 'student')
            await StudentController.deleteStudent(req,res)
        else if(role === 'teacher')
            await TeacherController.deleteTeacher(req,res)
        else
           throw new CustomError.BadRequestError("Enter valid role")
}

const statsDetails = async(req,res) =>{
    const [studentCount, teacherCount, tuitionCount] = await Promise.all([
        Student.countDocuments({}),
        Teacher.countDocuments({}),
        Tuition.countDocuments({})
    ])
    
    return res.status(StatusCodes.OK).json({stdnt:studentCount,tchr:teacherCount,tut:tuitionCount})
}

module.exports = {
    registerStudent,
    registerTeacher,
    loginStudent,
    loginTeacher,
    logOut,
    generateEmailVerifyLink,
    verifyEmail,
    forgotOrChangePassword,
    resetPassword,
    deleteAccount,
    statsDetails
};
