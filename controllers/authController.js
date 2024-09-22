// Import required modules and classes
const StudentController = require('./StudentController') // Controller for student operations
const TeacherController = require('./TeacherController') // Controller for teacher operations
const { StatusCodes } = require('http-status-codes') // HTTP status codes for response
const Student = require('../models/StudentModel') // Mongoose model for Student
const Teacher = require('../models/TeacherModel') // Mongoose model for Teacher
const Token = require('../models/TokenModel')
const VerifyMail = require('../models/VerifyMailModel')
const crypto = require('crypto')
const { attachRefreshToken,detachRefreshToken,sendResetPasswordEmail,sendVerificationEmail,createOTP,createHash } = require('../utils')

const registerStudent = async (req, res) => {
    try {
        await StudentController.createStudent(req, res); 
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};

const registerTeacher = async (req, res) => {
    try {
        await TeacherController.createTeacher(req, res); 
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};

const generateEmailVerifyLink = async(req,res) =>{
    const { email,role } = req.body

    let existingUser;
    if(role === 'student'){
        existingUser = await Student.findOne({email})
    }
    else if(role === 'teacher'){
        existingUser = await Teacher.findOne({email})
    }

    if(existingUser){
        console.log(existingUser);
        return res.status(StatusCodes.BAD_REQUEST).json({message:'Mail already exists'})
    }

    const existsEmail = await VerifyMail.findOne({email})
    if(!existsEmail){
        const otp = createOTP(6)
        await VerifyMail.create({email,otp})
        await sendVerificationEmail({email,otp})
    }
    return res.status(StatusCodes.CREATED).json({message:'Verification email generated'})
}

const verifyEmail = async(req,res) =>{
    const {otp,email} = req.body
    const Email = await VerifyMail.findOne({email})
    if(!Email){
        console.log("for thiss");
        return res.status(StatusCodes.BAD_REQUEST).json({message:`OTP Expired`})
    }

    const isMatch = await Email.compareOTP(otp)
    if(!isMatch){
        console.log("for this one");
        return res.status(StatusCodes.BAD_REQUEST).json({message:'Invalid OTP'})
    }
    await VerifyMail.findOneAndDelete({email})

    return res.status(StatusCodes.OK).json({message:'Verified successfully'})
}

const loginStudent = async (req, res) => {
    const { email, password } = req.body 
    console.log(email , password);
    try {
        if (!password || !email) {
            console.log('Not exists')
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Email and password are required' });
        }
        let student = await Student.findOne({ email: email });
        if (!student) {
            console.log('Student chk')
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Account not yet registered' });
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
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:error.message})
    }
};

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


const forgotorChangePassword = async(req,res) =>{
    const { email,role } = req.body
    let existingUser;
    if(role === 'student')
        existingUser = await Student.findOne({email})
    else if(role === 'teacher')
        existingUser = await Teacher.findOne({email})
    
    if(!existingUser)
       return res.status(StatusCodes.BAD_REQUEST).json({message:'Email not exists'})  
    
    const passwordToken = crypto.randomBytes(70).toString('hex')
    const origin = 'http://localhost:3000'
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
    console.log(req.body);
    if(!email || !token || !password){
        return res.status(StatusCodes.BAD_GATEWAY).json({message:'Please provide all values'})
    }

    let existingUser;
    if(role === 'student'){
        existingUser = await Student.findOne({email})
    }
    else if(role === 'teacher'){
        existingUser = await Teacher.findOne({email})
    }

    if(!existingUser){
        console.log('alawww');
        return res.status(StatusCodes.BAD_REQUEST).json({message:'Email not exists'})  
    }
    
    const currentDate = Date.now()
    if(existingUser.passwordToken == createHash(token) && existingUser.passwordTokenExpirationDate > currentDate){
         existingUser.password = password
         existingUser.passwordToken = null
         existingUser.passwordTokenExpirationDate = null
         await existingUser.save()
    }
    else{
        console.log('here');
        return res.status(StatusCodes.BAD_REQUEST).json({message:"Token Expired"})
    }

    return res.status(StatusCodes.CREATED).json({message:'Password resetted successfully'})
}


const logOut = async(req,res) =>{
    const id = req.user.userId
    await detachRefreshToken(res,{id})
    
    res.status(StatusCodes.OK).json({message:'User logged out successfully'})
}

const deleteAccount = async(req,res) =>{
    const { role } = req.user
    try {
        if(role === 'student')
            await StudentController.deleteStudent(req,res)
        else if(role === 'teacher')
            await TeacherController.deleteTeacher(req,res)
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:error.message})
    }
}

module.exports = {
    registerStudent,
    registerTeacher,
    loginStudent,
    loginTeacher,
    logOut,
    generateEmailVerifyLink,
    verifyEmail,
    forgotorChangePassword,
    resetPassword,
    deleteAccount
};
