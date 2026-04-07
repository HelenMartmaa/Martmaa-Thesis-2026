import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByEmail, createUser } from "../repositories/auth.repository.js";

// Logic for registering a new user
const registerUser = async ({ email, password, repeatPassword }) => {
  const normalizedEmail = email.trim().toLowerCase(); // normalizing email

  if (!normalizedEmail || !password || !repeatPassword) {
    throw new Error("All fields are required."); // field control in registering
  }

  if (password !== repeatPassword) {
    throw new Error("Passwords do not match."); // password matching check
  }

  const existingUser = await findUserByEmail(normalizedEmail); // comparing email with existing users as email = username

  if (existingUser) {
    throw new Error("User with this email already exists.");
  }

  const passwordHash = await bcrypt.hash(password, 10); // hashing password

  const newUser = await createUser(normalizedEmail, passwordHash);

  return newUser;
};

// Logic for logging in for existing users
const loginUser = async ({ email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail || !password) {
    throw new Error("Email and password are required.");
  }

  const user = await findUserByEmail(normalizedEmail);

  if (!user) {
    throw new Error("Invalid email or password.");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password.");
  }

  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
    },
  };
};

export { registerUser, loginUser };