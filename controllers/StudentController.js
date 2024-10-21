// Import required modules and classes
const Student = require('../models/StudentModel') // Mongoose model for Student
const Review = require('../models/ReviewModel') // Mongoose model for Review
const Tution = require('../models/TutionModel') // Mongoose model for Tution
const { StatusCodes } = require('http-status-codes') // HTTP status codes for response
const fs = require('fs') // File system module for file operations
const cloudinary = require('cloudinary').v2 // Cloudinary for image uploading
const { detachRefreshToken,attachRefreshToken } = require('../utils')

// Function to get a student by their ID
const getStudent = async (req, res) => {

    const id = req.user.userId; // Extract student ID from request parameters
    const student = await Student.findById({ _id: id }).select('-password -__v'); // Find student by ID

    if (!student) {
        // If student is not found, send a 404 Not Found response
        res.status(StatusCodes.NOT_FOUND).json({ message: `Student with id ${id} not found!` });
    } else {
        // If student is found, send a 200 OK response with the student data
        res.status(StatusCodes.OK).json({ student });
    }
};

// Function to create a new student
const createStudent = async (req, res) => {
    try {
        const student = await Student.create(req.body); 
        
        const studentData = await Student.findById(student._id).select('-password -__v');
        await attachRefreshToken(res,{role:'student',id:student._id})
        res.status(StatusCodes.CREATED).json({ student: studentData });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error creating student', error });
    }
};

// Function to update a student's information
const updateStudent = async (req, res) => {
    const id  = req.user.userId; // Extract student ID from request parameters


    // Find and update the student by ID with new data from the request body
    let user = await Student.findByIdAndUpdate(id, req.body, { new: true, runValidators: true }).select('name profilepic -_id');

    if (!user) {
        // If student is not found, send a 404 Not Found response
        return res.status(StatusCodes.NOT_FOUND).json({ message: 'No user found' });
    }
    // Send a 200 OK response with the updated student data
    res.status(StatusCodes.OK).json({ user });
};

// Function to delete a student by their ID
const deleteStudent = async (req, res) => {
    const  id = req.user.userId; // Extract student ID from request parameters
    await detachRefreshToken(res,{id})
    // Find the student by ID
    const student = await Student.findOne({ _id: id });

    if (!student) {
        // If student is not found, send a 404 Not Found response
        res.status(StatusCodes.NOT_FOUND).json({ message: `Student with id ${id} not found` });
    }

    try {
        // Delete the student record
        await student.deleteOne();
    } catch (error) {
        // Log and ignore any errors during deletion
        console.log(error);
    }

    // Send a 200 OK response with the deleted student data
    res.status(StatusCodes.OK).json({msg:'User Deleted successfully'});
};

const likereviews = async(req,res) =>{
    console.log("Here  = ", req.user);
    const id  = req.user.userId;
    const { reviewid, option } = req.body; // Extract review ID and action (like or dislike) from request body

    let student = await Student.findById(id); // Find student by ID
        if (!student) {
            // If student is not found, send a 404 Not Found response
            return res.status(StatusCodes.NOT_FOUND).json({ message: `Student with id ${id} not found!!` });
        }

    const review = await Review.findById(reviewid); // Find review by ID
    if (!review) {
        // If review is not found, send a 404 Not Found response
        return res.status(StatusCodes.NOT_FOUND).json({ message: `Review with id ${reviewid} not found!!` });
    }

    // Check if the review is already liked or disliked
    const likedExists = student.likedReviews.includes(reviewid);
    const dislikedExists = student.dislikedReviews.includes(reviewid);

    if (option === 'like') {
        // Handle 'like' action
        if (dislikedExists) {
            // Remove from dislikedReviews if present
            await Student.findByIdAndUpdate(
                id,
               { $pull : { dislikedReviews : reviewid}}
            );
            await Review.findByIdAndUpdate(
                reviewid,
                { $pull: { dislike: id } }
            );
        }
        else if(likedExists){
            await Student.findByIdAndUpdate(
                id,
               { $pull : { likedReviews : reviewid}}
             );
            await Review.findByIdAndUpdate(
                reviewid,
                { $pull: { like: id } }
            );
        }
        if(!likedExists) {
            // Add to likedReviews if not already liked
            await Student.findByIdAndUpdate(
                id,
               { $addToSet : { likedReviews : reviewid}}
           );
            await Review.findByIdAndUpdate(
                reviewid,
                { $addToSet : { like : id}}
            );
        }
        student = await Student.findById(id);
        return res.status(StatusCodes.OK).json({likedReviews:student.likedReviews,dislikedReviews:student.dislikedReviews})
    } else if (option === 'dislike') {
        // Handle 'dislike' action
        if (likedExists) {
            // Remove from likedReviews if present
            await Student.findByIdAndUpdate(
                id,
               { $pull : { likedReviews : reviewid}}
             );
            await Review.findByIdAndUpdate(
                reviewid,
                { $pull: { like: id } }
            ); 
        }
        else if(dislikedExists){
            await Student.findByIdAndUpdate(
                id,
               { $pull : { dislikedReviews : reviewid}}
             );
            await Review.findByIdAndUpdate(
                reviewid,
                { $pull: { dislike: id } }
            );
        }
        if(!dislikedExists){
            // Add to dislikedReviews if not already disliked
            await Student.findByIdAndUpdate(
                 id,
                { $addToSet : { dislikedReviews : reviewid}}
            );
            await Review.findByIdAndUpdate(
                reviewid,
                { $addToSet : { dislike : id}}
            );
        }
        student = await Student.findById(id);
        return res.status(StatusCodes.OK).json({likedReviews:student.likedReviews,dislikedReviews:student.dislikedReviews})
    } else {
        // If option is neither 'like' nor 'dislike', send a 400 Bad Request response
        return res.status(StatusCodes.BAD_REQUEST).json({ message: `Invalid option ${option}. Must be 'like' or 'dislike'.` });
    }
}


