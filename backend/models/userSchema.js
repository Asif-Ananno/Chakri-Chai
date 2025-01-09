import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true,"PLease provide your name"],
        minLength:[3,"Name must contain minimun 3 characters"],
        maxLength:[30,"Name must not exceed 30 characters"],

    },
    email:{
        type: String,
        required:[true,"Please provide your email"],
        validate:[validator.isEmail,"Please provide valid email"],

    },
    phone:{
        type: Number,
        required:[true,"Please provide your phone number"],
    },
    password:{
        type:String,
        required:[true,"Please provide password"],
        minLength:[8,"password must contain minimun 8 characters"],
        maxLength:[32,"password must not exceed 32 characters"],
        select:false
    },
    role:{
        type:String,
        required:[true,"Please provide your role "],
        enum:["Job Seeker","Employer"],

    },
   },
   {
    timestamps: true,
   }
  
   
 )

 //user password hashing
 userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next()
    }
    this.password = await bcrypt.hash(this.password,10);
 })

 //comparing password
 userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
 };

 //generating JWT token
userSchema.methods.getJWTToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET_KEY,{
        expiresIn:process.env.JWT_EXPIRE,
    });
}

export const User = mongoose.model("User",userSchema);