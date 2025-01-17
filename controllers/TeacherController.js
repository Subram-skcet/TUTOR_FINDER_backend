// Import required modules and classes
const Teacher = require('../models/TeacherModel'); // Mongoose model for Teacher
const { StatusCodes } = require('http-status-codes'); // HTTP status codes for response
const { attachRefreshToken } = require('../utils')
const CustomError = require('../errors')

// Function to get a teacher by their ID
const getTeacher = async (req, res) => {
    const id = req.user.userId; 
    const teacher = await Teacher.findById({ _id: id }); // Find teacher by ID

    if (!teacher) {
        throw new CustomError.NotFoundError(`Teacher with id ${id} not found`)
    } else {
        // If teacher is found, send a 200 OK response with the teacher data
        res.status(StatusCodes.OK).json({ teacher });
    }
};

// Function to update a teacher's information
const updateTeacher = async (req, res) => {
    const id = req.user.userId

    // Find and update the teacher by ID with new data from the request body
    let teacher = await Teacher.findByIdAndUpdate({ _id: id }, req.body, { new: true, runValidators: true });

    if (!teacher) {
        throw new CustomError.NotFoundError(`Teacher with id ${id} not found`)
    } else {
        // Remove sensitive information before sending the response
        delete teacher.password;
        delete teacher.numOfReviews;
        delete teacher.numOfTutions;
        delete teacher.averageRating;

        // Send a 200 OK response with the updated teacher data
        res.status(StatusCodes.OK).json({ teacher });
    }
};

// Function to delete a teacher by their ID
const deleteTeacher = async (req, res) => {
    const id = req.user.userId; 

    // Find the teacher by ID
    const teacher = await Teacher.findOne({ _id: id });
    if (!teacher) {
        throw new CustomError.NotFoundError(`Teacher with id ${id} not found`)
    }

        await teacher.deleteOne();

    // Send a 200 OK response indicating the teacher was deleted successfully
    res.status(StatusCodes.OK).json({ message: `Teacher with id ${id} deleted successfully` });
};

// Function to create a new teacher
const createTeacher = async (req, res) => {
        // Add a custom 'about' field to the request body
        req.body.about = "Hi I am " + req.body.name;

        // Create a new teacher with the provided data
        let teacher = await Teacher.create(req.body);

        const teacherData = await Teacher.findById(teacher._id).select('-password -__v');

        await attachRefreshToken(res,{role:'teacher',id:teacher._id})
        // Send a 201 Created response with the newly created teacher data
        res.status(StatusCodes.CREATED).json({ teacherData });
};

// Export functions to be used in other parts of the application
module.exports = {
    getTeacher,
    updateTeacher,
    deleteTeacher,
    createTeacher
};
