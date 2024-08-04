const Student = require('../models/StudentModel')
const Review = require('../models/ReviewModel')
const {StatusCodes} = require('http-status-codes')

const getStudent = async(req,res)=>{
    const { id } = req.params
    const student = await Student.findById({_id:id})
    if(!student){
        res.status(StatusCodes.NOT_FOUND).json({message:`Student with id ${id} not found!`})
    }
    else{
        res.status(StatusCodes.OK).json({student})
    }
}



const createStudent = async(req,res)=>{
    console.log(req.method);
    const student =await  Student.create(req.body)
    res.status(StatusCodes.CREATED).json({student})
}

const updateStudent = async(req,res)=>{
   const { id } = req.params
   const user = await Student.findByIdAndUpdate({_id:id},req.body,{new:true,runValidators:true})
                                              //id, update, options

   if(!user)
    return res.status(StatusCodes.NOT_FOUND).json({ message: 'No user found' });
   
   res.status(StatusCodes.OK).json({user})
}

const deleteStudent = async(req,res)=>{
    const {id} = req.params
    const student = await Student.findOne({_id:id})
    if(!student)
        res.status(StatusCodes.NOT_FOUND).json({message:`Student with id ${id} not found`})
    try {
        await student.deleteOne()
    } catch (error) {
        console.log("Here is the error");
        console.log(error)     
        
    }
        res.status(StatusCodes.OK).json({student})
}

const likeDislikeReviews = async (req, res) => {
    const { id } = req.params;
    const { reviewid, option } = req.body;
    console.log(id, reviewid, option);

    try {
        const student = await Student.findById(id); // Find student by ID
        if (!student) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: `Student with id ${id} not found!!` });
        }

        const review = await Review.findById(reviewid); // Find review by ID
        if (!review) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: `Review with id ${reviewid} not found!!` });
        }

        const likedExists = student.likedReviews.includes(reviewid);
        const dislikedExists = student.dislikedReviews.includes(reviewid);


        if (option === 'like') {
            if (dislikedExists) {
                student.dislikedReviews = student.dislikedReviews.filter(review => !review.equals(reviewid));
            }
            if (!likedExists) {
                student.likedReviews.push(reviewid);
            }
        } else if (option === 'dislike') {
            if (likedExists) {
                student.likedReviews = student.likedReviews.filter(review => !review.equals(reviewid));
            }
            if (!dislikedExists) {
                student.dislikedReviews.push(reviewid);
            }
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: `Invalid option ${option}. Must be 'like' or 'dislike'.` });
        }

        await student.save();
        res.status(StatusCodes.OK).json({ message: `Review ${reviewid} ${option}d successfully` });

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
}


module.exports = {
    likeDislikeReviews,
    getStudent,
    createStudent,
    updateStudent,
    deleteStudent
}
