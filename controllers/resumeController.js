import { parseOffice } from "officeparser";
import { readFileSync } from "fs";
import { fileParser } from "../config/helper.js";

export const getResumeData = async(req, res) => {
    try {

        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Validate file type
        const validMimeTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

        if (!validMimeTypes.includes(file.mimetype)) {
            return res.status(400).json({ message: "Invalid file type. Only PDF and Word documents are allowed." });
        }

        let fileText = await fileParser(file);
        console.log("Parsed file text:", fileText);

        const { jobDescription } = req.body;
        if (!jobDescription) {
            return res.status(400).json({ message: "Job description is required" });
        }


        res.status(200).json({
            message: "Resume data fetched successfully",
        });
    } catch (error) {
        console.error("Error fetching resume data:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};