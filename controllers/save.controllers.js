import fs, { writeFile } from "fs/promises";
import { fileURLToPath } from "url";
import path from "path";
import { ApiResponse } from "../utils/api-response.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function saveTodo(req, res) {
  try {
    const { username, password } = req.body;

    const usersFile = path.join(__dirname, "..", "database", "users.json");

    const rowUsers = await fs.readFile(usersFile);
    const users = JSON.parse(rowUsers);
    const validatingUser = users.find(u => u.username === username && u.password === password);
    if(!validatingUser) return res.status(401).json({error: "wrong credentials"});

    const fileName = `${username}${password}.json`;

    const savePath = path.join(__dirname, "..", "database", "data", fileName);
    
    const todos = JSON.stringify(req.body.todo, null, 2);

    await writeFile(savePath, todos);

    res.status(200).json(new ApiResponse(200, "todos save successfully"));


  } catch (error) {
    console.log(error);
    res.status(500).json({error : "something went wrong in server during save"});
  }
}

export { saveTodo }