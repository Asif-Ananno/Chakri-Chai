import mongoose from "mongoose";
import validator from "validator";

const applicationSchema = new mongoose.Schema({
    name: {
        type:String,
        required:[true,"Please provide your name"],
        minLength:[3,"Name must contain atleast 3 character"],
        maxLength:[30,"Name must contain max 30 character"],
    },
    email:{
        type:String,
        validator:[validator.isEmail,"Please provide valid email"],
        required:[true,"Please provide your email"],

    },
    coverLetter:{
        type:String,
        required:[true,"Please provide your cover Letter"],
    },
    phone:{
        type:Number,
        required:[true,"Please provide your phone number"],
    },
    address:{
        type:String,
        required:[true,"Please provide your address"]
    },
    resume:{
        public_id:{
            type:String,
            required:true,

        },
        url:{
            type:String,
            required:true,
        },

    },
    applicantID:{
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
        },
        role:{
            type:String,
            enum:["Job Seeker"],
            required:true
        }
    },
    employerID:{
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
        },
        role:{
            type:String,
            enum:["Employer"],
            required:true
        },
    },
    approved: {
        type: Boolean,
        default: false,
    }
})

export const Application = mongoose.model("Application",applicationSchema);