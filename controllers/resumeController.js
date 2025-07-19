import { parseOffice } from "officeparser";
import { readFileSync } from "fs";
import { fileParser, createAnalysisPrompt, createImprovementPrompt } from "../config/helper.js";
import model from "../config/gemini.js";

export const getResumeData = async(req, res) => {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ message: "No file uploaded" });

        const { jobDescription } = req.body;
        if (!jobDescription) return res.status(400).json({ message: "Job description is required" });

        const resumeText = await fileParser(file);


        const analysisPrompt = createAnalysisPrompt(resumeText, jobDescription);
        const analysisResult = await model.generateContent(analysisPrompt);
        const analysisResponseText = analysisResult.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
        const analysisData = JSON.parse(analysisResponseText);


        const improvementPrompt = createImprovementPrompt(resumeText, jobDescription);
        const improvementResult = await model.generateContent(improvementPrompt);
        const improvedResumeText = improvementResult.response.text().trim();

        res.status(200).json({
            message: "Resume data fetched successfully",
            analysis: analysisData,
        });

    } catch (error) {
        console.error("Error fetching resume data:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};