import useResumeStore from "../../../store/resumeStore";

export default function Achievements() {
  const { achievements, setAchievements } = useResumeStore();

  const handleChange = (index, value) => {
    const updated = [...achievements];
    updated[index] = value;
    setAchievements(updated);
  };

  const addAchievement = () => {
    setAchievements([...(achievements || []), ""]);
  };

  const removeAchievement = (index) => {
    const updated = achievements.filter((_, i) => i !== index);
    setAchievements(updated);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-4">Achievements</h2>
      {(achievements || []).map((ach, index) => (
        <div key={index} className="mb-4 flex gap-2 items-center">
          <input
            type="text"
            value={ach}
            onChange={(e) => handleChange(index, e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700"
            placeholder={`Achievement ${index + 1}`}
          />
          <button
            onClick={() => removeAchievement(index)}
            className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        onClick={addAchievement}
        className="mt-2 px-4 py-2 bg-amber-500 text-gray-900 rounded hover:bg-amber-600"
      >
        + Add Achievement
      </button>
    </div>
  );
}
