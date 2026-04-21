import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import { authenticateToken } from "./middleware/auth.middleware.js";
import experimentRoutes from "./routes/experiment.routes.js";
import resultSetRoutes from "./routes/resultSet.routes.js";
import statisticalAnalysisRoutes from "./routes/statisticalAnalysis.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ message: "Backend is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/experiments", experimentRoutes);
app.use("/api/result-sets", resultSetRoutes);
app.use("/api/statistical-analyses", statisticalAnalysisRoutes);

//Middleware
app.get("/api/protected", authenticateToken, (req, res) => {
  res.json({
    message: "You have access to this protected route.",
    user: req.user,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});