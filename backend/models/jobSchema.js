import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title:{
        type: String,
        required:[true,"Please provide job title"],
        minLength:[3,"Job title must contain 3 character"],
        maxLength:[50,"job title must not exceed 50 characters"],
    },
    description:{
        type:String,
        required:[true,"Please provide job description"],
        minLength:[50,"Job description must contain 50 character"],
        maxLength:[350,"job description must not exceed 350 characters"],

    },
    category:{
        type:String,
        required:[true,"Job category is required"],

    },
    country:{
        type:String,
        required:[true,"Country is required"],
    },
    city:{
        type:String,
        required:[true,"City is required"],
    },
    location:{
        type:String,
        required:[true,"Location is required"],
        minLength:[5,"Job location must contain 5 characters"],
    },
    fixedSalary:{
        type:Number,
        minLength:[4,"Fixed salary must contain atleast 4 digits"],
        maxLength:[10,"Fixed salary must contain atleast 10 digits"],
    },
    salaryFrom:{
        type:Number,
        minLength:[4,"salary from must contain atleast 4 digits"],
        maxLength:[10,"salary from must contain atleast 10 digits"],
    },
    salaryTo:{
        type:Number,
        minLength:[4," salary to must contain atleast 4 digits"],
        maxLength:[10," salary to must contain atleast 10 digits"],
    },
    expired:{
        type:Boolean,
        default:false,
    },
    jobPostedOn:{
        type:Date,
        default:Date.now,
    },
    postedBy:{
        type:mongoose.Schema.ObjectId,
        ref: "User",
        required:true,
    },
});

export const Job = mongoose.model("Job",jobSchema);