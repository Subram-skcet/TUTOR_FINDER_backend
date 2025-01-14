const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const TeacherSchema = mongoose.Schema({
    profilepic: {
        type: String,
        default: 'https://res.cloudinary.com/diokpb3jz/image/upload/v1722887830/samples/s8yfrhetwq1s4ytzwo39.png'
    },
    name: {
        type: String,
        required: [true, 'Please provide a name']
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
        ],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minLength: 6
    },
    qualification: {
        type: String,
        required: [true, "Please provide a qualification"]
    },
    mobileno: {
        type: String,
        required: [true, "Please provide a contact number"],
        validate: {
            validator: function(v) {
                return v.length === 10; 
            },
            message: 'Please provide a valid number'
        }
    },
    state: {
        type: String,
        required: [true, "Please provide a state"]
    },
    district: {
        type: String,
        required: [true, "Please provide a district"]
    },
    year_of_exp: {
        type: Number,
        required: [true, "Please provide experience"]
    },
    subjects: {
        type: [String],
        required: [true, "Please provide a subject"],
        validate: {
            validator: function(v) {
                return v.length > 0; 
            },
            message: 'Please provide at least one subject'
        }
    },
    about: {
        type: String,
        minLength: 5 
    },
    averageRating: {
        type: Number,
        default: 0
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    numOfTutions: {
        type: Number,
        default: 0
    },
    passwordToken:{
        type:String,
    },
    passwordTokenExpirationDate:{
        type:Date,
    }
});

// Virtual field to populate reviews associated with the teacher
TeacherSchema.virtual('reviews', {
    ref: 'Review', // Model to use for population
    localField: '_id', // Field in the Teacher model
    foreignField: 'createdFor', // Field in the Review model
    justOne: false // This will return an array of reviews
});

// Pre-delete middleware to remove associated reviews and tutions
TeacherSchema.pre('deleteOne', async function (next) {

    const conditions = this.getQuery(); // Get conditions used in the delete operation
    const doc = await mongoose.model('Teacher').findOne(conditions); // Find the document to be deleted

    
    // Find and delete associated tutions one by one to trigger post hooks
    const Tution = mongoose.model('Tution');
    const tutions = await Tution.find({ createdBy: doc._id });
    for (const tution of tutions) {
        
        await Tution.findOneAndDelete({ _id: tution._id });
    }

    // Delete associated reviews
    await mongoose.model('Review').deleteMany({ createdFor: doc._id });

    next(); // Proceed with the delete operation
});

// Pre-save middleware to hash the password before saving
TeacherSchema.pre('save', async function(next) {
    if (this.isModified('password')) { // Only hash the password if it has been modified
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next(); // Proceed with the save operation
});

// Method to compare a candidate password with the stored hashed password
TeacherSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Export the Teacher model
module.exports = mongoose.model('Teacher', TeacherSchema);
