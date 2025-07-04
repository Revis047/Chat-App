import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import messageRouter from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { app,server } from "./lib/socket.js";

dotenv.config(); //  Load environment variables early


//  Connect to DB before starting server
connectDB();

//  Configure CORS BEFORE defining routes
app.use(cors({
  origin: "http://localhost:5173", // Adjust for your frontend
  credentials: true // Allow cookies
}));

//  Increase request payload limits
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(cookieParser());

//  Routes
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRouter); // lowercase for REST conventions

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});
  