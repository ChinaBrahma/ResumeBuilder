import fs from "fs";
import PdfParse from "pdf-parse";
import axios from "axios";

export const handleResume = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const { role, job_desc } = req.body;

  if (!role || !job_desc) {
    return res
      .status(400)
      .json({ error: "Job role and description are required" });
  }
  let resumeText = "";
  try {
    const pdfData = await PdfParse(fs.readFileSync(req.file.path));
    resumeText = pdfData.text;
    fs.unlinkSync(req.file.path);
  } catch (error) {
    return res.status(500).json({ error: "Error processing resume file" });
  }

  try {
    const response = await axios.post(process.env.PYTHON_URL_PRODUCTION, {
      resume_text: resumeText,
      job_desc,
      role,
    });
    console.log(response.data); // WORKING Fine
    // Normalize the response
    const normalizedResponse = {
      score: response.data.score,
      suggestions: [], // Add empty array for consistency
    };

    return res.json(normalizedResponse);
  } catch (error) {
    console.error("Error in ATS model request:", error.message);
    return res.status(500).json({ error: "ATS Model Error" });
  }
};
