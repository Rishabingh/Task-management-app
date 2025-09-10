import express from 'express';
import { __dirname } from '../path.js';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDb } from '../db/index.js';
import path from 'path'
import errorHandler from '../utils/errorHandler.js'
import userRoute from '../routes/user.routes.js';
import healthCheck from '../routes/healthcheck.routes.js';
import cookieParser from 'cookie-parser';
import todoRouter from '../routes/todo.routes.js'

dotenv.config({
  path: path.join(__dirname, ".env")
});

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credential: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
}))

app.use(express.json({limit: "16kb"}));
app.use(express.static(path.join(__dirname, "frontend")));
app.use(express.urlencoded({limit: "16kb"}));
app.use(cookieParser());

const port = process.env.PORT
const host = process.env.HOST

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"))
})

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "login.html"))
})


app.get('/src/output.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'output.css'));
});
app.use("/api/v2/user", userRoute);
app.use("/api/v2/todo", todoRouter);
app.use("/api/v2/health-check", healthCheck);



app.use(errorHandler)

connectDb()
  .then(
    app.listen(port, host, () => {
      console.log(`app is constantly listening on port: ${port} and on host: ${host}`)
    })
  ).catch(err => console.log("server req failed ❌", err));

