import useResumeStore from "../../store/resumeStore";
import PersonalInfo from "./components/PersonalInfo";
import Skills from "./components/Skills";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Education from "./components/Education";
import Preview from "./components/Preview";
import ChoiceScreen from "./components/ChoiceScreen";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Achievements from "./components/Achievements";
import Extracurricular from "./components/Extracurricular";


export default function BuildResume() {
  const { step, nextStep, prevStep, saveResume, updateResume, currentResumeId, setStep } = useResumeStore();
  const navigate = useNavigate();


  const handleChoice = () => {
    nextStep(); // Move from ChoiceScreen to PersonalInfo
  };

  const handleBackToOptions = () => {
    if (window.confirm("Are you sure? Unsaved changes will be lost.")) {
      setStep(1); // Return to ChoiceScreen
    }
  };

  const handleFinish = async () => {
    try {
      if (currentResumeId) {
        await updateResume(currentResumeId);
        toast.success("Resume updated successfully!");
      } else {
        await saveResume();
        toast.success("Resume saved successfully!");
      }

      setStep(1);
      navigate("/buildresume");

    } catch (error) {
      toast.error("Error saving/updating resume. Please try again.");
    }
  };



  const steps = [
    { component: <ChoiceScreen onChoice={handleChoice} />, title: "Choose Action" },
    { component: <PersonalInfo />, title: "Personal Info" },
    { component: <Education />, title: "Education" },
    { component: <Skills />, title: "Skills" },
    { component: <Experience />, title: "Experience" },
    { component: <Projects />, title: "Projects" },
    { component: <Achievements />, title: "Achievements" },
    { component: <Extracurricular />, title: "Extra Curricular" },
    { component: <Preview />, title: "Preview" },
  ];


  const isChoiceStep = step === 1;


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-6 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-gray-900 rounded-2xl shadow-xl border border-gray-800 overflow-hidden">
        {/* Header with Back to Options */}
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Resume Builder</h1>
          {!isChoiceStep && (
            <button
              onClick={handleBackToOptions}
              className="py-1 px-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-300 text-sm"
            >
              Back to Home
            </button>
          )}
        </div>

        {/* Progress Bar (Hidden on Choice Step) */}
{!isChoiceStep && (
  <div className="px-6 pb-6 overflow-x-auto">
    <div className="flex items-center min-w-max gap-4">
      {steps.slice(1).map((stepItem, index) => {
        const stepNumber = index + 2;
        return (
          <div key={index} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  stepNumber <= step
                    ? "bg-amber-500 text-gray-900"
                    : "bg-gray-700 text-gray-400"
                }`}
              >
                {stepNumber - 1}
              </div>
              <span className="text-xs mt-2 text-gray-300 text-center max-w-[90px] whitespace-nowrap">
                {stepItem.title}
              </span>
            </div>
            {index < steps.length - 2 && (
              <div
                className={`h-1 w-10 sm:w-14 mx-2 transition-all duration-300 ${
                  stepNumber < step ? "bg-amber-500" : "bg-gray-700"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  </div>
)}



        {/* Content */}
        <div className="p-6">
          <div className="min-h-[400px] flex flex-col justify-between">
            <div>{steps[step - 1].component}</div>

            {/* Navigation Buttons */}
            {!isChoiceStep && (
              <div className="mt-6 flex justify-between gap-4">
                {step > 2 && (
                  <button
                    onClick={prevStep}
                    className="flex-1 py-2 px-4 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-300"
                  >
                    Previous
                  </button>
                )}
                {step < steps.length ? (
                  <button
                    onClick={nextStep}
                    className="flex-1 py-2 px-4 bg-amber-500 text-gray-900 rounded-lg font-semibold hover:bg-amber-600 transition-colors duration-300"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={handleFinish}
                    className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors duration-300"
                  >


                    Finish
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={3000} />

    </div>

  );
}