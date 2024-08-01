const mongoose =require('mongoose');

const TutionSchema = new mongoose.Schema({
    subjects:{
        type:[String],
        required:[true,'Atleast provide one Subject'],
        validate:{
            validator:function(v){
                return v.length > 0;
            },
            message:'Subject array must have atleast one subject'
        }
    },
    duration:{
        type:[String],
        required:[true,'Please provide timings'],
        validate:{
            validator:function(v){
                return v.length == 2;
            },
            message:'Timings must contains start and end values'
        }
    },
    days:{
        type:[String],
        required:[true,'Please provide tution days'],
        validate:{
            validator:function(v){
                return v.length == 2;
            },
            message:'Days must contains start and end days'
        }
    },
    standard:{
        type:[String],
        required:[true,'Please provide standard details'],
        validate:{
            validator:function(v){
                return v.length == 2;
            },
            message:'Standards must contain starting and ending standard'
        }
    },
    fees:{
        type:Number,
        required:[true,'Please provide fees details']
    },
    boards:{
        type:[String],
        required:[true,'Please provide board details'],
        validate:{
            validator:function(v){
                return v.length > 0;
            },
            message:'Boards array must have atleast one subject'
        }
    },
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:'Teacher',
        required:[true,'Please provide a teacher']
    }

})

module.exports = mongoose.model('Tution',TutionSchema)