import { useRef, useState } from "react";
import useResumeStore from "../../../store/resumeStore";
import { FiDownload, FiLoader } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ResumePreview() {
  const {
    personalInfo,
    skills,
    experience,
    projects,
    education,
    achievements,
    extracurricular,
    fetchResume,
    updateResume,
    saveResume,
    downloadResume,
    currentResumeId,
  } = useResumeStore();

  const resumeRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      let resumeId = currentResumeId;
      if (!resumeId) {
        const response = await saveResume();
        resumeId = response.resumeId || response._id;
        if (!resumeId) throw new Error("No resumeId returned from saveResume");
      } else {
        await updateResume(resumeId);
      }
      await downloadResume(resumeId);
    } catch (error) {
      console.error("Failed to download resume:", error);
      alert("Failed to download resume. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-6 flex items-center justify-center">
      <div className="w-full max-w-4xl space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Resume Preview</h1>
          <p className="text-gray-400 text-sm mt-2">
            Review your resume below and choose an action
          </p>
        </div>

        <div
          ref={resumeRef}
          className="bg-white text-gray-900 p-8 rounded-2xl shadow-xl border border-gray-200 print:bg-white print:shadow-none print:border-none"
        >
          {personalInfo ? (
            <>
              {/* INTRO */}
              <div className="border-b border-gray-300 pb-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {personalInfo.name || "Your Name"}
                </h2>
                <div className="text-gray-600 text-sm mt-2 space-y-1">
                  <p>
                    {personalInfo.email || "email@example.com"} | {personalInfo.phone || "Phone"}
                  </p>
                  <p>
                    {personalInfo.linkedin && (
                      <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-500">
                        {personalInfo.linkedin}
                      </a>
                    )}
                    {personalInfo.github && " | "}
                    {personalInfo.github && (
                      <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-500">
                        {personalInfo.github}
                      </a>
                    )}
                  </p>
                </div>
              </div>

              {/* SKILLS */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Skills</h3>
                <p className="text-gray-700 text-sm">
                  {skills?.length > 0 ? skills.join(", ") : "No skills added"}
                </p>
              </div>

              {/* EXPERIENCE */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Experience</h3>
                {experience?.length > 0 ? (
                  experience.map((exp, index) => (
                    <div key={index} className="mb-4">
                      <h4 className="font-semibold text-gray-800">{exp.company} - {exp.title}</h4>
                      <p className="text-gray-600 text-sm">
                        {exp.startDate} – {exp.endDate || "Present"}
                      </p>
                      <p className="text-gray-700 text-sm mt-1">
                        {exp.description || "No description provided"}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 text-sm">No experience added</p>
                )}
              </div>

              {/* PROJECTS */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Projects</h3>
                {projects?.length > 0 ? (
                  projects.map((proj, index) => (
                    <div key={index} className="mb-4">
                      <h4 className="font-semibold text-gray-800">{proj.title}</h4>
                      <p className="text-gray-700 text-sm mt-1">{proj.description}</p>
                      {proj.link && (
                        <a
                          href={proj.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-500 text-sm mt-1 inline-block"
                        >
                          {proj.link}
                        </a>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 text-sm">No projects added</p>
                )}
              </div>

              {/* EDUCATION */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Education</h3>
                {education?.length > 0 ? (
                  education.map((edu, index) => (
                    <div key={index} className="mb-4">
                      <h4 className="font-semibold text-gray-800">{edu.school}</h4>
                      <p className="text-gray-700 text-sm">
                        {edu.degree} {edu.year && `(${edu.year})`}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 text-sm">No education added</p>
                )}
              </div>

              {/* ACHIEVEMENTS */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Achievements</h3>
                {achievements?.length > 0 ? (
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    {achievements.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600 text-sm">No achievements added</p>
                )}
              </div>

              {/* EXTRA CURRICULAR */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Extra-Curricular Activities</h3>
                {extracurricular?.length > 0 ? (
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    {extracurricular.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600 text-sm">No extra-curricular activities added</p>
                )}
              </div>
            </>
          ) : (
            <p className="text-gray-600 text-center">Loading resume...</p>
          )}
        </div>

        {/* BUTTONS */}
        <div className="flex justify-center gap-4 no-print">
          {/* <button
            onClick={handleSaveResume}
            disabled={isLoading}
            className="py-2 px-6 bg-amber-500 text-gray-900 rounded-lg font-semibold flex items-center gap-2 hover:bg-amber-600 disabled:bg-gray-700 disabled:text-gray-400 transition-colors duration-300"
          >
            {isLoading ? <FiLoader className="animate-spin" size={20} /> : <FiDownload size={20} />}
            Save Resume
          </button> */}
          <button
            onClick={handleDownload}
            disabled={isLoading}
            className="py-2 px-6 bg-amber-500 text-gray-900 rounded-lg font-semibold flex items-center gap-2 hover:bg-amber-600 disabled:bg-gray-700 disabled:text-gray-400 transition-colors duration-300"
          >
            {isLoading ? <FiLoader className="animate-spin" size={20} /> : <FiDownload size={20} />}
            Save & Download as PDF
          </button>
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}
