export const getResumeData = async(req, res) => {
    try {
        console.log("Fetching resume data...");
        res.status(200).json({
            message: "Resume data fetched successfully",
        });
    } catch (error) {
        console.error("Error fetching resume data:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};