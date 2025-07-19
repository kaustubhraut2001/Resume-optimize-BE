import { readFileSync } from 'fs';
import { parseOfficeAsync } from 'officeparser';


export const fileParser = async(file) => {
    try {

        let fileText = '';
        const filePath = file.path;
        console.log("File path:", filePath);
        if (file.mimetype === 'application/pdf') {
            const data = await parseOfficeAsync(filePath);
            fileText = data;

        } else if (file.mimetype === 'application/msword' || file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            fileText = parseOffice(filePath);
        } else {
            throw new Error('Unsupported file type');
        }
        return fileText;

    } catch (error) {
        console.error("Error parsing file:", error.message);
        throw new Error("File parsing failed");
    }
};


export const createAnalysisPrompt = (resumeText, jobDescription) => {
    return `
    **Instruction:**
    Analyze the provided resume against the given job description. Your response MUST be a single, raw JSON object and nothing else. Do not include any explanatory text, comments, or markdown formatting like \`\`\`json.

    **JSON Schema to Follow:**
    {
      "overallScore": <Integer, a score from 0 to 100 representing the overall match>,
      "keyMetrics": {
        "atsCompatibility": <Integer, a score from 0 to 100 based on formatting, structure, and keyword usage for Applicant Tracking Systems>,
        "keywordMatch": <Integer, a score from 0 to 100 based on how well the resume's keywords match the job description>
      },
      "actionableSuggestions": <Array of strings. Provide specific, actionable tips to improve the resume. For example: "Add the keyword 'SaaS' to your experience section." or "Quantify your achievement in the project management role by adding metrics, like 'Increased team productivity by 15%'." >,
      "whatYouAreDoingRight": <Array of strings. Highlight 2-3 strengths of the resume. For example: "The resume uses a clean, ATS-friendly format." or "Effectively showcases project management skills.">
    }

    **Example of the required output format:**
    {
      "overallScore": 88,
      "keyMetrics": {
        "atsCompatibility": 95,
        "keywordMatch": 82
      },
      "actionableSuggestions": [
        "Include terms like 'SaaS', 'Agile Methodology', and 'Go-to-Market Strategy' to better match the job description.",
        "Instead of 'Managed a team,' use 'Managed a team of 5 engineers to increase productivity by 15% in Q2'."
      ],
      "whatYouAreDoingRight": [
        "Excellent formatting, easily readable by ATS.",
        "Strong summary that clearly states career objectives."
      ]
    }

    **Input Data:**

    [START RESUME TEXT]
    ${resumeText}
    [END RESUME TEXT]

    [START JOB DESCRIPTION]
    ${jobDescription}
    [END JOB DESCRIPTION]
    `;
};


export const createImprovementPrompt = (resumeText, jobDescription) => {
    return `
    **Instruction:**
    Rewrite the entire resume provided below to be highly optimized for the job description. Your response must be only the full, rewritten resume text. Do not include any other text, comments, or explanations.

    **Optimization Guidelines:**
    1.  **Integrate Keywords:** Seamlessly integrate relevant keywords from the job description.
    2.  **Quantify Achievements:** Enhance bullet points with metrics and data where possible (e.g., "Managed a team" becomes "Led a 5-person engineering team to a 15% productivity increase").
    3.  **Use Action Verbs:** Start bullet points with strong action verbs.
    4.  **Maintain Structure:** Preserve the original resume's logical sections (e.g., Contact Information, Professional Summary, Work Experience, Education, Skills).
    5.  **Professional Tone:** Ensure the language is professional and concise.

    **Input Data:**

    [START RESUME TEXT]
    ${resumeText}
    [END RESUME TEXT]

    [START JOB DESCRIPTION]
    ${jobDescription}
    [END JOB DESCRIPTION]
    `;
};