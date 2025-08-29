
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { ApiResponse } from '../utils/api-response.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function sendTodo(req, res) {
  try {
    const { username, password } = req.body;
    const userFilePath = path.join(__dirname, "..", "database", "users.json");

    const rowData = await fs.readFile(userFilePath, "utf-8");

    const users = JSON.parse(rowData);

    const isUserValid = users.find(u => u.username === username && u.password === password);
    if(!isUserValid) return res.status(401).json({error: "invalid credentials"});

    const userTodoFileName = `${username}${password}.json`;
    const todoFilePath = path.join(__dirname, "..", "database", "data", userTodoFileName);
    const todoRow = await fs.readFile(todoFilePath, "utf-8");

    const todos = JSON.parse(todoRow);

    res.status(200).json(new ApiResponse(200, todos));

  } catch (error) {
    console.log(error);
    res.status(500).json({error: "internal server error unable to send todo try again"})
  }
}

export { sendTodo }