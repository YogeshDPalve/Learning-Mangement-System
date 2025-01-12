import express from "express";
import "colors";
import dotenv from "dotenv";
import connectDb from "./database/db.js";
import userRoutes from "./routes/user.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
dotenv.config({});

// call database connection
connectDb();

const app = express();
const port = process.env.PORT || 4000;

// default middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// apis
app.use("/api/v1/user", userRoutes);

app.get("/", (req, res) => {
  console.log("hello from app".bgMagenta.white);
  res.status(200).send({
    success: true,
    message: "Hello, welcome to Learning Management System",
  });
});

// app listen
app.listen(port, () => {
  console.log(`Server listen at http://localhost:${port}`.bgCyan.white);
});
