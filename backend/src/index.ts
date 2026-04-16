import "reflect-metadata";
import express from "express";
import cors from "cors";
import { AppDataSource } from "./data-source";
import authRouter from "./router/authRouter";
import postRouter from "./router/postRouter";
import commentRouter from "./router/commentRouter";
import userRouter from "./router/userRouter";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// API routes
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/comments", commentRouter);
app.use("/api/users", userRouter);

// Health check
app.get("/health", (_req, res) => res.json({ status: "ok" }));

/** Initializes the database connection and starts the HTTP server */
async function bootstrap(): Promise<void> {
  try {
    await AppDataSource.initialize();
    console.log("Database connection established");

    app.listen(PORT, () => {
      console.log(`Backend running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start application:", err);
    process.exit(1);
  }
}

bootstrap();
