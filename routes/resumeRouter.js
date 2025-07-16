import { Router } from "express";
import { getResumeData } from "../controllers/resumeController.js";
import multer from "multer";
import fs from "fs";
import path from "path";

// inside media needs to create and resume folder
if (!fs.existsSync('media/resume')) {
    fs.mkdirSync('media/resume');
}

const uploadDir = 'media/resume';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

const resumeRouter = Router();

resumeRouter.get('/', upload.single('resume'), getResumeData);


export default resumeRouter;