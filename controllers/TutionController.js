// Import required modules and models
const Tution = require('../models/TutionModel'); // Mongoose model for Tution
const Teacher = require('../models/TeacherModel'); // Mongoose model for Teacher
const { StatusCodes } = require('http-status-codes'); // HTTP status codes for response
const CustomError = require('../errors')

// Helper function to check if a value is within a given range of standards
const isWithinRange = (range, value) => {
    // Define the order for standards
    const standardsOrder = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
    
    const [start, end] = range;
    
    const startIndex = standardsOrder.indexOf(start);
    const endIndex = standardsOrder.indexOf(end);
    const valueIndex = standardsOrder.indexOf(value);

    return valueIndex >= startIndex && valueIndex <= endIndex;
};

// Function to get tutions with specified conditions
const getTutionsWithCondition = async (req, res) => {
    const { standard, subjects, boards, name, district, state } = req.query;

    const TutionQueryObj = {};
    const TeacherQueryObj = {};

    // Construct the Tution query object
    if (subjects) TutionQueryObj.subjects = subjects;
    if (boards) TutionQueryObj.boards = boards;

    // Construct the Teacher query object
    if (district) TeacherQueryObj.district = district;
    if (state) TeacherQueryObj.state = state;

        // Query tutions with the given conditions and populate the 'createdBy' field with teacher details
        let Tutions = await Tution.find(TutionQueryObj).populate({
            path: 'createdBy',
            match: TeacherQueryObj, // Filter based on TeacherQueryObj
            select: '-password'
        });

        // console.log(Tutions);

        // Filter tutions based on the standard range if specified
        if (standard) {
            Tutions = Tutions.filter(tution => isWithinRange(tution.standard, standard));
        }

        // Remove tutions where createdBy is null (i.e., no matching teacher) and filter by teacher's name if specified
        Tutions = Tutions.filter(tution => 
            tution.createdBy !== null && 
            (!name || (tution.createdBy.name && tution.createdBy.name.toLowerCase().includes(name.toLowerCase())))
        );

        // Send a 200 OK response with the filtered tutions
        return res.status(StatusCodes.OK).json({ ResultSet: Tutions });
};

// Function to get all tutions created by a specific teacher
const getAllTutions = async (req, res) => {
    const id = req.user.userId;
    const tutions = await Tution.find({ createdBy: id });
    res.status(StatusCodes.OK).json({ tutions });
};

// Function to create a new tution
const createTution = async (req, res) => {
    const id = req.user.userId
    req.body.createdBy = id;
        const teacher = await Teacher.findById(id);
        if (!teacher) 
            throw new CustomError.NotFoundError(`Teacher doesn't exist`)

        const tution = await Tution.create(req.body);
        res.status(StatusCodes.CREATED).json({ tution });
};

const getTution = async(req,res) =>{
    const { id } = req.params
        const tution = await Tution.findById(id).populate(
            {
                path:'createdBy',
                select:'-password'
            }
        )
        if(!tution)
            throw new CustomError.NotFoundError(`No tution with id ${id} exists`)
          
        return res.status(StatusCodes.OK).json({tution})
}

// Function to delete a tution
const deleteTution = async (req, res) => {
    const tutionId = req.params.id
    const id = req.user.userId
    const teacher = await Teacher.findById(id);
    if (!teacher) 
        throw new CustomError.NotFoundError(`Teacher not found`)
       
    const tution = await Tution.findOneAndDelete({ createdBy:id, _id: tutionId });

    if (!tution) 
        throw new CustomError.NotFoundError(`No tution with id ${tutionId} for this teacher`)
       
    // Delete the tution and send response
        return res.status(StatusCodes.OK).json({ message: `Tution with id ${tutionId} deleted successfully` });
};

// Function to update a tution
const updateTution = async (req, res) => {
    const tutionId = req.params.id
    const id = req.user.userId
    const tution = await Tution.findByIdAndUpdate({ _id: tutionId, createdBy:id }, req.body, { new: true, runValidators: true });
    if (!tution) {
        throw new CustomError.NotFoundError(`No tution with id ${tutionId} for this user`)
    } else {
        res.status(StatusCodes.OK).json({ tution });
    }
};

// Export functions to be used in other parts of the application
module.exports = {
    getTution,
    getTutionsWithCondition,
    getAllTutions,
    createTution,
    deleteTution,
    updateTution
};
