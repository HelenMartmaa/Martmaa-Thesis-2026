// For calling services on the data from frontend and returning HTTP response
import { registerUser, loginUser } from "../services/auth.service.js";

const register = async (req, res) => {
  try {
    const newUser = await registerUser(req.body);

    return res.status(201).json({
      message: "User registered successfully.",
      user: newUser,
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};

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

const getCurrentUser = async (req, res) => {
  return res.status(200).json({
    user: req.user,
  });
};

export { register, login, getCurrentUser };