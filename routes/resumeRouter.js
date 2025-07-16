import { Router } from "express";
import { getResumeData } from "../controllers/resumeController.js";

const resumeRouter = Router();

resumeRouter.get('/', getResumeData);


export default resumeRouter;