import useResumeStore from "../../../store/resumeStore";

export default function Extracurricular() {
  const { extracurricular, setExtracurricular } = useResumeStore();

  const handleChange = (index, value) => {
    const updated = [...extracurricular];
    updated[index] = value;
    setExtracurricular(updated);
  };

  const addActivity = () => {
    setExtracurricular([...(extracurricular || []), ""]);
  };

  const removeActivity = (index) => {
    const updated = extracurricular.filter((_, i) => i !== index);
    setExtracurricular(updated);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-4">Extra Curricular</h2>
      {(extracurricular || []).map((item, index) => (
        <div key={index} className="mb-4 flex gap-2 items-center">
          <input
            type="text"
            value={item}
            onChange={(e) => handleChange(index, e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700"
            placeholder={`Activity ${index + 1}`}
          />
          <button
            onClick={() => removeActivity(index)}
            className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        onClick={addActivity}
        className="mt-2 px-4 py-2 bg-amber-500 text-gray-900 rounded hover:bg-amber-600"
      >
        + Add Activity
      </button>
    </div>
  );
}
