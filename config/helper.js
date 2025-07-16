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