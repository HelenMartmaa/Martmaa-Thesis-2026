// To search for existing user by email or create a new one
import prisma from "../config/prisma.js";

const findUserByEmail = async (email) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

const createUser = async (email, passwordHash) => {
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
    },
  });

  return {
    id: user.id,
    email: user.email,
  };
};

export { findUserByEmail, createUser };