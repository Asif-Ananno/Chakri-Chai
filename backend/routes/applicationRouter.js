import express from 'express';
import {employerGetAllApplications,jobseekerGetAllApplications,jobSeekerDeleteApplication,postApplication,employerapprove} from "../controllers/applicationController.js"
import {isAuthorized } from "../middlewares/auth.js";
const router = express.Router();

router.post("/post", isAuthorized, postApplication);
router.get("/jobseeker/getall",isAuthorized,jobseekerGetAllApplications);
router.get("/employer/getall",isAuthorized,employerGetAllApplications);
router.delete("/delete/:id",isAuthorized,jobSeekerDeleteApplication);
router.post("/approve/:id",isAuthorized,employerapprove);

export default router;