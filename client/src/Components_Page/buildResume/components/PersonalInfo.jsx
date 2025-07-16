import { useEffect, useRef } from "react";
import useResumeStore from "../../../store/resumeStore";

export default function PersonalInfo() {
  const { personalInfo, setPersonalInfo, fetchResume, updateResume, currentResumeId } = useResumeStore();
  const debounceTimer = useRef(null); // Ref to store timer ID


  useEffect(() => {
    if (currentResumeId) {
      fetchResume(currentResumeId); // Fetch only if ID exists
    }
  }, [currentResumeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update the local state
    setPersonalInfo({ ...personalInfo, [name]: value });

    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set a new timer
    debounceTimer.current = setTimeout(() => {
      if (currentResumeId) {
        updateResume(currentResumeId).catch((err) => {
          console.error("Error updating resume:", err);
        });
      }
    }, 700); //  600ms is good for forms
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Personal Information</h2>
        <p className="text-gray-400 text-sm mt-1">
          Enter your personal details to start building your resume
        </p>
      </div>
      <div className="space-y-4">
        {["name", "email", "phone", "linkedin", "github"].map((field) => (
          <div key={field}>
            <label htmlFor={field} className="block text-sm text-gray-300 mb-1 capitalize">
              {field}
            </label>
            <input
              type="text"
              name={field}
              id={field}
              placeholder={
                field === "email" ? "john.doe@example.com" :
                field === "phone" ? "+1 (555) 123-4567" :
                field === "linkedin" ? "linkedin.com/in/johndoe" :
                field === "github" ? "github.com/johndoe" : "John Doe"
              }
              value={personalInfo[field] || ""}
              onChange={handleChange}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors duration-300"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
