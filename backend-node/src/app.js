import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import initDb from "./config/initDb.js";
// import db from "./config/db.js"; For debugging users table

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

initDb();

app.get("/api/health", (req, res) => {
  res.json({ message: "Backend is running" });
});

/* For debugging users table:
app.get("/api/debug/users", (req, res) => {
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});
*/

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});