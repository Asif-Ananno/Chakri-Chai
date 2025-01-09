import {catchAsyncError} from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Application } from "../models/applicationSchema.js";
import cloudinary from "cloudinary";
import {Job} from "../models/jobSchema.js";
import nodemailer from "nodemailer";

export const employerGetAllApplications = catchAsyncError(async(req,res,next)=>{
    const {role} = req.user;
    if(role==="Job Seeker"){
        return next(new ErrorHandler("Job seeker is not allowed to access this resource",400));
    }
    const {_id} = req.user;
    const applications = await Application.find({'employerID.user':_id});
    res.status(200).json({
        success:true,
        applications
    });
})

export const jobseekerGetAllApplications = catchAsyncError(async(req,res,next)=>{
    const {role} = req.user;
    if(role==="Employer"){
        return next(new ErrorHandler("Employer is not allowed to access this resource",400));
    }
    const {_id} = req.user;
    const applications = await Application.find({'applicantID.user':_id});
    res.status(200).json({
        success:true,
        applications
    });
})

export const jobSeekerDeleteApplication = catchAsyncError(async(req,res,next)=>{
    const {role} = req.user;
    if(role==="Employer"){
        return next(new ErrorHandler("Employer is not allowed to access this resource",400));
    }
    
    const {id} = req.params;
    const application = await Application.findById(id);
    if(!application){
        return next(new ErrorHandler("Oops,Application not found",404));
    }
    await application.deleteOne();
    res.status(200).json({
        success:true,
        message:"Application deleted successfully"
    })
})

export const postApplication = catchAsyncError(async(req,res,next)=>{
    const {role} = req.user;
        if(role==="Employer"){
            return next(new ErrorHandler("Employer is not allowed to access this resource",400));
        }
    if(!req.files || Object.keys(req.files).length===0){
        return next(new ErrorHandler("Resume file required"));
    }
    const {resume} = req.files;

    const allowedFormats = ["image/png","image/jpeg","image/webp,image/PNG"];

    if(!allowedFormats.includes(resume.mimetype)){
        return next(new ErrorHandler("Invalid file type. Please upload PNG/JPG/Webp",400))
    }

    const cloudinaryResponse = await cloudinary.uploader.upload(
        resume.tempFilePath
    );
    if(!cloudinaryResponse || cloudinaryResponse.error){
        console.error("Cloudinary Error:",
        cloudinaryResponse.error || "Unknown cloudinary Error"
        
        );
        return next(new ErrorHandler("Failed to upload resume",500))
    }

    const {name,email,coverLetter,phone, address, jobId} = req.body;
    const applicantID = {
        user: req.user._id,
        role:"Job Seeker",
    };

    if(!jobId){
        return next(new ErrorHandler("Job is not found",404));
    }
    const jobDetails = await Job.findById(jobId);

    if(!jobDetails){
        return next(new ErrorHandler("Job can not be found",404));
    }

    const employerID = {
        user:jobDetails.postedBy,
        role:"Employer",
    };

    if(!name || !email || !coverLetter || !phone || !address || !applicantID || !employerID || !resume){
        return next(new ErrorHandler("Please fill all fields",400));
    }
    const application = await Application.create({
        name,
        email,
        coverLetter,
        phone,
        address,
        applicantID,
        employerID,
        resume:{
            public_id:cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        }
    })
    res.status(200).json({
        success:true,
        message:"Application submitted",
        application,
    });
})



export const employerapprove = catchAsyncError(async (req, res, next) => {
  const { id, to, subject, text } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      auth: {
        user: "chakrichai.000@gmail.com",
        pass: "ghquttkpsargrrpl",
      },
    });

    const mailOptions = {
      from: "chakrichai.000@gmail.com",
      to: to,
      subject: subject,
      text: text,
    };

    await transporter.sendMail(mailOptions);
    await Application.findByIdAndUpdate(id, { approved: true });
    console.log("Approval email sent successfully");
    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending approval email:", error);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
});
