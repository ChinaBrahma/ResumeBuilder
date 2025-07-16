import { useState, useEffect } from "react";
import useResumeStore from "../../../store/resumeStore";
import { FiPlus, FiTrash } from "react-icons/fi";

export default function Skills() {
  const { skills, setSkills, fetchResume, updateResume, currentResumeId } = useResumeStore();
  const [skill, setSkill] = useState("");

  // console.log("current resume id in skills", currentResumeId);
  useEffect(() => {
    fetchResume(currentResumeId); // Fetch resume data on mount
  }, []);

  const addSkill = async () => {
    if (!skill.trim() || skills.includes(skill.trim().toLowerCase())) return;
    
    const updatedSkills = [...skills, skill.trim()];
    setSkills(updatedSkills);
    setSkill("");
    
    try {
      await updateResume(currentResumeId);
    } catch (error) {
      console.error("Error updating skills:", error);
    }
  };

  const removeSkill = async (index) => {
    const updatedSkills = skills.filter((_, i) => i !== index);
    setSkills(updatedSkills);
    
    try {
      await updateResume(currentResumeId);
    } catch (error) {
      console.error("Error removing skill:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Skills</h2>
        <p className="text-gray-400 text-sm mt-1">
          Add your key skills (press Enter or click + to add)
        </p>
      </div>

      {/* Input Section */}
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="e.g., JavaScript, Project Management"
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addSkill()}
          className="flex-1 p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors duration-300"
        />
        <button
          onClick={addSkill}
          disabled={!skill.trim()}
          className="p-3 bg-amber-500 text-gray-900 rounded-lg hover:bg-amber-600 disabled:bg-gray-700 disabled:text-gray-400 transition-colors duration-300"
        >
          <FiPlus size={20} />
        </button>
      </div>

      {/* Skills List */}
      <div className="flex flex-wrap gap-2">
        {skills.length > 0 ? (
          skills.map((s, index) => (
            <div
              key={index}
              className="bg-gray-800 border border-gray-700 px-3 py-1.5 rounded-lg flex items-center text-gray-200"
            >
              <span>{s}</span>
              <button
                onClick={() => removeSkill(index)}
                className="ml-2 text-red-500 hover:text-red-400 transition-colors duration-200"
              >
                <FiTrash size={16} />
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm">No skills added yet</p>
        )}
      </div>
    </div>
  );
}
