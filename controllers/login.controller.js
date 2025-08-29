import fs from 'fs/promises';
import path from "path";
import { ApiResponse } from '../utils/api-response.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function loginUser(req, res) {
  const {username, password} = req.body;

  try {
    const userFile = path.join(__dirname, "..", "database", "users.json");

    const userData = await fs.readFile(userFile, "utf-8")
 
    const users = await JSON.parse(userData);

    const user = users.find(u => u.username === username && u.password === password);

    if(!user) return res.status(403).json({error: "invalid credentials"});


    res.status(200).json(new ApiResponse(200, user, "login successful"));
  } catch (error) {
      console.error("login Error:", error);
      res.status(500).json({ error: "internal server error" })
  }
}

export { loginUser }