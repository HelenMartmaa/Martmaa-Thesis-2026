import { registerUser, loginUser } from "../services/auth.service.js";

// Handles registration request and returns HTTP response
const register = async (req, res) => {
  try {
    const newUser = await registerUser(req.body);

    return res.status(201).json({
      message: "User registered successfully.",
      user: {
        id: newUser.id,
        email: newUser.email,
      },
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};

// Handles login request and returns HTTP response
const login = async (req, res) => {
  try {
    const result = await loginUser(req.body);

    return res.status(200).json({
      message: "Login successful.",
      ...result,
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};

// Returns currently authenticated user
const getCurrentUser = async (req, res) => {
  return res.status(200).json({
    user: req.user,
  });
};

export { register, login, getCurrentUser };