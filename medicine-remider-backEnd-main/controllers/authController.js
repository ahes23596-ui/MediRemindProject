import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

// helper ظ„طھظˆظ„ظٹط¯ JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// ًںں¢ Register
export const register = async (req, res) => {
  try {
    const { firstname, lastname, username, password, cpassword } = req.body;

    if (!firstname || !lastname || !username || !password || !cpassword)
      return res.status(400).json({ message: "All fields are required", success: false });

    if (password !== cpassword)
      return res.status(400).json({ message: "Passwords do not match", success: false });

    const normalizedUsername = username.toLowerCase().trim();
    const existingUser = await User.findOne({ username: normalizedUsername });
    if (existingUser)
      return res.status(409).json({ message: "Username already taken", success: false });

    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUNDS || "10"));

    const newUser = await User.create({
      firstname,
      lastname,
      username: normalizedUsername,
      password: hashedPassword,
    });

    const token = generateToken(newUser._id);

    res.status(201).json({
      message: "User registered successfully",
      success: true,
      jwtToken: token,
      user: {
        id: newUser._id,
        firstname: newUser.firstname,
        lastname: newUser.lastname,
        username: newUser.username,
      },
    });
  } catch (error) {
    console.error("Error in register:", error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

// ًںں¢ Login
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).json({ message: "Username and password required", success: false });

    const normalizedUsername = username.toLowerCase().trim();
    const user = await User.findOne({ username: normalizedUsername }).select("+password");

    if (!user) return res.status(401).json({ message: "Invalid credentials", success: false });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials", success: false });

    const token = generateToken(user._id);

    res.status(200).json({
      message: "Login successful",
      success: true,
      jwtToken: token,
      user: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

// ًںں¢ Protected Profile
export const getProfile = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "User not found", success: false });

  res.status(200).json({ success: true, user: req.user });
};


// ًںں¢ Logout (frontend ظٹط¬ط¨ ط£ظ† ظٹط­ط°ظپ ط§ظ„طھظˆظƒظ†)
export const logout = (req, res) => {
  res.json({ message: "Logged out successfully", success: true });
};

// ًںں¢ Refresh Token (ظٹظ…ظƒظ† ط§ط³طھط®ط¯ط§ظ…ظ‡ ظ„طھط¬ط¯ظٹط¯ ط§ظ„طھظˆظƒظ†)
export const refreshToken = (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not found", success: false });
    }

    const newToken = generateToken(req.user._id);
    res.json({ success: true, jwtToken: newToken });
  } catch (error) {
    console.error("Error in refreshToken:", error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};
