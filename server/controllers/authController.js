import generateToken from "../middlewares/auth.js";
import User from "../models/userSchema.js";
import bcrypt from 'bcryptjs';


export const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });
        await newUser.save();

        // Generate JWT token
        const token = generateToken(res,newUser._id);

        res.status(201).json({
            message: "User registered successfully",
            user: {
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                token // optional
            }
        });

    } catch (error) {
        console.error("Error in registerUser controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Compare password with hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate JWT token
        const token = generateToken(res,user._id);

        // Set token in HTTP-Only cookie (for security)
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Secure in production
            sameSite: "None",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        // Send response with user data (excluding password)
        res.status(200).json({
            message: "Login successful",
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                token, // Optional: Only send token in response if needed
            },
        });

    } catch (error) {
        console.error("Error in loginUser controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const logoutUser = (req, res) => {
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });
  
    res.status(200).json({ message: "Logged out successfully" });
};