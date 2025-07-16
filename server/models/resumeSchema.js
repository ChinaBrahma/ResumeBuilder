import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  /* ---------- 1. INTRO / PERSONAL ---------- */
  personalInfo: {
    name:     String,
    email:    String,
    phone:    String,
    linkedin: String,
    github:   String,
  },

  /* ---------- 2. EDUCATION ---------- */
  education: [
    {
      school: String,
      degree: String,
      year:   String,   // e.g. "2023" or "Aug 2023 – Jun 2026"
    },
  ],

  /* ---------- 3. SKILLS ---------- */
  skills: [String],

  /* ---------- 4. EXPERIENCE ---------- */
  experience: [
    {
      company:   String,
      title:     String,     // job/role title
      startDate: String,
      endDate:   String,
      description: String,
    },
  ],

  /* ---------- 5. PROJECTS ---------- */
  projects: [
    {
      title:       String,
      description: String,
      link:        String,
    },
  ],

  /* ---------- 6. ACHIEVEMENTS ---------- */
  achievements: [String],

  /* ---------- 7. EXTRA-CURRICULAR ---------- */
  extracurricular: [String],
});

export default mongoose.model("Resume", ResumeSchema);
