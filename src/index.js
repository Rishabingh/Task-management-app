import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import logInRoutes from "../routes/login.routes.js";
import registerRoutes from "../routes/register.routes.js"
import sendRoutes from "../routes/todo-send.routes.js"
import saveRoutes from "../routes/todo-save.routes.js";

dotenv.config({
  path: "./.env"
});

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type"]
  })
);

app.use(express.json({
  limit: "32kb"
}));

app.use(express.urlencoded({
  extended: "true",
  limit: "16kb"
}));

app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/todo.html"));
});

app.use("/api", logInRoutes);
app.use("/api", registerRoutes);
app.use("/api", sendRoutes);
app.use("/api", saveRoutes);

app.listen(process.env.PORT, process.env.HOST, () => {
  console.log(`server is running on port: ${process.env.PORT}and host: ${process.env.HOST}`);
}); 


