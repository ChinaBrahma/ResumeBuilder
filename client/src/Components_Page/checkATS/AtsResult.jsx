import PropTypes from "prop-types";
import { motion } from "framer-motion"; // For animations

const AtsResult = ({ data }) => {
  if (!data) {
    return (
      <p className="text-gray-400 text-center italic">
        No results available. Upload your resume to get a score.
      </p>
    );
  }

  // Determine score color based on value
  const getScoreColor = (score) => {
    if (score >= 80) return "from-green-500 to-teal-500";
    if (score >= 60) return "from-yellow-500 to-orange-500";
    return "from-red-500 to-pink-500";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className=" flex flex-col justify-center items-center mt-6 p-6 bg-gray-800 bg-opacity-90 backdrop-blur-md rounded-xl w-full max-w-lg shadow-2xl border border-gray-700"
    >
      {/* Header */}
      <h2 className="text-3xl font-bold text-white tracking-tight">
        Your ATS Score
      </h2>
      <p className="text-sm text-gray-400 mt-1">
        How well your resume matches the job
      </p>

      {/* Score Circle */}
      <div className="mt-6 flex items-center justify-center">
        <div
          className={`relative w-36 h-36 flex items-center justify-center rounded-full bg-gradient-to-r ${getScoreColor(
            data.score
          )} text-white text-3xl font-extrabold shadow-lg transform transition-transform hover:scale-105`}
        >
          <span>{data.score}%</span>
          <div className="absolute inset-0 rounded-full border-4 border-gray-900 opacity-20" />
        </div>
      </div>

      {/* Suggestions */}
      {data.suggestions && data.suggestions.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-amber-400">
            Suggestions to Improve
          </h3>
          <ul className="mt-4 space-y-3">
            {data.suggestions.map((suggestion, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, duration: 0.3 }}
                className="p-4 bg-gray-700 rounded-lg shadow-md text-gray-200 text-sm hover:bg-gray-600 transition-colors"
              >
                {suggestion}
              </motion.li>
            ))}
          </ul>
        </div>
      )}

      {/* Optional Feedback */}
      {data.score < 80 && (
        <p className="mt-4 text-gray-400 text-sm italic">
          Boost your score by addressing the issues in your resume!
        </p>
      )}
    </motion.div>
  );
};

AtsResult.propTypes = {
  data: PropTypes.shape({
    score: PropTypes.number,
    suggestions: PropTypes.arrayOf(PropTypes.string),
  }),
};

export default AtsResult;