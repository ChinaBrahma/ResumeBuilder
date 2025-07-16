import express from "express";
import { loginUser, registerUser, logoutUser } from "../controllers/authController.js";
import { authenticateUser } from "../middlewares/authMiddleware.js"; // Import the middleware
import User from "../models/userSchema.js"; // ⬅️ Import your User model

const router = express.Router();


router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
// ✅ Use middleware to protect `/me` route


router.get("/me", authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("username email"); // fetch user from DB

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    res.json({
      userId: user._id,
      username: user.username,
      email: user.email,
    });
  } catch (err) {
    console.error("Error in /me:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});


// me  is used to check whether a user is 
// authenticated and to retrieve their details without requiring extra input.

export default router;