// Function to like or dislike reviews and favorite or unfavorite tutions
const favouriteTutions = async (req, res) => {
    const id  = req.user.userId; // Extract student ID from request parameters

    try {
        const student = await Student.findById(id); // Find student by ID
        if (!student) {
            // If student is not found, send a 404 Not Found response
            return res.status(StatusCodes.NOT_FOUND).json({ message: `Student with id ${id} not found!!` });
        }

            const { tutionId, favourite } = req.body; // Extract tution ID and favorite status from request body

            const tution = await Tution.findById(tutionId); // Find tution by ID
            if (!tution) {
                // If tution is not found, send a 404 Not Found response
                return res.status(StatusCodes.NOT_FOUND).json({ message: `Tution with id ${tutionId} not found!!` });
            }

            // Check if the tution is already favorited
            const favouriteExists = student.favouriteTutions.includes(tutionId);
            if (favourite) {
                // Add to favouriteTutions if favoriting
                if (!favouriteExists) {
                    student.favouriteTutions.push(tutionId);
                }
            } else {
                // Remove from favouriteTutions if unfavoriting
                if (favouriteExists) {
                    student.favouriteTutions = student.favouriteTutions.filter(tution => tution.toString() !== tutionId);
                }
            }

            // Save the updated student data
            await student.save();
            // Send a 201 Created response indicating the tution was favorited or unfavorited successfully
            return res.status(StatusCodes.CREATED).json({
                message: `Tution with id ${tutionId} ${favourite ? '' : 'un'}favourited successfully`
            });
    } catch (error) {
        // If an error occurs, send a 500 Internal Server Error response
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};

// Function to upload an image to Cloudinary
const uploadImg = async (req, res) => {
    const  by  = req.user.role 
    console.log(by);

    try {
        // Ensure the image file and its temporary file path exist
        if (!req.files || !req.files.image || !req.files.image.tempFilePath) {
            throw new Error('No file uploaded or file path is missing');
        }

        // Upload the image to Cloudinary
        const result = await cloudinary.uploader.upload(
            req.files.image.tempFilePath,
            {
                use_filename: true,
                folder: by === 'student' ? 'student-images' : 'teacher-images',
            }
        );

        // Delete the temporary file after successful upload
        fs.unlinkSync(req.files.image.tempFilePath);

        console.log(result);

        // Return the secure URL of the uploaded image
        return res.status(StatusCodes.OK).json({ image: result.secure_url });
    } catch (error) {
        console.log(`${error} from Cloudinary`);
        // Throw an error if image upload fails
        throw new Error('Failed to upload image');
    }
};

const deleteImg = async (req, res) => {
    console.log(req.query);
    try {
        // Ensure the URL is provided
        if (!req.query.url) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Image URL is required' });
        }

        const imageUrl = req.query.url;

        // Extract public ID from the URL
        const parts = imageUrl.split('/');
        console.log(parts);
        const publicId = parts.slice(7, parts.length).join('/').replace(/\.[^/.]+$/, '');

        console.log(publicId);

        // Delete the image from Cloudinary
        const result = await cloudinary.uploader.destroy(publicId);

        console.log(result);

        // Check if the deletion was successful
        if (result.result === 'ok') {
            return res.status(StatusCodes.OK).json({ message: 'Image deleted successfully' });
        } else {
            return res.status(StatusCodes.NOT_FOUND).json({ error: 'Image not found' });
        }
    } catch (error) {
        console.error(`Error deleting image: ${error}`);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to delete image' });
    }
};


// Export the functions to be used in other parts of the application
module.exports = {
    uploadImg,
    deleteImg,
    favouriteTutions,
    likereviews,
    getStudent,
    createStudent,
    updateStudent,
    deleteStudent
};
