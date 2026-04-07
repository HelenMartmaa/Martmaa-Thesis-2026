// To search for existing user by email or create a new one
import db from "../config/db.js";

const findUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM users WHERE email = ?";

    db.get(sql, [email], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

const createUser = (email, passwordHash) => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO users (email, password_hash)
      VALUES (?, ?)
    `;

    db.run(sql, [email, passwordHash], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({
          id: this.lastID,
          email,
        });
      }
    });
  });
};

export { findUserByEmail, createUser };