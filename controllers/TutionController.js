const Tution = require('../models/TutionModel')
const Teacher = require('../models/TeacherModel')
const {StatusCodes}=require('http-status-codes')

const isWithinRange = (range, value) => {
    // Define the order for standards
    const standardsOrder = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI" , "XII"];
    
    const [start, end] = range;
    
    const startIndex = standardsOrder.indexOf(start);
    const endIndex = standardsOrder.indexOf(end);
    const valueIndex = standardsOrder.indexOf(value);

    return valueIndex >= startIndex && valueIndex <= endIndex;
};

const getTutionsWithCondition = async (req, res) => {
    const { standard, subjects, boards, name, district, state } = req.query;

    const TutionQueryObj = {};
    const TeacherQueryObj = {};

    // Construct the Tution query object
    if (subjects) TutionQueryObj.subjects = subjects;
    if (boards) TutionQueryObj.boards = boards;

    // Construct the Teacher query object
    // if (name) TeacherQueryObj.name = name;
    if (district) TeacherQueryObj.district = district;
    if (state) TeacherQueryObj.state = state;

    try {
        // Step 1: Query tutions with the given conditions
        let Tutions = await Tution.find(TutionQueryObj).populate({
            path: 'createdBy',
            match: TeacherQueryObj, // Filter based on TeacherQueryObj
            select: 'name state district'
        });
        console.log(Tutions, ",", TutionQueryObj)

        // Step 2: Filter tutions based on the standard range
        if (standard) {
            Tutions = Tutions.filter(tution => 
                isWithinRange(tution.standard, standard)
            );
        }

        // Remove tutions where createdBy is null (i.e., no matching teacher)
        Tutions = Tutions.filter(tution => 
            tution.createdBy !== null && 
            (!name || (tution.createdBy.name && tution.createdBy.name.includes(name)))
        );

        return res.status(StatusCodes.OK).json({ ResultSet: Tutions });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};


const getAllTutions = async(req,res) =>{
    const userId = req.body.createdBy
    const tutions = await Tution.find({createdBy:userId})
    res.status(StatusCodes.OK).json({tutions})
}


const createTution = async(req,res)=>{
   const tution = await Tution.create(req.body)
   res.status(StatusCodes.CREATED).json({tution})
}

const deleteTution = async(req,res)=>{
   const {
     body:{createdBy},
     params:{id}
   } = req
    const tution= await Tution.findOneAndDelete(
        {createdBy,_id:id}
    )
    if(!tution)
        res.status(StatusCodes.NOT_FOUND).json({message:`No tution with id ${id} for this user`})
    else
       res.status(StatusCodes.OK).json({tution})
}

const updateTution = async(req,res)=>{
   const { 
        body:{
            createdBy
        },
        params:{
            id
        } 
    } = req
   const tution = await Tution.findByIdAndUpdate({_id:id,createdBy},req.body,{new:true,runValidators:true})
   if(!tution)
      res.status(StatusCodes.NOT_FOUND).json({message:`No tution with id ${id} for this user`})
   else
      res.status(StatusCodes.OK).json({tution})
}

module.exports = {
    getTutionsWithCondition,
    getAllTutions,
    createTution,
    deleteTution,
    updateTution
}