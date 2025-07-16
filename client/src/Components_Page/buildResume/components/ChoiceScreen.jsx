import { useEffect } from "react";
import useResumeStore from "../../../store/resumeStore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// eslint-disable-next-line react/prop-types
export default function ChoiceScreen({ onChoice }) {
  const { fetchALLResume, loadResume, resetForm, deleteResume, resumes, loading } = useResumeStore();

  const handleNewResume = () => {
    resetForm();
    onChoice();
  };

  const handleEditResume = async (resume) => {
    await loadResume(resume);
    onChoice();
  };

  const handleDeleteResume = async (resumeId) => {
    if (window.confirm("Are you sure you want to delete this resume? This action cannot be undone.")) {
      try {
        await deleteResume(resumeId);
        toast.success("Resume deleted successfully!")
        // alert("Resume deleted successfully!");
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        toast.error("Error deleting resume. Please try again.")
        // alert("Error deleting resume. Please try again.");
      }
    }
  };

  // useEffect(() => {
  //   fetchALLResume()
  //       .then(() => console.log("Resumes fetched successfully:", resumes))
  //       .catch((error) => console.error("Fetch resumes failed:", error));
  //   // Fetch resumes only if not already loaded and not currently loading
  //   // if (resumes.length === 0 && !loading) {
  //   //   fetchALLResume()
  //   //     .then(() => console.log("Resumes fetched successfully:", resumes))
  //   //     .catch((error) => console.error("Fetch resumes failed:", error));
  //   // }
  // }, []); // Dependencies ensure controlled fetching

  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="text-xl font-semibold text-white">What would you like to do?</h2>
      <button
        onClick={handleNewResume}
        className="w-full max-w-xs py-3 px-6 bg-amber-500 text-gray-900 rounded-lg font-semibold hover:bg-amber-600 transition-colors duration-300"
      >
        Create New Resume
      </button>
      <div className="w-full max-w-xs">
        <h3 className="text-lg font-medium text-gray-300 mb-2">Edit Existing Resume</h3>
        {loading ? (
          <p className="text-gray-400">Loading resumes...</p>
        ) : resumes.length === 0 ? (
          <p className="text-gray-400">No resumes found. Create a new one!</p>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {resumes.map((resume) => (
              <div key={resume._id} className="flex items-center justify-between gap-2">
                <button
                  onClick={() => handleEditResume(resume)}
                  className="flex-1 py-2 px-4 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-300 text-left truncate"
                >
                  {resume.title || `Resume - ${resume.personalInfo.name}`}
                </button>
                <button
                  onClick={() => handleDeleteResume(resume._id)}
                  className="py-1 px-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300 text-sm"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}