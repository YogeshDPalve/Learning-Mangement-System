import express from "express";
import "colors";
import dotenv from "dotenv";
import connectDb from "./database/db.js";


dotenv.config({});
const app = express();
const port = process.env.PORT || 4000;

// default middlewares
app.use(express.json());

// call database connection
connectDb();

app.listen(port, () => {
  console.log(`Server listen at http://localhost:${port}`.bgWhite);
});
